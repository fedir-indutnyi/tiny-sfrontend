import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { WebdatarocksComponent } from '@webdatarocks/ngx-webdatarocks';
import { Subject, takeUntil } from 'rxjs';
import { CostPriceActions, Selectors } from '@businessplan-item/store/index';
import { Pnldata } from '@app/shared/sdk';

@Component({
  selector: 'app-cost-price',
  templateUrl: './cost-price.component.html',
  styleUrls: ['./cost-price.component.scss']
})
export class CostPriceComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject();
  costPricePivotData: Pnldata[] = []
  @ViewChild('pivot') pivotCmp: WebdatarocksComponent;
  constructor(private _store: Store) { }

  ngOnInit(): void {

    this._store.dispatch(CostPriceActions.init());

    this._store.select(Selectors.selectCostPricePivotState)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        if (!data.length) return;
        this.costPricePivotData = data;
        if (!this.pivotCmp) return;
        this.costPricePivotData = this.costPricePivotData.map((item)=> ({
            ...item, 
            factdate: new Date(item.factdate).getFullYear().toString() 
        }))
        this.pivotCmp.webDataRocks.updateData({ data: this.costPricePivotData });
      })
  }


  ngAfterViewInit() {
    this.pivotCmp.webDataRocks.setReport(this.initPivotTable());
  }


  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this._store.dispatch(CostPriceActions.init());
  }


  private initPivotTable(): WebDataRocks.Report {
    return {
      dataSource: {
        data: this.costPricePivotData
      },
      slice: {
        rows: [
          {
            uniqueName: "itemname",
            caption: "Product name"
          }
        ],
        columns: [
          {
            uniqueName: "Measures",
          },
          {
            uniqueName: "factdate",
            caption: "Cost Price per Year"
          },
        ],
        measures: [
          {
            uniqueName: "factvalue",
            aggregation: 'average'
          }
        ]
      },
      options: {
        grid: {
          showTotals: "off",
          showGrandTotals: "columns",
          showHeaders: false,
          showFilter: false,
          showReportFiltersArea: false,
          showHierarchies: false,


        },
        configuratorButton: true,
        configuratorActive: false,
        editing: false,
        drillThrough: false,
        showDefaultSlice: false,
        showCalculatedValuesButton: false,
        defaultHierarchySortName: 'unsorted',

      },
      formats: [
        {
          name: "",
          thousandsSeparator: " ",
          decimalSeparator: ".",
          decimalPlaces: 2,
          currencySymbol: "",
          currencySymbolAlign: "left",
          nullValue: "",
          textAlign: "right",
          isPercent: false
        }
      ]
    }
  }


}
