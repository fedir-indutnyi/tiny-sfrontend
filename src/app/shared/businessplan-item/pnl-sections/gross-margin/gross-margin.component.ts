import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { WebdatarocksComponent } from '@webdatarocks/ngx-webdatarocks';
import { Subject, takeUntil } from 'rxjs';
import { Selectors, NetSalesActions, GrossMarginActions } from '../../store';

@Component({
  selector: 'app-gross-margin',
  templateUrl: './gross-margin.component.html',
  styleUrls: ['./gross-margin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GrossMarginComponent {
  private readonly unsubscribe$: Subject<void> = new Subject();
  private pivotData = []

  @ViewChild('pivot') pivotCmp: WebdatarocksComponent;
  constructor(private _store: Store) { }


  ngOnInit(): void {

    this._store.dispatch(GrossMarginActions.init());

    this._store.select(Selectors.selectGrossMarginPivotState)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        if (!data.length) return;
        this.pivotData = data;
        if (!this.pivotCmp) return;
        this.pivotCmp.webDataRocks.updateData({ data: this.setDataSource() });
      })
  }


  ngAfterViewInit() {
    this.pivotCmp.webDataRocks.setReport(this.initPivotTable());
  }


  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this._store.dispatch(GrossMarginActions.init());
  }

  private setDataSource = () => {
    return [
      this.pivotTableConfig,
      ...this.pivotData
    ]
  }

  private pivotTableConfig = {
    "date": {
      type: "string"
    },
    "title": {
      type: "string"
    },
    "year": {
      type: "number"
    },
    "amount": {
      type: "number"
    },
  }

  private initPivotTable(): WebDataRocks.Report {
    return {
      dataSource: {
        data: this.setDataSource(),
      },
      slice: {
        rows: [
          {
            uniqueName: "title",
            caption: "Title",
            sort:"unsorted"
          },

        ],
        columns: [
          {
            uniqueName: "year",
            caption: "Periods per Year"
          },
          {
            uniqueName: "date",
            caption: "Periods per Month"
          },
          {
            uniqueName: "Measures",
          },


        ],
        measures: [
          {
            uniqueName: "amount",
            aggregation: 'sum',
          }
        ]
      },
      options: {
        grid: {
          showTotals: "on",
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
        datePattern: "MM/yyyy",
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
