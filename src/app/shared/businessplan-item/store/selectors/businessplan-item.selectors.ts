import {createSelector} from "@ngrx/store";

import {
    AccelerationReducer,
    AdvancedInflationSettingsReducer,
    AggregateSalesDataReducer,
    AppStore,
    BusinessPlanItemReducer,
    BusinessPlanSettingsReducer,
    CogsReducer,
    CostPriceReducer,
    DiscountsAndReturnsReducer,
    EbitOperatingProfitReducer,
    GrossMarginReducer,
    HeadcountAndPayrollReducer,
    NetSalesReducer,
    OpexReducer,
    RnDReducer,
    OtherOperatingIncomeLossReducer,
    MarketingReducer,
    PortfolioReducer,
    PricesReducer,
    SeasonalityReducer,
    VisitorsCustomersReducer,
    VolumeReducer,
    InvestmentAndCapexReducer,
    InvestmentsRequiredReducer,
} from "@businessplan-item/store/index";
import {AppState} from "@businessplan-item/store/reducers";


const coreAppState = (state: BusinessPlanItemReducer.State) => state[AppStore.FEATURE_KEY]

const businessPlanItemState = (state: BusinessPlanItemReducer.State) => (state[AppStore.FEATURE_KEY] as AppState).BusinessPlanItemState as BusinessPlanItemReducer.State;
const businessPlanSettingsState = (state: BusinessPlanSettingsReducer.State) => (state[AppStore.FEATURE_KEY] as AppState).BusinessPlanSetting as BusinessPlanSettingsReducer.State;
const visitorsCustomersState = (state: VisitorsCustomersReducer.State) => (state[AppStore.FEATURE_KEY] as AppState).VisitorsCustomersState as VisitorsCustomersReducer.State
const portfolioProductsState = (state: PortfolioReducer.State) => (state[AppStore.FEATURE_KEY] as AppState).PortfolioProducts as PortfolioReducer.State;
const advancedInflationSettings = (state: AdvancedInflationSettingsReducer.State) => (state[AppStore.FEATURE_KEY] as AppState).AdvancedInflationSettings as AdvancedInflationSettingsReducer.State;
const costPriceState = (state: CostPriceReducer.State) => (state[AppStore.FEATURE_KEY] as AppState).CostPrice as CostPriceReducer.State;
const pricesState = (state: PricesReducer.State) => (state[AppStore.FEATURE_KEY] as AppState).Prices as PricesReducer.State;
const seasonalityState = (state: SeasonalityReducer.State) => (state[AppStore.FEATURE_KEY] as AppState).Seasonality as SeasonalityReducer.State;
const accelerationState = (state: AccelerationReducer.State) => (state[AppStore.FEATURE_KEY] as AppState).Acceleration as AccelerationReducer.State;
const headcountAndPayrollState = (state: HeadcountAndPayrollReducer.State) => (state[AppStore.FEATURE_KEY] as AppState).HeadcountAndPayroll as HeadcountAndPayrollReducer.State;
const investmentAndCapexState = (state: InvestmentAndCapexReducer.State) => (state[AppStore.FEATURE_KEY] as AppState).InvestmentAndCapex as InvestmentAndCapexReducer.State;
const investmentsRequiredState = (state: InvestmentsRequiredReducer.State) => (state[AppStore.FEATURE_KEY] as AppState).InvestmentsRequired as InvestmentsRequiredReducer.State;
const aggregateSalesDataState = (state: AppStore.AppState) => (state[AppStore.FEATURE_KEY] as AppState).AggregateSalesData as AggregateSalesDataReducer.State;
const volumeState = (state: AppStore.AppState) => (state[AppStore.FEATURE_KEY] as AppState).Volume as VolumeReducer.State;
const discountsAndReturnsState = (state: AppStore.AppState) => (state[AppStore.FEATURE_KEY] as AppState).DiscountsAndReturns as DiscountsAndReturnsReducer.State;
const netSalesState = (state: AppStore.AppState) => (state[AppStore.FEATURE_KEY] as AppState).NetSalesReducer as NetSalesReducer.State;
const grossMarginState = (state: AppStore.AppState) => (state[AppStore.FEATURE_KEY] as AppState).GrossMarginReducer as GrossMarginReducer.State;
const ebitOperatingProfitState = (state: AppStore.AppState) => (state[AppStore.FEATURE_KEY] as AppState).EbitOperatingProfitReducer as EbitOperatingProfitReducer.State
const cogsState = (state: AppStore.AppState) => (state[AppStore.FEATURE_KEY] as AppState).CogsReducer as CogsReducer.State;
const opexState = (state: AppStore.AppState) => (state[AppStore.FEATURE_KEY] as AppState).OpexReducer as OpexReducer.State;
const rndState = (state: AppStore.AppState) => (state[AppStore.FEATURE_KEY] as AppState).RnDReducer as RnDReducer.State;
const otherOperatingIncomeLossState = (state: AppStore.AppState) => (state[AppStore.FEATURE_KEY] as AppState).OtherOperatingIncomeLossReducer as OtherOperatingIncomeLossReducer.State;
const marketingState = (state: AppStore.AppState) => (state[AppStore.FEATURE_KEY] as AppState).MarketingReducer as MarketingReducer.State;

