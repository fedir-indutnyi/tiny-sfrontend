import {ExecutionStatusCode} from "@businessplan-item/store/models";
import {Action, createReducer, on} from "@ngrx/store";
import {
  AccelerationActions,
  AdvancedInflationSettingsActions,
  AggregateSalesDataActions,
  BusinessPlanItemActions,
  BusinessPlanSettingsActions,
  CogsActions,
  CostPriceActions,
  DiscountsAndReturnsActions,
  EbitOperatingProfitActions,
  GrossMarginActions,
  HeadcountAndPayrollActions,
  MarketingActions,
  NetSalesActions,
  OpexActions,
  RnDActions,
  OtherOperatingIncomeLossActions,
  PortfolioActions,
  PricesActions,
  SeasonalityActions,
  VisitorsCustomersActions,
  VolumeActions,
  InvestmentAndCapexActions,
  InvestmentsRequiredActions
} from "@businessplan-item/store/index";
import {reset} from "./section-status.actions";

export interface State {
  settings: ExecutionStatusCode,
  visitors: ExecutionStatusCode,
  portfolio: ExecutionStatusCode,
  advancedInflationSettings: ExecutionStatusCode,
  costPrices: ExecutionStatusCode,
  prices: ExecutionStatusCode,
  seasonality: ExecutionStatusCode,
  acceleration: ExecutionStatusCode,
  headcount: ExecutionStatusCode,
  crowdCustomers: ExecutionStatusCode,
  volume: ExecutionStatusCode,
  discountsAndReturns: ExecutionStatusCode,
  netSales: ExecutionStatusCode,
  otherCogs: ExecutionStatusCode,
  grossMargin: ExecutionStatusCode,
  ebitOperatingProfit: ExecutionStatusCode,
  opex: ExecutionStatusCode,
  rnd: ExecutionStatusCode,
  otherOperatingIncomeLoss: ExecutionStatusCode,
  marketing: ExecutionStatusCode,
  investmentAndCapex: ExecutionStatusCode,
  investmentsRequired: ExecutionStatusCode,
}

export const initialState: State = {
  settings: ExecutionStatusCode.INITIAL,
  visitors: ExecutionStatusCode.INITIAL,
  portfolio: ExecutionStatusCode.INITIAL,
  advancedInflationSettings: ExecutionStatusCode.INITIAL,
  costPrices: ExecutionStatusCode.INITIAL,
  prices: ExecutionStatusCode.INITIAL,
  seasonality: ExecutionStatusCode.INITIAL,
  acceleration: ExecutionStatusCode.INITIAL,
  headcount: ExecutionStatusCode.INITIAL,
  crowdCustomers: ExecutionStatusCode.INITIAL,
  volume: ExecutionStatusCode.INITIAL,
  discountsAndReturns: ExecutionStatusCode.INITIAL,
  netSales: ExecutionStatusCode.INITIAL,
  otherCogs: ExecutionStatusCode.INITIAL,
  grossMargin: ExecutionStatusCode.INITIAL,
  ebitOperatingProfit: ExecutionStatusCode.INITIAL,
  opex: ExecutionStatusCode.INITIAL,
  rnd: ExecutionStatusCode.INITIAL,
  otherOperatingIncomeLoss: ExecutionStatusCode.INITIAL,
  marketing: ExecutionStatusCode.INITIAL,
  investmentAndCapex: ExecutionStatusCode.INITIAL,
  investmentsRequired: ExecutionStatusCode.INITIAL
}


