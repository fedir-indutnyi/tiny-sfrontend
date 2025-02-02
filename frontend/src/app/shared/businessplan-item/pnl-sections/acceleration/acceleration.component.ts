import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentRef,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Store} from '@ngrx/store';
import {NzFormTooltipIcon} from 'ng-zorro-antd/form';
import {map, Observable, of, Subject, takeUntil} from 'rxjs';
import {AccelerationActions, Selectors} from '../../store';
import {AccelerationData, State} from '../../store/reducers/acceleration.reducer';
import {AccelerateTrendHandler, AccelerationSettings, AccelerationTrendRecord} from './models';
import {LinealTrendService} from './typeOfGrowth/linear/lineal-trend.service';
import {LinearComponent} from './typeOfGrowth/linear/linear.component';
import {LogarithmicTrendService} from './typeOfGrowth/logarithmic/logarithmic-trend.service';
import {LogarithmicComponent} from './typeOfGrowth/logarithmic/logarithmic.component';


type TrendComponent = LinearComponent | LogarithmicComponent;

@Component({
    selector: 'app-acceleration',
    templateUrl: './acceleration.component.html',
    styleUrls: ['./acceleration.component.scss'],

    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccelerationComponent implements OnInit, OnDestroy {
    private readonly unsubscribe$: Subject<void> = new Subject();
    private _selectedTrendRecord!: AccelerationTrendRecord<TrendComponent>;
    trendRecords: AccelerationTrendRecord<TrendComponent>[] = this._initDataSource();
    private _initialTrendRecord: AccelerationTrendRecord<TrendComponent> = this.trendRecords[0];
    trendRecordCtrl: FormControl = new FormControl(this._initialTrendRecord);
    trendInputComponent: ComponentRef<TrendComponent>
    periods$: Observable<number[]>;
    values$: Observable<number[]>;
    trendType$: Observable<string>;
    private _periods: number[] = [];
    tooltipIcon: NzFormTooltipIcon = {
        type: 'info-circle',
        theme: 'outline'
    };

    @ViewChild('trendContainer', {read: ViewContainerRef}) trendContainer!: ViewContainerRef;

    constructor(private _store: Store,
                private _cdr: ChangeDetectorRef) {
    };

    ngOnInit() {
        let accelerationState: State;
        let isInitial = true;
        this._store.dispatch(AccelerationActions.init());

        this.trendRecordCtrl.valueChanges.pipe(takeUntil(this.unsubscribe$))
            .subscribe((record: AccelerationTrendRecord<TrendComponent>) => {
                this.trendType$ = of(record.type);
                this.values$ = of(accelerationState.acceleration.trendData);
                if (!this._selectedTrendRecord)
                    this._selectedTrendRecord = record;

                if (this._selectedTrendRecord.type !== record.type) {
                    this._resetTrendData(this._periods.length);
                }

                this._createTrendInput(record).pipe(takeUntil(this.unsubscribe$))
                    .subscribe((trendInputComponent) => {

                        if (accelerationState.isLoaded && this._selectedTrendRecord.type === record.type) {
                            trendInputComponent.setInput('monthSales', accelerationState.acceleration.trendSettings.months);
                            trendInputComponent.setInput('growthSales', accelerationState.acceleration.trendSettings.growths);
                            isInitial = !isInitial;
                        }
                    });
            });


        this._store.select(Selectors.selectBusinessPlanPeriodsState).pipe(
            map(periods => {
                return (Array.from({length: periods}, (v, k) => k + 1));
            }),
            takeUntil(this.unsubscribe$)
        ).subscribe((periods) => {
            this.periods$ = of(periods);
            this._periods = periods;
            this._cdr.detectChanges();
            this._store.dispatch(AccelerationActions.reset())
        })


        this._store.select(Selectors.selectAccelerationState).pipe(takeUntil(this.unsubscribe$))
            .subscribe((state) => {
                if (!state || !state.acceleration) return;
                if (state.isInitial) {
                    this._createTrendInput(this._initialTrendRecord);
                    this._resetTrendData(this._periods.length);
                    this.trendType$ = of(this._initialTrendRecord.type);
                    return;
                }

                const acceleration = state.acceleration;
                accelerationState = state;
                this._selectedTrendRecord = this.trendRecords.find(record => record.type === acceleration.trendType);

                let record = this._selectedTrendRecord || this.trendRecords[0];

                this.trendRecordCtrl.patchValue(record, {emitEvent: state.isLoaded});
            });

        this._store.select(Selectors.selectBusinessPlanPeriodsState).pipe(takeUntil(this.unsubscribe$))
            .subscribe((months) => {
                if (months && this.trendInputComponent.instance) this.trendInputComponent.instance.refreshComponent();
            })
    };


    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }


    private _createTrendInput(record: AccelerationTrendRecord<TrendComponent>, inputs?: {
        months: number[],
        growths: number[]
    }): Observable<ComponentRef<TrendComponent>> {
        this.trendContainer.clear();
        this.trendInputComponent = this.trendContainer.createComponent(record.component);

        this.trendInputComponent.instance.onApply.pipe(takeUntil(this.unsubscribe$))
            .subscribe((settings) => {
                console.log(3333333333)
                if (!this._periods.length) {
                    alert('Fill in Business Plan Details first and Apply those setting to calculator');
                    return
                }

                let data = {
                    type: record.type,
                    service: record.service,
                    settings: settings as AccelerationSettings
                }

                this._handleTrendData(data, this._updateStore.bind(this));
            });
        return of(this.trendInputComponent);
    }


    private _handleTrendData(data: {
        type: string,
        service: AccelerateTrendHandler,
        settings: AccelerationSettings
    }, callback: ({}: AccelerationData) => void) {
        data.service.setData({
            monthsSales: data.settings.monthsSales,
            expectedGrowthSalesAtMonth: data.settings.expectedGrowthSalesAtMonth,
            periodDuration: this._periods
        });

        let trend = data.service.calculateTrend();
        this.periods$ = of(trend.x);
        this.values$ = of(trend.y);

        callback({
            trendData: trend.y,
            trendType: data.type,
            trendSettings: {
                months: data.settings.monthsSales,
                growths: data.settings.expectedGrowthSalesAtMonth
            }
        });
    }


    private _initDataSource(): AccelerationTrendRecord<TrendComponent>[] {
        return [
            {
                type: 'Linear',
                component: LinearComponent,
                service: new LinealTrendService()
            },
            {
                type: 'Logarithmic',
                component: LogarithmicComponent,
                service: new LogarithmicTrendService()
            }
        ];
    }

    private _resetTrendData(periodsLength: number) {
        let emptyData = Array.from({length: periodsLength}, () => 0)
        this.values$ = of(emptyData);
    }

    private _updateStore(data: AccelerationData) {
        this._store.dispatch(AccelerationActions.update({payload: {acceleration: data}}));
        this._store.dispatch(AccelerationActions.updateStateSucceeded())
    }
}
