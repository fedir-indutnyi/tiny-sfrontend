import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {concatMap, from, map, Observable, Subject, Subscription, takeUntil, throwError, toArray} from "rxjs";
import {catchError} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {NzProgressModule} from "ng-zorro-antd/progress";
import {NzDescriptionsModule} from "ng-zorro-antd/descriptions";
import { HttpEventType } from "@angular/common/http";
import {NzButtonModule} from "ng-zorro-antd/button";

import {CommonModule} from '@angular/common';
import {
    AggregateSalesDataActions,
    CostPriceActions,
    EbitOperatingProfitActions,
    GrossMarginActions,
    Selectors,
    VolumeActions
} from '../businessplan-item/store';
import {
    IdeastartuplistControllerService,
    IdeastartuplistWithRelations,
    Pnldata,
    PnldataControllerService,
    PnldataWithRelations
} from "@shared/sdk";
import {LoaderService} from "@shared/loader/loader.service";
import {BusinessplanItemModule} from '@businessplan-item/businessplan-item.module';

@Component({
    selector: 'app-pnl-data-post',
    standalone: true,
    imports: [CommonModule, BusinessplanItemModule, NzButtonModule, NzProgressModule, NzDescriptionsModule],
    templateUrl: './pnl-data.post.component.html',
    styleUrls: ['./pnl-data.post.component.scss'],
})
export class PnlDataPostComponent implements OnInit, OnDestroy {
    private readonly unsubscribe$: Subject<void> = new Subject<void>();
    costPriceData: Pnldata[];
    pricesData: Pnldata[];
    targetedAudienceData: Pnldata[];
    visitorsData: Pnldata[];
    customersData: Pnldata[];
    volumeData: Pnldata[];
    ebitData: Pnldata[];
    investmentAndCapex: Pnldata[];
    investmentRequired: Pnldata[];
    uploadErr: { err: boolean, message: string | null };
    isDisabledSaveButton: boolean = false;
    isDone: boolean = false;
    commonLoader: { value: number, previousValue?: number } = {value: 0};
    private initialLoaderSubscription: Subscription;
    private uploadLimit: number = 1000;
    readonly unknownError: number = 520;
    initialLoadingState: boolean = true;
    isPnlDataLoaded: boolean = false;
    draft: object;
    currencyValue: string;

    @Input() businessPlan: IdeastartuplistWithRelations;

    constructor(private store: Store,
                private pnlService: PnldataControllerService,
                private loaderService: LoaderService,
                private postService: IdeastartuplistControllerService,
    ) {
    };