const SectionStatusReducer = createReducer(
  initialState,
  on(BusinessPlanItemActions.init, (state) => initialState),

  on(BusinessPlanSettingsActions.update, (state) => ({ ...state, settings: ExecutionStatusCode.COMPLETE })),
  on(BusinessPlanSettingsActions.fillInLoadedData, (state, props) => ({
    ...state,
    settings: props.payload.businessPlanSettings ? ExecutionStatusCode.COMPLETE : ExecutionStatusCode.INITIAL
  })),
  on(AdvancedInflationSettingsActions.fillInPivotData, (state) => ({ ...state, settings: ExecutionStatusCode.COMPLETE })),
  on(AdvancedInflationSettingsActions.fillInLoadedData, (state, props) => ({
    ...state,
    settings: props.payload.advancedInflationSettings ? ExecutionStatusCode.COMPLETE : ExecutionStatusCode.INITIAL
  })),
  on(VisitorsCustomersActions.update, (state) => ({ ...state, visitors: ExecutionStatusCode.COMPLETE })),
  on(VisitorsCustomersActions.fillInLoadedData, (state, props) => ({
    ...state,
    visitors: props.payload.aboutVisitorsCustomers ? ExecutionStatusCode.COMPLETE : ExecutionStatusCode.INITIAL
  })),
  // on(PortfolioActions.update, (state) => ({ ...state, portfolio: ExecutionStatusCode.COMPLETE })),
  on(PortfolioActions.update,
    PortfolioActions.fillInLoadedDataProducts,
    (state, props) => ({
      ...state,
      portfolio: props.payload.productsServices.length ? ExecutionStatusCode.COMPLETE : ExecutionStatusCode.INITIAL
    })),
  on(CostPriceActions.fillInPivotData, (state) => ({ ...state, costPrices: ExecutionStatusCode.COMPLETE })),
  on(PricesActions.fillInPivotData, (state) => ({ ...state, prices: ExecutionStatusCode.COMPLETE })),
  // on(SeasonalityActions.update, (state) => ({ ...state, seasonality: ExecutionStatusCode.COMPLETE })),
  on(SeasonalityActions.update,
    SeasonalityActions.fillInSeasonalityData,
    (state, props) => ({
    ...state,
    seasonality: props.payload.productsSeasonality.length > 1 ? ExecutionStatusCode.COMPLETE : ExecutionStatusCode.INITIAL
  })),
  // on(AccelerationActions.update, (state) => ({ ...state, acceleration: ExecutionStatusCode.COMPLETE })),
  on(AccelerationActions.update,
    AccelerationActions.fillInLoadedData,
    (state, props) => ({
    ...state,
    acceleration: props.payload.acceleration?.trendData.length ? ExecutionStatusCode.COMPLETE : ExecutionStatusCode.INITIAL
  })),
  on(HeadcountAndPayrollActions.fillInLoadedData, (state, props) => ({
    ...state,
    headcount: (props.payload.tableData.headcount.length && props.payload.tableData.payroll.length) ?  ExecutionStatusCode.COMPLETE : ExecutionStatusCode.INITIAL
  })),
  on(InvestmentAndCapexActions.fillInLoadedData, (state, props) => ({
    ...state,
    investmentAndCapex: props.payload.tableData?.length ?  ExecutionStatusCode.COMPLETE : ExecutionStatusCode.INITIAL
  })),
  on(AggregateSalesDataActions.updateCustomerDataSucceeded, (state) => ({ ...state, crowdCustomers: ExecutionStatusCode.COMPLETE })),
  on(VolumeActions.fillInVolumePivotData, (state, props) => ({
    ...state,
    volume: props.payload.volumePivot.length ? ExecutionStatusCode.COMPLETE : ExecutionStatusCode.INITIAL
  })),
  // on(DiscountsAndReturnsActions.updateAll, (state) => ({ ...state, discountsAndReturns: ExecutionStatusCode.COMPLETE })),
  on(DiscountsAndReturnsActions.updateAll,
    DiscountsAndReturnsActions.fillInLoadedData,
    (state, props) => ({
    ...state,
    discountsAndReturns: props.payload.discountsAndReturns.length ? ExecutionStatusCode.COMPLETE : ExecutionStatusCode.INITIAL
  })),
  on(NetSalesActions.fillNetSalesPivotData, (state, props) => ({
    ...state,
    netSales: props.payload.netSalesPivot.length ? ExecutionStatusCode.COMPLETE : ExecutionStatusCode.INITIAL
  })),
  // on(CogsActions.updateAll, (state, props) => ({ ...state, otherCogs: props.payload.cogs.length ? ExecutionStatusCode.COMPLETE : ExecutionStatusCode.INITIAL })),
  on(CogsActions.updateAll,
    CogsActions.fillInLoadedData,
    (state, props) => ({
      ...state,
      otherCogs: props.payload.cogs.length ? ExecutionStatusCode.COMPLETE : ExecutionStatusCode.INITIAL
    })),
    on(OpexActions.updateAll, (state, props) => ({ ...state, opex: props.payload.opex.length ? ExecutionStatusCode.COMPLETE : ExecutionStatusCode.INITIAL })),
    on(OpexActions.updateAll,
        OpexActions.fillInLoadedData,
        (state, props) => ({
          ...state,
          opex: props.payload.opex.length ? ExecutionStatusCode.COMPLETE : ExecutionStatusCode.INITIAL
        })),
    on(RnDActions.updateAll,
        RnDActions.fillInLoadedData,
        (state, props) => ({
          ...state,
          rnd: props.payload.rnd.length ? ExecutionStatusCode.COMPLETE : ExecutionStatusCode.INITIAL
        })),
    on(OtherOperatingIncomeLossActions.updateAll,
        OtherOperatingIncomeLossActions.fillInLoadedData,
        (state, props) => ({
          ...state,
          otherOperatingIncomeLoss: props.payload.otherOperatingIncomeLoss.length ? ExecutionStatusCode.COMPLETE : ExecutionStatusCode.INITIAL
        })),
    on(MarketingActions.updateAll,
        MarketingActions.fillInLoadedData,
        (state, props) => ({
          ...state,
          marketing: props.payload.marketing.length ? ExecutionStatusCode.COMPLETE : ExecutionStatusCode.INITIAL
        })),
  on(GrossMarginActions.fillGrossMarginPivotData, (state, props) => ({
    ...state,
    grossMargin: props.payload.grossMarginPivot ? ExecutionStatusCode.COMPLETE : ExecutionStatusCode.INITIAL
  })),
  on(EbitOperatingProfitActions.fillEbitOperatingProfitPivotData, (state, props) => ({
    ...state,
    ebitOperatingProfit: props.payload.ebitOperatingProfitPivot ? ExecutionStatusCode.COMPLETE : ExecutionStatusCode.INITIAL
  })),
  on(reset, (state) => ({
    ...state,
    acceleration: ExecutionStatusCode.INITIAL
  })),
  on(InvestmentsRequiredActions.updateInvestmentsRequiredExportData, (state, props) => ({
    ...state,
    investmentsRequired: props.payload ? ExecutionStatusCode.COMPLETE : ExecutionStatusCode.INITIAL,
  })),
)


export function reducer(state: State | undefined, action: Action) {
  return SectionStatusReducer(state, action);
}
