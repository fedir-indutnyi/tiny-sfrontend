import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { iDynamicTableDataSource, iDynamicTableFormConfig } from '@businessplan-item/shared/dynamic-table-form/models';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { BusinessPlanItemActions, HeadcountAndPayrollActions, Selectors } from '../../store';
import { Headcount, Payroll } from '../../typings';
import { headcountConfig, payrollConfig } from './tableConfig';
import { State } from '../../store/reducers/headcount-and-payroll.reducer';
import { WebdatarocksComponent } from '@webdatarocks/ngx-webdatarocks';
import { displayInPercentage, validateFromPercentage } from '../../businessplan-item.functions';

@Component({
  selector: 'app-headcount-and-payroll',
  templateUrl: './headcount-and-payroll.component.html',
  styleUrls: ['./headcount-and-payroll.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeadcountAndPayrollComponent implements OnInit, OnDestroy{
  private readonly unsubscribe$: Subject<void> = new Subject();
  protected dataSource$: Observable<State>;
  componentName: string = 'app-headcount-and-payroll';

  protected headcountTableConfig: iDynamicTableFormConfig<string | number | boolean> = headcountConfig;
  protected payrollTableConfig: iDynamicTableFormConfig<string | number | boolean> = payrollConfig;
  protected headcountSource: Observable<iDynamicTableDataSource[]>;
  protected payrollSource: Observable<iDynamicTableDataSource[]>;
  private pivotData = [];
  private numberOfPeoplePivotData = [];

  @ViewChild('pivotOthers') headcountPivot: WebdatarocksComponent;
  @ViewChild('pivotNumberOfPeople') numberOfPeoplePivot: WebdatarocksComponent;

  constructor(private _store: Store) {}

  ngOnInit(): void {
    this.dataSource$ = this._store.select(Selectors.selectHeadcountAndPayroll).pipe(takeUntil(this.unsubscribe$));
    this.headcountSource = this.dataSource$.pipe(
      map((state) => { return state.tableData.headcount.map(employee => {return {
        ...employee,
        salaryTax: displayInPercentage(employee.salaryTax),
        extraPayments: displayInPercentage(employee.extraPayments)
      }})})
    );
    this.payrollSource = this.dataSource$.pipe(
      map((state) => state.tableData.payroll.map((payroll) => {return {...payroll}}))
    )

    this.dataSource$.subscribe((headcountData) => {
      if (!headcountData.pivotData.numberOfEmployees.length) return;
      this.numberOfPeoplePivotData = headcountData.pivotData.numberOfEmployees;
      this.pivotData = Array.prototype.concat(...Object.values(headcountData.pivotData).slice(1))

      this.numberOfPeoplePivot.webDataRocks.updateData({data: this.setDataSource(this.numberOfPeoplePivotData)})
      this.headcountPivot.webDataRocks.updateData({data: this.setDataSource(this.pivotData)});
    })
  }

  private setDataSource = (data: any[]) => {
    return [
      this.pivotTableConfig,
      ...data
    ]
  }

  private pivotTableConfig = {
    'key': {
      type: "string",
    },
    'pnlRow': {
      type: 'string'
    },
    'pivotDescription': {
      type: 'string'
    },
    'year': {
      type: 'number'
    },
    'month': {
      type: 'string'
    },
    'value': {
      type: 'number'
    }
  }

  onPivotReady(): void {
    this.headcountPivot.webDataRocks.setReport( this.initPivotTable(this.setDataSource(this.pivotData)) );
    this.numberOfPeoplePivot.webDataRocks.setReport( this.initPivotTable(this.setDataSource(this.numberOfPeoplePivotData), false ))
  }

  ngOnDestroy(): void {
    this._store.dispatch(HeadcountAndPayrollActions.init());

    this.unsubscribe$.next();
    this.unsubscribe$.complete()
  }

  onApplyHeadcount(headcount: iDynamicTableDataSource[]): void {
    this._store.dispatch(BusinessPlanItemActions.startCalculating({componentName: this.componentName}))
    headcount = headcount.map((employee) => { return {
      ...employee,
      salaryTax: validateFromPercentage(employee.salaryTax as number),
      extraPayments: validateFromPercentage(employee.extraPayments as number)
    }});
    this._store.dispatch(HeadcountAndPayrollActions.updateHeadcount({payload: {headcount: headcount as unknown as Headcount[]}}))
    this._store.dispatch(BusinessPlanItemActions.localSaveData())
    console.log('Headcount table data', headcount);
  };

  onApplyPayroll(payroll: iDynamicTableDataSource[]): void {
    this._store.dispatch(BusinessPlanItemActions.startCalculating({componentName: this.componentName}))
    payroll = payroll.map((payroll) => { return { ...payroll}});
    this._store.dispatch(HeadcountAndPayrollActions.updatePayroll({payload: {payroll: payroll as unknown as Payroll[]}}))
    this._store.dispatch(BusinessPlanItemActions.localSaveData())
    console.log('Payroll table data', payroll);
  };

  private initPivotTable(data: any[], showPivotDescription: boolean = true): WebDataRocks.Report {
    return {
      dataSource: {
        data: data,
      },
      slice: {
        rows: [
          showPivotDescription ? {uniqueName: "pivotDescription", caption: "Pivot Description"} : undefined ,
          {
            uniqueName: "key",
            caption: "Job title"
          },
          {
            uniqueName: "pnlRow",
            caption: "pnlRow"
          },

        ],
        columns: [
          {
            uniqueName: "year",
            caption: "Periods per Year"
          },
          {
            uniqueName: "month",
            caption: "Periods per Month"
          },
        ],
        measures: [
          {
            uniqueName: "value",
            caption: 'value'
          }
        ]
      },
      options: {
        grid: {
          type: 'classic',
          showTotals: "columns",
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
