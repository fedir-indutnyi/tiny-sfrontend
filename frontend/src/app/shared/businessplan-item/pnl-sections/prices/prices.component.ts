import { AfterViewInit, Component,OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { WebdatarocksComponent } from '@webdatarocks/ngx-webdatarocks';
import { Subject, takeUntil } from 'rxjs';
import { CostPriceActions, Selectors } from '../../store';


declare function $(obj: any): any;

@Component({
  selector: 'app-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.scss']
})
export class PricesComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly unsubscribe$: Subject<void> = new Subject();
  pricesPivotData = []
  @ViewChild('pivot') pivotCmp: WebdatarocksComponent;
  constructor(private _store: Store) { }

  ngOnInit(): void {

    this._store.dispatch(CostPriceActions.init());

    this._store.select(Selectors.selectPricesPivotState)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        if (!data.length) return;
        this.pricesPivotData = data;
        if (!this.pivotCmp) return;

        this.pricesPivotData = this.pricesPivotData.map((item)=> ({
          ...item, 
          factdate: new Date(item.factdate).getFullYear().toString() 
      }))
        this.pivotCmp.webDataRocks.updateData({ data: this.pricesPivotData });
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
        data: this.pricesPivotData
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
            caption: "Price per Year"
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
        configuratorButton: false,
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