export const selectBusinessPlanItem = createSelector(businessPlanItemState, (state) => state);

export const selectBusinessPlanSettingsState = createSelector(businessPlanSettingsState, (state) => state);
export const selectBusinessPlanInitialSettingsState = createSelector(businessPlanSettingsState, (state) => state.initialSettings);
export const selectBusinessPlanPeriodsState = createSelector(businessPlanSettingsState, (state) => state.businessplanSettings.periods);
export const selectVisitorsCustomersState = createSelector(visitorsCustomersState, (state) => state);

export const selectPortfolioTotalsState = createSelector(portfolioProductsState, (state) => state.productsTotal);
export const selectPortfolioState = createSelector(portfolioProductsState, (state) => state);
export const selectPortfolioProductsServicesState = createSelector(portfolioProductsState, (state) => state.productsServices);
export const selectPortfolioInitialProductState = createSelector(portfolioProductsState, (state) => state.initialProduct);
export const selectPortfolioUpdatedProductState = createSelector(portfolioProductsState, (state) => state.updatedProduct);

export const selectAdvancedInflationSettingsState = createSelector(advancedInflationSettings, (state) => state)

export const selectCostPricePivotState = createSelector(costPriceState, (state) => state.costPricePivot);
export const selectPricesPivotState = createSelector(pricesState, (state) => state.pricesPivot);

export const selectProductsSeasonalityState = createSelector(seasonalityState, (state) => state.productsSeasonality);

export const selectAccelerationState = createSelector(accelerationState, (state) => state);

export const selectHeadcountAndPayroll = createSelector(headcountAndPayrollState, (state) => state)
export const selectInvestmentAndCapexState = createSelector(investmentAndCapexState, (state) => state)
export const selectInvestmentsRequiredState = createSelector(investmentsRequiredState, (state) => state)
export const selectInvestmentAndCapexDataState = createSelector(investmentAndCapexState, (state) => state.exportData)
export const selectInvestmentsRequiredDataState = createSelector(investmentsRequiredState, (state) => state.investmentsRequiredExportData)
export const selectSafetyPillowState = createSelector(investmentsRequiredState, (state) => state.safetyPillow)

export const selectAggregateSalesDataState = createSelector(aggregateSalesDataState, (state) => state);
export const selectTargetedAudiencePivotState = createSelector(aggregateSalesDataState, (state) => state.targetedAudiencePivot);
export const selectVisitorsPivotState = createSelector(aggregateSalesDataState, (state) => state.visitorsPivot);
export const selectCustomersPivotState = createSelector(aggregateSalesDataState, (state) => state.customersPivot);
export const selectTargetedAudienceDataState = createSelector(aggregateSalesDataState, (state) => state.targetedAudienceDataState);
export const selectVisitorsDataState = createSelector(aggregateSalesDataState, (state) => state.visitorsDataState);
export const selectCustomersDataState = createSelector(aggregateSalesDataState, (state) => state.customersDataState);

export const selectVolumeState = createSelector(volumeState, (state) => state);
export const selectVolumeDataSourceState = createSelector(volumeState, (state) => state.volumeDataSource);
export const selectVolumePivotState = createSelector(volumeState, (state) => state.volumePivot);

export const selectDiscountAndReturnsState = createSelector(discountsAndReturnsState, (state) => state.discountsAndReturns);
export const selectNetSalesState = createSelector(netSalesState, (state) => state.netSales);
export const selectNetSalesPivotState = createSelector(netSalesState, (state) => state.netSalesPivot);
export const selectNetSalesMonth = createSelector(netSalesState, (state) => state.monthsShift);
export const selectTotalGrossState = createSelector(netSalesState, (state) => state.totalGrossByMonth);

export const selectGrossMarginState = createSelector(grossMarginState, (state) => state.grossMargin);
export const selectGrossMarginPivotState = createSelector(grossMarginState, (state) => state.grossMarginPivot);

export const selectEbitOperatingProfitState = createSelector(ebitOperatingProfitState, (state) => state.ebitOperatingProfit);
export const selectEbitOperatingProfitPivotState = createSelector(ebitOperatingProfitState, (state) => state.ebitOperatingProfitPivot);

export const selectOtherCogs = createSelector(cogsState, (state) => state.cogs);
export const selectOpex = createSelector(opexState, (state) => state.opex);
export const selectRnD = createSelector(rndState, (state) => state.rnd);
export const selectOtherOperatingIncomeLoss = createSelector(otherOperatingIncomeLossState, (state) => state.otherOperatingIncomeLoss);
export const selectMarketing = createSelector(marketingState, (state) => state.marketing);

export const isCalculatingSelector = createSelector(businessPlanItemState, state => state.isCalculating.componentName)
