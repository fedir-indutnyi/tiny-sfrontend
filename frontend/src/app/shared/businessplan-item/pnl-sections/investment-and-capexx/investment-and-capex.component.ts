import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { investmentAndCapexTableConfig } from './tableConfig';
import { iDynamicTableDataSource, iDynamicTableFormConfig } from '../../shared/dynamic-table-form/models';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { BusinessPlanItemActions, InvestmentAndCapexActions, Selectors } from '../../store';
import { Store } from '@ngrx/store';
import { validateFromPercentage } from '../../businessplan-item.functions';
import { InvestmentAndCapex, InvestmentAndCapexPivotData, State } from '../../store/reducers/investment-and-capex.reducer';
import { WebdatarocksComponent } from 'ng-webdatarocks';
import { InitialState } from '../../store/initial-store';

@Component({
  selector: 'app-investment-and-capex',
  templateUrl: './investment-and-capex.component.html',
  styleUrls: ['./investment-and-capex.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvestmentAndCapexComponent implements OnInit{
    
    private readonly unsubscribe$: Subject<void> = new Subject();
    protected dataSource$: Observable<State>;

    protected readonly componentName = 'app-investment-and-capex';
    protected investmentAndCapexTableConfig: iDynamicTableFormConfig<string | number | boolean> = investmentAndCapexTableConfig;
    protected investmentAndCapexSource: Observable<iDynamicTableDataSource[]>;

    @ViewChild("assetsAvaliabilityPivot") assetsAvaliabilityPivot: WebdatarocksComponent;
    @ViewChild("montlyCapexInvestmentPivot") montlyCapexInvestmentPivot: WebdatarocksComponent;
    @ViewChild("assetsDepriciationPivot") assetsDepriciationPivot: WebdatarocksComponent;
    @ViewChild("inventoryIncreasePivot") inventoryIncreasePivot: WebdatarocksComponent;

    pivotData: InvestmentAndCapexPivotData = InitialState.investmentAndCapex.pivotData;

    constructor(private _store: Store) {}

    ngOnInit(): void {
        this.dataSource$ = this._store.select(Selectors.selectInvestmentAndCapexState).pipe(takeUntil(this.unsubscribe$));
        this.investmentAndCapexSource = this.dataSource$.pipe(
          map((state) => { return state.tableData?.map(investment => ({...investment}))})
        );

        this.dataSource$.subscribe((investmentAndCapex) => {
          if (!investmentAndCapex.pivotData.assetsAvaliabilityPivotData.length) return;
          this.pivotData = investmentAndCapex.pivotData;

          this.assetsAvaliabilityPivot.webDataRocks.updateData({data: this.setDataSource(this.pivotData.assetsAvaliabilityPivotData)})
          this.montlyCapexInvestmentPivot.webDataRocks.updateData({data: this.setDataSource(this.pivotData.montlyCapexInvestmentPivotData)});
          this.assetsDepriciationPivot.webDataRocks.updateData({data: this.setDataSource(this.pivotData.assetsDepriciationPivotData)});
          this.inventoryIncreasePivot.webDataRocks.updateData({data: this.setDataSource(this.pivotData.inventoryIncreasePivotData)});
    })
    }

    private setDataSource = (data: any[]) => {
        return [
          this.pivotTableConfig,
          ...data
        ]
      }

    ngOnDestroy(): void {
        this._store.dispatch(InvestmentAndCapexActions.init());
    
        this.unsubscribe$.next();
        this.unsubscribe$.complete()
    }

    onPivotReady(): void {
        this.assetsAvaliabilityPivot.webDataRocks.setReport( this.initPivotTable(this.setDataSource(this.pivotData.assetsAvaliabilityPivotData, ), 'Assets Avaliability and Renewal', 'min') );
        this.montlyCapexInvestmentPivot.webDataRocks.setReport( this.initPivotTable(this.setDataSource(this.pivotData.montlyCapexInvestmentPivotData), 'Montly CAPEX Investment' ))
        this.assetsDepriciationPivot.webDataRocks.setReport( this.initPivotTable(this.setDataSource(this.pivotData.assetsDepriciationPivotData), 'Assets Depriciation' ))
        this.inventoryIncreasePivot.webDataRocks.setReport( this.initPivotTable(this.setDataSource(this.pivotData.inventoryIncreasePivotData), 'Inventory Increase' ))
    }

    onApply(investmentAndCapex: iDynamicTableDataSource[]): void {
        this._store.dispatch(BusinessPlanItemActions.startCalculating({componentName: this.componentName}))
        investmentAndCapex = investmentAndCapex.map((investment) => ({ ...investment}));
        this._store.dispatch(InvestmentAndCapexActions.updateInvestmentAndCapexTable({payload: {tableData: investmentAndCapex as unknown as InvestmentAndCapex[]}}))
        this._store.dispatch(BusinessPlanItemActions.localSaveData())
        console.log('Investment and Capex table data', investmentAndCapex);
    };

    private pivotTableConfig = {
        "date": {
            type: "string"
        },
        "key": {
            type: "string"
        },
        "year": {
            type: "number"
        },
        "value": {
            type: "number"
        },
    }

    private initPivotTable(data: any[], nameOfPivot: string, aggregationType: string = 'sum'): WebDataRocks.Report {
        return {
          dataSource: {
            data: data,
          },
          slice: {
            rows: [
              {
                uniqueName: "key",
                caption: nameOfPivot,
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
                uniqueName: "value",
                caption: 'value',
                aggregation: aggregationType
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

