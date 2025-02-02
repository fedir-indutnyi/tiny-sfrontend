import {Injectable} from '@angular/core';
import {Actions, concatLatestFrom, createEffect, ofType} from '@ngrx/effects';
import {concatMap, EMPTY, finalize, Observable} from 'rxjs';
import {catchError, exhaustMap, map, switchMap} from 'rxjs/operators';
import {Action, Store} from '@ngrx/store';

import {InitialState} from '../initial-store';
import {BusinessplanService} from '../../businessplan.service';
import {
    AccelerationActions,
    AdvancedInflationSettingsActions,
    BusinessPlanItemActions,
    BusinessPlanSettingsActions,
    CogsActions,
    OpexActions,
    RnDActions,
    OtherOperatingIncomeLossActions,
    MarketingActions,
    DiscountsAndReturnsActions,
    HeadcountAndPayrollActions,
    InvestmentAndCapexActions,
    InvestmentsRequiredActions,
    PortfolioActions,
    SeasonalityActions,
    Selectors,
    VisitorsCustomersActions,
    NetSalesActions
} from '..';
import {IBusinessplanRootObject, Portfolio} from '../../typings';

@Injectable()
export class LoadAllDataEffects {
    postId: number;

    constructor(
        private actions$: Actions,
        private store: Store,
        private businessplanService: BusinessplanService,
    ) {
    }

    load$: Observable<Action> = createEffect(() =>
        this.actions$.pipe(
            ofType(BusinessPlanItemActions.load),
            exhaustMap((action) => {
                    this.postId = action.payload.postId
                    return this.businessplanService.getDraft(action.payload.postId, action.payload.localDraft).pipe(
                        map(value => value as IBusinessplanRootObject),
                        switchMap(response => {
                                let productsTotal = response.portfolio.productsServices[0]; // splitting totals object from product list
                                let products = [...response.portfolio.productsServices];
                                products.splice(0, 1); //
                          console.log(response)
                                return [
                                    BusinessPlanItemActions.loadDataDone({payload: {businessPlanItem: response}}),
                                    BusinessPlanSettingsActions.fillInLoadedData({payload: {businessPlanSettings: response.businessplanSetting}}),
                                    VisitorsCustomersActions.fillInLoadedData({payload: {aboutVisitorsCustomers: response.aboutVisitorsCustomers}}),
                                    PortfolioActions.fillInLoadedDataTotal({payload: {productsTotal: productsTotal}}),
                                    PortfolioActions.fillInLoadedDataProducts({payload: {productsServices: products, customerCalculationMethod: response.portfolio.customerCalculationMethod}}),
                                    AdvancedInflationSettingsActions.fillInLoadedData({payload: {advancedInflationSettings: response.advancedInflationSettings}}),
                                    SeasonalityActions.fillInSeasonalityData({payload: {productsSeasonality: response.seasonality as []}}),
                                    AccelerationActions.fillInLoadedData({payload: {acceleration: response.acceleration}}),
                                    HeadcountAndPayrollActions.fillInLoadedData({payload: {tableData: response.headcountAndPayroll}}),
                                    DiscountsAndReturnsActions.fillInLoadedData({payload: {discountsAndReturns: response.discountsAndReturns}}),
                                    CogsActions.fillInLoadedData({payload: {cogs: response.cogs}}),
                                    OpexActions.fillInLoadedData({payload: {opex: response.opex}}),
                                    RnDActions.fillInLoadedData({payload: {rnd: response.rnd}}),
                                    OtherOperatingIncomeLossActions.fillInLoadedData({payload: {otherOperatingIncomeLoss: response.otherOperatingIncomeLoss}}),
                                    MarketingActions.fillInLoadedData({payload: {marketing: response.marketing}}),
                                    InvestmentAndCapexActions.fillInLoadedData({payload: {tableData: response.investmentAndCapex || InitialState.investmentAndCapex.tableData}}),
                                    InvestmentsRequiredActions.fillInLoadedData({payload: {safetyPillow: response.safetyPillow || InitialState.investmentsRequired.safetyPillow}}),
                                    NetSalesActions.fillInLoadedData({payload:  response.netSale}),
                                    BusinessPlanItemActions.loadSuccess()
                                ]
                            }
                        ),
                        catchError(() => ([
                            BusinessPlanItemActions.loadDataDone({payload: {businessPlanItem: null}}),
                            BusinessPlanSettingsActions.fillInLoadedData({payload: {businessPlanSettings: InitialState.businessplanSetting}}),
                            VisitorsCustomersActions.fillInLoadedData({payload: {aboutVisitorsCustomers: InitialState.aboutVisitorsCustomers}}),
                            PortfolioActions.fillInLoadedDataTotal({payload: {productsTotal: InitialState.portfolio.productsServices[0]}}),
                            PortfolioActions.fillInLoadedDataProducts({payload: {productsServices: InitialState.portfolio.productsServices}}),
                            AdvancedInflationSettingsActions.fillInLoadedData({payload: {advancedInflationSettings: InitialState.advancedInflationSettings}}),
                            SeasonalityActions.fillInSeasonalityData({payload: {productsSeasonality: InitialState.productsSeasonality as []}}),
                            AccelerationActions.fillInLoadedData({payload: {acceleration: InitialState.acceleration}}),
                            HeadcountAndPayrollActions.fillInLoadedData({payload: {tableData: InitialState.headcountAndPayroll.tableData}}),
                            DiscountsAndReturnsActions.fillInLoadedData({payload: {discountsAndReturns: InitialState.discountsAndReturns}}),
                            CogsActions.fillInLoadedData({payload: {cogs: InitialState.cogs}}),
                            OpexActions.fillInLoadedData({payload: {opex: InitialState.opex}}),
                            RnDActions.fillInLoadedData({payload: {rnd: InitialState.rnd}}),
                            OtherOperatingIncomeLossActions.fillInLoadedData({payload: {otherOperatingIncomeLoss: InitialState.operatingIncomeLoss}}),
                            MarketingActions.fillInLoadedData({payload: {marketing: InitialState.marketing}}),
                            InvestmentAndCapexActions.fillInLoadedData({payload: {tableData: InitialState.investmentAndCapex.tableData}}),
                            InvestmentsRequiredActions.fillInLoadedData({payload: {safetyPillow: InitialState.investmentsRequired.safetyPillow}}),
                            NetSalesActions.fillInLoadedData({payload: InitialState.netSale}),
                            BusinessPlanItemActions.loadSuccess()
                        ])),
                    )
                }
            ))
    );

