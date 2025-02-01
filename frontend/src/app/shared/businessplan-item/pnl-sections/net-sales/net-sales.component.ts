import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { Store } from '@ngrx/store';
import { WebdatarocksComponent } from '@webdatarocks/ngx-webdatarocks';
import { Subject, takeUntil } from 'rxjs';
import {BusinessPlanItemActions, NetSalesActions, Selectors} from '@businessplan-item/store/index';
import { iNetSalesPivot } from '../../store/reducers/net-sales.reducer';
import { updateNetSalesSettings } from '../../store/actions/net-sales.actions';
import {selectNetSalesMonth} from "@businessplan-item/store/selectors/businessplan-item.selectors";


@Component({
  selector: 'app-net-sales',
  templateUrl: './net-sales.component.html',
  styleUrls: ['./net-sales.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NetSalesComponent implements OnInit {
  monthsShift: number;
  private readonly unsubscribe$: Subject<void> = new Subject();
  private pivotData: iNetSalesPivot[] = []

  @ViewChild('pivot') pivotCmp: WebdatarocksComponent;
  constructor(private _store: Store,private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {

    this._store.dispatch(NetSalesActions.init());

    this._store.select(Selectors.selectNetSalesMonth)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.monthsShift = data
        this.changeDetector.detectChanges()
      })

    this._store.select(Selectors.selectNetSalesPivotState)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        if (!data.length) return;
        this.pivotData = data;
        if (!this.pivotCmp) return;

        this.pivotCmp.webDataRocks.updateData({ data: this.setDataSource() });
      })
  }

  applyMonthsShift() {
    this._store.dispatch(NetSalesActions.updateNetSalesSettings({
      monthsShift: this.monthsShift
    }));

    this._store.dispatch(BusinessPlanItemActions.localSaveData())
  }

  ngAfterViewInit() {
    this.pivotCmp.webDataRocks.setReport(this.initPivotTable());
  }


  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this._store.dispatch(NetSalesActions.init());
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
            caption: "Title"
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
          // showGrandTotals: "columns",
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
