import { Type } from '@angular/core';
import { AggregatedSalesDataEffects } from './aggregated-sales-data.effects';
import { LoadAllDataEffects } from './businessplan-item.effects';
import { CostPriceEffects } from './cost-price.effects';
import { GrossMarginEffects } from './gross-margin.effects';
import { NetSalesEffects } from './net-sales.effects';
import { CalculateProductsItemEffects, CalculateTotalsEffects } from './portfolio.effects';
import { PricesEffects } from './prices.effects';
import { ProductSeasonalityEffects } from './seasonality.effects';
import { VolumeEffects } from './volume.effects';
import { AdvancedInflationSettingsEffects } from './advanced-inflation-settings.effects';
import { HeadcountAndPayrollEffects } from './headcount-and-payroll.effects';
import { EbitOperatingProfitEffects } from './ebit-operation-profit.effects';
import { InvestmentAndCapexEffects} from './investment-and-capex.effects';
import { InvestmentsRequiredEffects } from './investments-required.effects';



export const effects: Type<unknown>[] = [
  LoadAllDataEffects,
  CalculateTotalsEffects,
  CalculateProductsItemEffects,
  CostPriceEffects,
  PricesEffects,
  ProductSeasonalityEffects,
  AggregatedSalesDataEffects,
  VolumeEffects,
  NetSalesEffects,
  GrossMarginEffects,
  EbitOperatingProfitEffects,
  AdvancedInflationSettingsEffects,
  HeadcountAndPayrollEffects,
  InvestmentAndCapexEffects,
  InvestmentsRequiredEffects
];
