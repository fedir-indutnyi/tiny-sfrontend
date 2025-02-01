import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {PivotData} from "../../store/reducers/advanced-inflation-settings.reducer";
import {InflatoinMultipliersFormConfig, YearlyValues} from '../../typings/businessplan-forms.interface';
import {WebdatarocksComponent} from "@webdatarocks/ngx-webdatarocks";
import {Observable, Subject, takeUntil} from 'rxjs';
import {FormBuilder, FormGroup} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import {AdvancedInflationSettingsActions, BusinessPlanItemActions, Selectors} from '../../store';
import {AdvancedInflationSettings} from '@app/interfaces';
import {isCalculatingSelector} from "@businessplan-item/store/selectors/businessplan-item.selectors";

@Component({
    selector: 'app-advanced-inflation-settings',
    templateUrl: './advanced-inflation-settings.component.html',
    styleUrls: ['./advanced-inflation-settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class AdvancedInflationSettingsComponent implements OnInit {
    protected inflationMultipliersForm: FormGroup<InflatoinMultipliersFormConfig>;
    yearsList: number[];
    acceleration: YearlyValues[];
    @ViewChild('inflationPivot') inflationPivot: WebdatarocksComponent;
    @ViewChild('pricePivot') pricePivot: WebdatarocksComponent;
    @ViewChild('inflationAccumulatedPivot') inflationAccumulatedPivot: WebdatarocksComponent;
    @ViewChild('priceAccumulatedPivot') priceAccumulatedPivot: WebdatarocksComponent;

    inflationPivotData: PivotData[]
    pricePivotData: PivotData[]
    inflationAccumulatedPivotData: PivotData[]
    priceAccumulatedPivotData: PivotData[]

    startDate: Date = null;
    endDate: Date = null;
    componentName: string = 'app-advanced-inflation-settings';
    componentName$: Observable<string | null>;

    private readonly unsubscribe$: Subject<void> = new Subject();

    protected selectedData: AdvancedInflationSettings = null;

    constructor(private _fb: FormBuilder, private _store: Store) {
        this.componentName$ = this._store.pipe(select(isCalculatingSelector));
    }

    ngOnInit(): void {
        this._store.dispatch(AdvancedInflationSettingsActions.init())

        this._store.select(Selectors.selectAdvancedInflationSettingsState)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(data => {
                if (data.isInitial) {
                    this.inflationMultipliersForm = this._fb.group({
                        inflationMultipliers: this._fb.array(data.advancedInflationSettings.inflationMultipliers)
                    });
                }
                if (!data.isLoaded) return;
                if (!data.advancedInflationSettings.inflationMultipliers.length) return;

                let inflationData = data.advancedInflationSettings;
                this.selectedData = data.advancedInflationSettings;
                this.yearsList = this.selectedData.yearList;

                this.inflationMultipliersForm.patchValue(
                    {inflationMultipliers: this.selectedData.inflationMultipliers});

                if (inflationData.inflationSettingsPivotData.length) {
                    this.inflationPivotData = inflationData.inflationSettingsPivotData.map(val =>
                        ({name: val.name, year: val.year, data: val.inflationForProduct}));
                    this.pricePivotData = inflationData.inflationSettingsPivotData.map(val =>
                        ({name: val.name, year: val.year, data: val.priceForProduct}));
                    this.inflationAccumulatedPivotData = inflationData.inflationSettingsPivotData.map(val =>
                        ({name: val.name, year: val.year, data: val.inflationAccumulatedForProduct}));
                    this.priceAccumulatedPivotData = inflationData.inflationSettingsPivotData.map(val =>
                        ({name: val.name, year: val.year, data: val.priceAccumulatedForProduct}));

                    this.inflationPivot.webDataRocks.updateData({data: this.inflationPivotData});
                    this.pricePivot.webDataRocks.updateData({data: this.pricePivotData});
                    this.inflationAccumulatedPivot.webDataRocks.updateData({data: this.inflationAccumulatedPivotData});
                    this.priceAccumulatedPivot.webDataRocks.updateData({data: this.priceAccumulatedPivotData});
                }

                this.acceleration = this.selectedData.yearlyValues
            })


    }

    protected _applyMultipleInflationMultipliers(index: number, direction: 'right' | 'left') {
        this.inflationMultipliersForm.markAsTouched();
        var valueToApply = this.inflationMultipliersForm.controls.inflationMultipliers.controls[index].value;

        if (direction == 'left') {
            index--;
            for (index; index >= 0; index--) {
                this.inflationMultipliersForm.controls.inflationMultipliers.controls[index].setValue(valueToApply);
            }
            ;
            return;
        }

        index++;
        for (index; index < this.yearsList.length; index++) {
            this.inflationMultipliersForm.controls.inflationMultipliers.controls[index].setValue(valueToApply);
        }
    }

    ngOnDestroy(): void {
        //this._store.dispatch(BusinessPlanSettingsActions.init());

        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    onPivotReady(): void {
        this.inflationPivot.webDataRocks.setReport(this.initPivotTable(this.inflationPivotData, true));
        this.pricePivot.webDataRocks.setReport(this.initPivotTable(this.pricePivotData, true));
        this.inflationAccumulatedPivot.webDataRocks.setReport(this.initPivotTable(this.inflationAccumulatedPivotData));
        this.priceAccumulatedPivot.webDataRocks.setReport(this.initPivotTable(this.priceAccumulatedPivotData));
    }

    applyOptions(form: FormGroup<InflatoinMultipliersFormConfig>): void {
        this._store.dispatch(BusinessPlanItemActions.startCalculating({componentName: this.componentName}))
        form.markAsUntouched();

        let multipliersData = form.getRawValue()

        if (this.selectedData.inflationMultipliers.toString() !== multipliersData.inflationMultipliers.toString()) {

            this._store.dispatch(AdvancedInflationSettingsActions.updateInflationMultipliers({
                payload:
                    {
                        advancedInflationSettings: {
                            inflationMultipliers: multipliersData.inflationMultipliers
                        }
                    }
            }));
        }
        this._store.dispatch(BusinessPlanItemActions.localSaveData());
    };

    private initPivotTable(pivotData?: PivotData[], showInPercentrages: boolean = false): WebDataRocks.Report {
        return {
            dataSource: {
                data: pivotData
            },
            slice: {
                rows: [
                    {
                        uniqueName: "name",
                    }
                ],
                columns: [
                    {
                        uniqueName: "year",
                    },
                ],
                measures: [
                    {
                        uniqueName: "data",
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
                    isPercent: showInPercentrages
                }
            ]
        }
    }

}