    save$: Observable<Action> = createEffect(() => {
        return this.actions$.pipe(
            ofType(BusinessPlanItemActions.saveData),
            concatMap(() => {
                    const data = this.businessplanService.getLocalDraftById(this.postId)
                    return data ? this.businessplanService.saveData(this.postId, data).pipe(
                        switchMap(response => ([
                            BusinessPlanItemActions.savedSuccess(),
                        ])), finalize(() => {
                            this.businessplanService.localRemoveData(this.postId);
                        }),
                        catchError(() => EMPTY),
                    ) : EMPTY;
                }
            ));
    });

    localSave$: Observable<Action> = createEffect(() => {
        return this.actions$.pipe(
            ofType(BusinessPlanItemActions.localSaveData),
            concatLatestFrom(() => [
                this.store.select(Selectors.selectBusinessPlanItem),
                this.store.select(Selectors.selectBusinessPlanSettingsState),
                this.store.select(Selectors.selectVisitorsCustomersState),
                this.store.select(Selectors.selectPortfolioState),
                this.store.select(Selectors.selectAdvancedInflationSettingsState),
                this.store.select(Selectors.selectProductsSeasonalityState),
                this.store.select(Selectors.selectAccelerationState),
                this.store.select(Selectors.selectDiscountAndReturnsState),
                this.store.select(Selectors.selectOtherCogs),
                this.store.select(Selectors.selectOpex),
                this.store.select(Selectors.selectRnD),
                this.store.select(Selectors.selectOtherOperatingIncomeLoss),
                this.store.select(Selectors.selectMarketing),
                this.store.select(Selectors.selectHeadcountAndPayroll),
                this.store.select(Selectors.selectInvestmentAndCapexState),
                this.store.select(Selectors.selectSafetyPillowState),
                this.store.select(Selectors.selectNetSalesMonth),
            ]),
            exhaustMap(([action,
                            planState,
                            settings,
                            visitorsCustomersState,
                            productsState,
                            inflationSettings,
                            seasonality,
                            accelerationSate,
                            discountsAndReturns,
                            cogs,
                            opex,
                            rnd,
                            otherOperatingIncomeLoss,
                            marketing,
                            headcountAndPayroll,
                            investmentAndCapex,
                            safetyPillow,
                            netSales
                        ]) => {
                    let products = [...productsState.productsServices];
                    products.unshift(productsState.productsTotal); // insert total object at first position
                    let data = {
                        lastmodified: new Date().getTime(),
                        businessplanSetting: settings.isEdited ? settings.businessplanSettings : null,
                        aboutVisitorsCustomers: visitorsCustomersState.isEdited ? visitorsCustomersState.aboutVisitorsCustomers : null,
                        portfolio: {
                            applicable: productsState.applicable,
                            splitByProducts: productsState.splitByProducts,
                            pnlRow: productsState.pnlRow,
                            pnlData: productsState.pnlData,
                            productsServices: products,
                            customerCalculationMethod: productsState.customerCalculationMethod
                        } as Portfolio,
                        advancedInflationSettings: inflationSettings.advancedInflationSettings,
                        seasonality: seasonality,
                        acceleration: accelerationSate.acceleration,
                        discountsAndReturns: discountsAndReturns,
                        cogs: cogs,
                        opex,
                        rnd,
                        otherOperatingIncomeLoss,
                        marketing,
                        headcountAndPayroll: headcountAndPayroll.tableData,
                        investmentAndCapex: investmentAndCapex.tableData,
                        safetyPillow: safetyPillow,
                      netSale:{
                        monthsShift:netSales
                      },
                    };
                    return this.businessplanService.localSaveData(this.postId, data).pipe(
                        switchMap(response => ([
                            BusinessPlanItemActions.savedSuccess(),
                            BusinessPlanItemActions.endCalculating(),
                        ])),
                        catchError(() => EMPTY),
                    );
                }
            ));
    });
}
