import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzFormTooltipIcon} from 'ng-zorro-antd/form';
import {
    displayInPercentage,
    validateFromPercentage
} from 'src/app/shared/businessplan-item/businessplan-item.functions';
import {NgZorroModule} from 'src/app/shared/ng-zorro/ng-zorro.module';
import {AccelerateTrendData, AccelerationTrend} from '../../models';
import {TranslateModule} from "@ngx-translate/core";
import {select, Store} from "@ngrx/store";
import {BusinessPlanItemActions} from '@app/shared/businessplan-item/store';
import {Observable} from "rxjs";
import {isCalculatingSelector} from "@businessplan-item/store/selectors/businessplan-item.selectors";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {AsyncPipe, NgIf} from "@angular/common";

@Component({
    selector: 'app-logarithmic',
    standalone: true,
    imports: [NgZorroModule, ReactiveFormsModule, TranslateModule, NzSpinModule, AsyncPipe, NgIf],
    providers: [],
    templateUrl: './logarithmic.component.html',
    styleUrls: ['./logarithmic.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogarithmicComponent implements AccelerationTrend, OnInit, OnChanges {
    componentName: string = 'app-acceleration';
    componentName$: Observable<string | null>;
    @Input() monthSales: number[] = [];
    @Input() growthSales: number[] = [];
    @Output() onApply = new EventEmitter<AccelerateTrendData>();

    tooltipIcon: NzFormTooltipIcon = {
        type: 'info-circle',
        theme: 'outline'
    };
    form: FormGroup = this._initForm();

    constructor(private _fb: FormBuilder, private _store: Store,) {
        this.componentName$ = this._store.pipe(select(isCalculatingSelector));
    }

    ngOnInit() {
    }


    ngOnChanges(changes: SimpleChanges) {
        if (changes.monthSales && changes.monthSales.currentValue.length ||
            changes.growthSales && changes.growthSales.currentValue.length) {

            const startMonthSales = changes.monthSales.currentValue[0];
            const expectedMonthsFullSales = changes.monthSales.currentValue[1];

            const expectedMonthGrowthSales = changes.growthSales.currentValue[0];
            // const expectedMonthsFullGrowthSales = changes.growthSales.currentValue[1]; //100%

            this.form.patchValue({
                startMonthSales: startMonthSales,
                expectedMonthGrowthSales: displayInPercentage(expectedMonthGrowthSales),
                expectedMonthsFullSales: expectedMonthsFullSales,
            });
        }
    }

    applyChanges() {
        this._store.dispatch(BusinessPlanItemActions.startCalculating({componentName: this.componentName}))
        this.refreshComponent()
        this._store.dispatch(BusinessPlanItemActions.localSaveData());
    }

    public refreshComponent(){
        this.onApply.emit({
            monthsSales: [this.form.value.startMonthSales, this.form.value.expectedMonthsFullSales],
            expectedGrowthSalesAtMonth: [validateFromPercentage(this.form.value.expectedMonthGrowthSales), 1],
        });
    }

    private _initForm() {
        let form = this._fb.nonNullable.group({
            startMonthSales: this._fb.nonNullable.control(1, [Validators.required]),
            expectedMonthGrowthSales: this._fb.nonNullable.control(30, [Validators.required]),
            expectedMonthsFullSales: this._fb.nonNullable.control(12, [Validators.required]),
        });

        return form;
    }
}
