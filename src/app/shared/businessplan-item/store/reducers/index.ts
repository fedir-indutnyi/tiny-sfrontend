import { combineReducers } from "@ngrx/store";
import * as BusinessPlanItem from './businessplan-item.reducer';
import * as BusinessPlanSettings from './businessplan-settings.reducer';
import * as VisitorsCustomers from './visitors-customers.reducer';
import * as Portfolio from './portfolio.reducer';
import * as CostPriceReducer from './cost-price.reducer';
import * as PricesReducer from './prices.reducer';
import * as SeasonalityReducer from './seasonality.reducer';
import * as AccelerationReducer from './acceleration.reducer';
import * as HeadcountAndPayroll from './headcount-and-payroll.reducer';
import * as AggregatedSalesDataReducer from './aggregated-sales-data.reducer';
import * as VolumeReducer from './volume.reducer';
import * as DiscountsAndReturnsReducer from './discounts-and-returns.reducer';
import * as NetSalesReducer from './net-sales.reducer';
import * as GrossMarginReducer from './gross-margin.reducer';
import * as EbitOperatingProfitReducer from './ebit-operating-profit.reducer';
import * as CogsReducer from './cogs.reducer';
import * as OpexReducer from './opex.reducer';
import * as RnDReducer from './rnd.reducer';
import * as OtherOperatingIncomeLossReducer from './other-operating-income-loss.reducer';
import * as MarketingReducer from './marketing.reducer';
import * as AdvancedInflationSettingsReducer from "./advanced-inflation-settings.reducer";
import * as InvestmentAndCapexReducer from './investment-and-capex.reducer'
import * as InvestmentsRequiredReducer from './investments-required.reducer'


export const FEATURE_KEY: string = 'AppStore'

export interface AppState {
  BusinessPlanItemState: BusinessPlanItem.State;
  VisitorsCustomersState: VisitorsCustomers.State;
  BusinessPlanSetting: BusinessPlanSettings.State;
  PortfolioProducts: Portfolio.State;
  AdvancedInflationSettings: AdvancedInflationSettingsReducer.State;
  CostPrice: CostPriceReducer.State;
  Prices: PricesReducer.State;
  Seasonality: SeasonalityReducer.State;
  Acceleration: AccelerationReducer.State;
  HeadcountAndPayroll: HeadcountAndPayroll.State;
  AggregateSalesData: AggregatedSalesDataReducer.State;
  Volume: VolumeReducer.State,
  DiscountsAndReturns: DiscountsAndReturnsReducer.State,
  NetSalesReducer: NetSalesReducer.State,
  GrossMarginReducer: GrossMarginReducer.State,
  EbitOperatingProfitReducer: EbitOperatingProfitReducer.State,
  CogsReducer: CogsReducer.State,
  OpexReducer: OpexReducer.State,
  RnDReducer: RnDReducer.State,
  OtherOperatingIncomeLossReducer: OtherOperatingIncomeLossReducer.State,
  MarketingReducer: MarketingReducer.State,
  InvestmentAndCapex: InvestmentAndCapexReducer.State,
  InvestmentsRequired: InvestmentsRequiredReducer.State
}

export const reducers = combineReducers<AppState>({
  BusinessPlanItemState: BusinessPlanItem.reducer,
  VisitorsCustomersState: VisitorsCustomers.reducer,
  BusinessPlanSetting: BusinessPlanSettings.reducer,
  PortfolioProducts: Portfolio.reducer,
  AdvancedInflationSettings: AdvancedInflationSettingsReducer.reducer,
  CostPrice: CostPriceReducer.reducer,
  Prices: PricesReducer.reducer,
  Seasonality: SeasonalityReducer.reducer,
  Acceleration: AccelerationReducer.reducer,
  HeadcountAndPayroll: HeadcountAndPayroll.reducer,
  AggregateSalesData: AggregatedSalesDataReducer.reducer,
  Volume: VolumeReducer.reducer,
  DiscountsAndReturns: DiscountsAndReturnsReducer.reducer,
  NetSalesReducer: NetSalesReducer.reducer,
  GrossMarginReducer: GrossMarginReducer.reducer,
  EbitOperatingProfitReducer: EbitOperatingProfitReducer.reducer,
  CogsReducer: CogsReducer.reducer,
  OpexReducer: OpexReducer.reducer,
  RnDReducer: RnDReducer.reducer,
  OtherOperatingIncomeLossReducer: OtherOperatingIncomeLossReducer.reducer,
  MarketingReducer: MarketingReducer.reducer,
  InvestmentAndCapex: InvestmentAndCapexReducer.reducer,
  InvestmentsRequired: InvestmentsRequiredReducer.reducer
});