    ngOnInit(): void {
        this.initialLoaderSubscription = this.loaderService.loaderState.subscribe(value => {
            this.initialLoadingState = value.show;
            this.draft = JSON.parse(this.businessPlan.ideabusinessplansetup_draft);
            this.currencyValue = this.draft['businessplanSetting']['currency'];
        });

        this.store.dispatch(CostPriceActions.init());
        this.store.dispatch(AggregateSalesDataActions.init());
        this.store.dispatch(VolumeActions.init());
        this.store.dispatch(GrossMarginActions.init());
        this.store.dispatch(EbitOperatingProfitActions.Init());

        this.store.select(Selectors.selectCostPricePivotState)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data) => {
                if (data?.length) this.costPriceData = data.map(item => ({...item, currency: this.currencyValue}));
            });

        this.store.select(Selectors.selectPricesPivotState)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data) => {
                if (data?.length) this.pricesData = data.map(item => ({...item, currency: this.currencyValue}));
            });


        this.store.select(Selectors.selectTargetedAudienceDataState)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data) => {
                if (data?.length) this.targetedAudienceData = data;
            });

        this.store.select(Selectors.selectVisitorsDataState)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data) => {
                if (data?.length) this.visitorsData = data;
            });

        this.store.select(Selectors.selectCustomersDataState)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data) => {
                if (data?.length) this.customersData = data;
            });

        this.store.select(Selectors.selectVolumeDataSourceState)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data) => {
                if (data?.length) this.volumeData = data.map(item => ({...item, currency: this.currencyValue}));
            });

        this.store.select(Selectors.selectEbitOperatingProfitState)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data) => {
                if (data?.length) this.ebitData = data.map(item => ({...item, currency: item.pnlrow == 'Headcount Number' ?  'QTY' : this.currencyValue}));
            });
        this.store.select(Selectors.selectInvestmentAndCapexDataState)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data) => {
                if (data?.length) this.investmentAndCapex = data.map(item => ({...item, currency: item.pnlrow == 'Assets Avaliability and Renewal' ?  'QTY' : this.currencyValue}));
            });

        this.store.select(Selectors.selectInvestmentsRequiredDataState)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data) => {
                if (data?.length) this.investmentRequired = data.map(item => ({...item, currency: this.currencyValue}));
            });
    };

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    };

    onPostPnl(): void {
        try {
            this.initialLoaderSubscription.unsubscribe();
            this.uploadErr = {err: false, message: null};
            this.isDisabledSaveButton = true;

            let pnlData: PnldataWithRelations[] = [];
            pnlData = pnlData.concat(this.costPriceData);
            pnlData = pnlData.concat(this.pricesData);
            pnlData = pnlData.concat(this.targetedAudienceData);
            pnlData = pnlData.concat(this.visitorsData);
            pnlData = pnlData.concat(this.customersData);
            pnlData = pnlData.concat(this.volumeData);
            pnlData = pnlData.concat(this.ebitData);
            pnlData = pnlData.concat(this.investmentAndCapex);
            pnlData = pnlData.concat(this.investmentRequired);

            pnlData = pnlData
                .filter(value => value && value.factvalue !== undefined && value.factvalue !== null && value.factvalue !== 0 && value.factdate !== null)
                .map(value => ({
                    ...value,
                    createdbyid: this.businessPlan.createdbyid,
                    ideaid: this.businessPlan.id,
                    isdeleted: 2,
                }));

            let dataToUpload: Array<{ data: PnldataWithRelations[], loader: { value: number } }> = [];

            if (pnlData.length === 0) {
                this.uploadErr = {err: true, message: 'No data to upload'}
                return
            }

            if (pnlData.length < this.uploadLimit) {
                dataToUpload = [{data: pnlData, loader: {value: 1}}]
            } else {
                for (let i = 0; i < pnlData.length; i += this.uploadLimit) {
                    dataToUpload.push({
                        data: pnlData.slice(i, i + this.uploadLimit),
                        loader: {value: i / this.uploadLimit + 1}
                    });
                }
            }

            this.markIsDeletePnl([0, 2], 1).pipe(takeUntil(this.unsubscribe$)).subscribe({
                next: (value) => {
                    console.log('Deleted', value)
                    from(dataToUpload)
                        .pipe(
                            takeUntil(this.unsubscribe$),
                            concatMap(item => this.pnlService.pnldataControllerCreateAll(item.data, 'events', true)
                                .pipe(
                                    map((event) => {
                                        if (event.type === HttpEventType.Response) {
                                            this.commonLoader.value = Math.round(100 / (dataToUpload.length / item.loader.value));
                                        }
                                        this.businessPlan.planLastCalculatedAt = new Date().toString();
                                        this.postService.ideastartuplistControllerUpdateById(this.businessPlan.id, this.businessPlan)
                                        .pipe(takeUntil(this.unsubscribe$)).subscribe({
                                            next: (value) => {
                                                console.log('Updated', value)
                                            },
                                            error: (err) => {
                                                console.error(err)
                                            }
                                        });
                                    }),
                                    catchError((error) => {
                                        this.markIsDeletePnl([2], 1).subscribe({
                                            next: res => console.log('Deleted', res),
                                            error: err => console.error(err),
                                        })
                                        this.commonLoader.previousValue = this.commonLoader.value;
                                        this.commonLoader.value = this.unknownError;
                                        this.uploadErr = {err: true, message: error['statusText']}
                                        console.error('Error sending:', error);
                                        return throwError(error);
                                    }),
                                )),
                            toArray()
                        )
                        .subscribe(results => {
                            if (results.every(result => result !== null)) {
                                this.markIsDeletePnl([2], 0).subscribe({
                                    next: res => {
                                        console.log('Uploaded', res);
                                        this.copyFromDraft(this.businessPlan.ideabusinessplansetup_draft);
                                    },
                                    error: err => console.error(err),
                                })
                                this.isDone = true;
                            }
                        });
                },
                error: err => console.error(err)
            })
        } catch (e) {
            this.uploadErr = {err: true, message: e}
            console.log(e)
        }
    };

    markIsDeletePnl(findValues: number[], changeOn: number): Observable<any> {
        return this.pnlService.pnldataControllerUpdateAll(
            JSON.stringify({
                and: [
                    {ideaid: this.businessPlan.id, isdeleted: {inq: findValues}}
                ],
            }) as any,
            {isdeleted: changeOn}
        );
    };

    copyFromDraft(value: string): void {
        this.postService.ideastartuplistControllerUpdateById(
            this.businessPlan.id,
            {
                ideabusinessplansetup: value,
                status: 'calculated'
            }
        ).subscribe({
            next: (value) => {
                this.isPnlDataLoaded = true;
                console.log('ok');
            }, error: (err) => {
                throwError(err)
            }
        });
    };
}
