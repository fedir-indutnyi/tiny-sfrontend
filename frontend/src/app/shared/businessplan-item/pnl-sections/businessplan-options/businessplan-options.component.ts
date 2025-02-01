import {ApplicationRef, ChangeDetectionStrategy, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {select, Store} from "@ngrx/store";
import {Observable, pairwise, Subject, takeUntil} from "rxjs";
import {BusinessplanSetting, OptionsFormConfig} from "src/app/interfaces";
import {displayInPercentage, validateFromPercentage} from "../../businessplan-item.functions";
import {BusinessPlanItemActions, BusinessPlanSettingsActions, Selectors} from "../../store";
import {
    CategoriesDict,
    CurrencyDict,
    DEFAULT_UOM,
    DEFAULT_YEARLY_INFLATION,
    DEFAULT_YEARLY_PRICE_INCREASE,
    DEFAULT_YEARLY_SALARY_INCREASE,
    RecordTypeDict
} from "./options-form.models";
import {NzFormTooltipIcon} from "ng-zorro-antd/form";
import {TitlesDescription} from "./models";
import {isCalculatingSelector} from "@businessplan-item/store/selectors/businessplan-item.selectors";
import {TriggerActionService} from "@shared/services";
import { AccountService } from "@app/shared/account/account.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { TranslateService } from "@ngx-translate/core";


@Component({
    selector: "businessplan-options",
    templateUrl: "./businessplan-options.component.html",
    styleUrls: ["./businessplan-options.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BusinessplanOptionsComponent implements OnInit, OnDestroy {
    protected optionsForm!: FormGroup<OptionsFormConfig>;
    currencyList = CurrencyDict;
    recordTypeList = RecordTypeDict;
    categoriesList = CategoriesDict;
    showCurrencyValidationMessage: boolean = false;
    monthFormat = 'yyyy/MM';
    tooltipIcon: NzFormTooltipIcon = {
        type: 'info-circle',
        theme: 'outline'
    };
    tooltipTitle = TitlesDescription;
    private readonly unsubscribe$: Subject<void> = new Subject();
    protected selectedData: BusinessplanSetting = null;
    componentName: string = 'businessplan-options'
    componentName$: Observable<string | null>;
    @ViewChild('notification') freeNotification;

    constructor(private _fb: FormBuilder,
                private _store: Store,
                private appRef: ApplicationRef,
                private triggerActionService: TriggerActionService,
                protected accountService: AccountService,
                private notification: NzNotificationService
    ) {
        this.componentName$ = this._store.pipe(select(isCalculatingSelector));
    };

    ngOnInit(): void {
        this._store.dispatch(BusinessPlanSettingsActions.init())

        this._store.select(Selectors.selectBusinessPlanSettingsState)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(data => {
                this.triggerActionService.switchInflationSettings(data.businessplanSettings.isInflation.valueOf())
                this.selectedData = data.businessplanSettings;
                if (data.isInitial) this.optionsForm = this._initEditForm(data.businessplanSettings);
                if (!data.isLoaded) return;

                let optionsData = data.businessplanSettings;

                this.optionsForm.patchValue({
                    address: optionsData.address,
                    currency: optionsData.currency,
                    name: optionsData.nameOfPlan,
                    uom: optionsData.UOM,
                    periodEndDate: optionsData.endPeriod,
                    yearlyInflationRate: displayInPercentage(optionsData.yearlyInflationRate),
                    yearlyPriceIncrease: displayInPercentage(optionsData.yearlyPriceIncrease),
                    yearlySalaryIncrease: displayInPercentage(optionsData.yearlySalaryIncrease),
                    period: {
                        startDate: optionsData.startPeriod,
                        months: optionsData.periods
                    },
                    description: optionsData.description,
                    isInflation: optionsData.isInflation,
                    actualConsumer: optionsData.actualConsumer,
                });


            });

        this.optionsForm.controls.period.valueChanges.pipe(
            pairwise(),
            takeUntil(this.unsubscribe$)
        ).subscribe(([prev, next]: [any, any]) => {
            if (!prev) return;

            if (!next.startDate && this.optionsForm.controls.periodEndDate.value) {
                this.optionsForm.controls.periodEndDate.reset(null, {emitEvent: false});
            }

            if (!next.startDate || !next.months) return;

            setTimeout(() => {
                if(next.months > 12 && this.accountService.currentUserSubscription?.name != 'pro'){
                    this.optionsForm.controls.period.controls.months.setValue(12, {emitEvent: false});
                    this.notification.template(this.freeNotification, {nzDuration: 99999})
                    return
                }
                let endDate: Date = this._calcEndPeriod(next.startDate, next.months)
                this.optionsForm.controls.periodEndDate.patchValue(endDate, {emitEvent: false});
            });

        });

    }

    addCurrency(input: HTMLInputElement): void {
        const value = input.value.toUpperCase();
        if (!value) return;
        if (this.currencyList.indexOf(value) !== -1) {
            this.showCurrencyValidationMessage = !this.showCurrencyValidationMessage;
            return;
        }

        this.currencyList = [...this.currencyList, value,];
        input.value = '';
    }

    applyOptions(form: FormGroup<OptionsFormConfig>) {
        this._store.dispatch(BusinessPlanItemActions.startCalculating({componentName: this.componentName}))
        form.markAsUntouched();

        let formValues = form.getRawValue();

        let optionsData = {
            address: formValues.address,
            currency: formValues.currency,
            nameOfPlan: formValues.name,
            UOM: formValues.uom,
            endPeriod: formValues.periodEndDate,
            startPeriod: formValues.period.startDate,
            periods: formValues.period.months,
            yearlyInflationRate: validateFromPercentage(formValues.yearlyInflationRate),
            yearlyPriceIncrease: validateFromPercentage(formValues.yearlyPriceIncrease),
            yearlySalaryIncrease: validateFromPercentage(formValues.yearlySalaryIncrease),
            itemType: this.selectedData.itemType,
            description: formValues.description,
            isInflation: formValues.isInflation,
            inflationHistory: this.selectedData.inflationHistory,
            actualConsumer: formValues.actualConsumer,
            consumersList: this.selectedData.consumersList
        };

        if (this.selectedData.periods !== optionsData.periods) {
            this._store.dispatch(BusinessPlanSettingsActions.updatePeriods({
                payload: {
                    periods: optionsData.periods,
                    startPeriod: optionsData.startPeriod,
                    endPeriod: optionsData.endPeriod
                }
            }));
        }

        if (this.selectedData.yearlyInflationRate !== optionsData.yearlyInflationRate ||
            this.selectedData.yearlyPriceIncrease !== optionsData.yearlyPriceIncrease ||
            this.selectedData.yearlySalaryIncrease !== optionsData.yearlySalaryIncrease ||
            this.selectedData.UOM !== optionsData.UOM ||
            this.selectedData.isInflation !== optionsData.isInflation) {
            this._store.dispatch(BusinessPlanSettingsActions.updateAcceleration({
                payload:
                    {
                        businessPlanSettings:
                            {
                                yearlyInflationRate: optionsData.yearlyInflationRate,
                                yearlyPriceIncrease: optionsData.yearlyPriceIncrease,
                                yearlySalaryIncrease: optionsData.yearlySalaryIncrease,
                                UOM: optionsData.UOM,
                                isInflation: optionsData.isInflation

                            }
                    }
            }));

        }
        this._store.dispatch(BusinessPlanSettingsActions.update({payload: {businessPlanSettings: optionsData}}))
        this._store.dispatch(BusinessPlanItemActions.localSaveData());
    };

    ngOnDestroy(): void {
        this._store.dispatch(BusinessPlanSettingsActions.init());

        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    private _initEditForm(optionsData: BusinessplanSetting) {
        return this._fb.group({
            name: this._fb.nonNullable.control(optionsData.nameOfPlan || null, [Validators.required]),
            period: this._fb.nonNullable.group({
                startDate: this._fb.control(optionsData.startPeriod, [Validators.required]),
                months: this._fb.control(optionsData.periods || null, [Validators.required])
            }),
            periodEndDate: this._fb.control(optionsData.endPeriod || null, [Validators.required]),
            currency: this._fb.control(optionsData.currency || null, [Validators.required]),
            yearlyInflationRate: this._fb.control(displayInPercentage(optionsData.yearlyInflationRate) || DEFAULT_YEARLY_INFLATION, [Validators.required]),
            yearlyPriceIncrease: this._fb.control(displayInPercentage(optionsData.yearlyPriceIncrease) || DEFAULT_YEARLY_PRICE_INCREASE, [Validators.required]),
            yearlySalaryIncrease: this._fb.control(displayInPercentage(optionsData.yearlySalaryIncrease) || DEFAULT_YEARLY_SALARY_INCREASE, [Validators.required]),
            uom: this._fb.control(optionsData.UOM || DEFAULT_UOM, [Validators.required]),
            address: this._fb.control(optionsData.address || null),
            description: this._fb.control(optionsData.description),
            isInflation: this._fb.control(optionsData.isInflation),
            actualConsumer: this._fb.control(optionsData.actualConsumer)
        })
    }


    private _calcEndPeriod(date: Date, months: number): Date {
        let dateCopy: Date = new Date(date);
        dateCopy.setMonth((dateCopy.getMonth() - 1) + months);
        return new Date(dateCopy);
    }

    protected addIndustry(input: HTMLInputElement){
        this.selectedData.consumersList.unshift(input.value)
    }

    protected toggleInflation() {
        this.optionsForm.markAsTouched()

        if (this.optionsForm.controls.isInflation.value) {
            this.triggerActionService.switchInflationSettings(false)

            this.selectedData.inflationHistory.yearlyInflationRate =
                validateFromPercentage(this.optionsForm.controls.yearlyInflationRate.value);
            this.selectedData.inflationHistory.yearlyPriceIncrease =
                validateFromPercentage(this.optionsForm.controls.yearlyPriceIncrease.value);
            this.selectedData.inflationHistory.yearlySalaryIncrease =
                validateFromPercentage(this.optionsForm.controls.yearlySalaryIncrease.value);

            this.optionsForm.controls.yearlyInflationRate.setValue(0);
            this.optionsForm.controls.yearlyPriceIncrease.setValue(0);
            this.optionsForm.controls.yearlySalaryIncrease.setValue(0);
            return;
        }

        this.triggerActionService.switchInflationSettings(true)

        this.optionsForm.controls.yearlyInflationRate.setValue(
            displayInPercentage(this.selectedData.inflationHistory.yearlyInflationRate));
        this.optionsForm.controls.yearlyPriceIncrease.setValue(
            displayInPercentage(this.selectedData.inflationHistory.yearlyPriceIncrease));
        this.optionsForm.controls.yearlySalaryIncrease.setValue(
            displayInPercentage(this.selectedData.inflationHistory.yearlySalaryIncrease));
    }
}


