import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BusinessPlanItemActions, InvestmentsRequiredActions, Selectors } from '../../store';
import { Subject, takeUntil } from 'rxjs';
import { WebdatarocksComponent } from 'ng-webdatarocks';
import { PivotCell } from '@app/shared/sdk/model/pivotCell';
import { displayInPercentage, validateFromPercentage } from '../../businessplan-item.functions';

@Component({
  selector: 'app-investments-required',
  templateUrl: './investments-required.component.html',
  styleUrls: ['./investments-required.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvestmentsRequiredComponent implements OnInit{

  private readonly unsubscribe$: Subject<void> = new Subject();
  protected readonly componentName = 'app-investments-required';

  constructor(private _fb: FormBuilder, private _store: Store) { }
  
  form: FormGroup = this._fb.group({
    safetyPillow: this._fb.control(1)
  });
  @ViewChild("investmentsRequired") investmentsRequired: WebdatarocksComponent;
  pivotData: PivotCell[] = [];

  applyChanges(){

    let safetyPillow = this.form.getRawValue().safetyPillow;
    this._store.dispatch(BusinessPlanItemActions.startCalculating({componentName: this.componentName}))
    this._store.dispatch(InvestmentsRequiredActions.updateInvestmentsRequiredTable({ 
      payload: {safetyPillow: validateFromPercentage(safetyPillow)}
    }));  
    this._store.dispatch(BusinessPlanItemActions.localSaveData())
    console.log('Investment Required table data', safetyPillow);
  }

  ngOnInit(): void {
    this._store.dispatch(InvestmentsRequiredActions.init());
    this._store.select(Selectors.selectInvestmentsRequiredState)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((data) => {
            if (!data.investmentsRequiredPivotData.length) return;
            this.form.patchValue({safetyPillow: displayInPercentage(data.safetyPillow || 0)});
            this.pivotData = data.investmentsRequiredPivotData;
            this.investmentsRequired.webDataRocks.updateData({data: this.setDataSource(this.pivotData)});
        })
  }

  private setDataSource = (data: any[]) => {
    return [
      this.pivotTableConfig,
      ...data
    ]
  }

  ngOnDestroy(): void {
      this._store.dispatch(InvestmentsRequiredActions.init());
  
      this.unsubscribe$.next();
      this.unsubscribe$.complete()
  }
  
  onPivotReady(): void {
    this.investmentsRequired.webDataRocks.setReport( this.initPivotTable(this.setDataSource(this.pivotData)) );
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

  private initPivotTable(data: any[]): WebDataRocks.Report {
    return {
      dataSource: {
        data: data,
      },
      slice: {
        rows: [
          {
            uniqueName: "title",
            caption: 'Investments Required',
          }

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
        ],
        measures: [
          {
            uniqueName: "amount",
            caption: 'amount'
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
