import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { BusinessplanItemComponent } from './businessplan-item.component';
import { BusinessplanDisclaimerComponent } from '@businessplan-item/sections/businessplan-disclaimer/businessplan-disclaimer.component';
import { BusinessplanOptionsComponent } from '@businessplan-item/sections/businessplan-options/businessplan-options.component';
import { CostPriceComponent } from '@businessplan-item/sections/cost-price/cost-price.component';
import { PortfolioComponent } from '@businessplan-item/shared/portfolio/portfolio.component';
import { PricesComponent } from '@businessplan-item/sections/prices/prices.component';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { WebdatarocksPivotModule } from '@webdatarocks/ngx-webdatarocks';
import { BusinessplanService } from './businessplan.service';
import { VisitorsCustomersComponent } from '@businessplan-item/sections/visitors-customers/visitors-customers.component';
import { AppStore } from '@businessplan-item/store/index';
import { effects } from '@businessplan-item/store/effects';
import { SeasonalityComponent } from '@businessplan-item/sections/seasonality/seasonality.component';
import { AccelerationComponent } from '@businessplan-item/sections/acceleration/acceleration.component';
import { AccelerationTrendComponent } from '@businessplan-item/sections/acceleration/acceleration-trend/acceleration-trend.component';
import { AccelerationTrendChartComponent } from '@businessplan-item/sections/acceleration/acceleration-trend-chart/acceleration-trend-chart.component';
import { TargetedAudienceComponent } from '@businessplan-item/sections/aggregated-sales-data/targeted-audience/targeted-audience.component';
import { VisitorsComponent } from '@businessplan-item/sections/aggregated-sales-data/visitors/visitors.component';
import { CustomersComponent } from '@businessplan-item/sections/aggregated-sales-data/customers/customers.component';
import { VolumeComponent } from '@businessplan-item/sections/volume/volume.component';
import { AggregatedPivotTableComponent } from '@businessplan-item/shared/aggregated-pivot-table/aggregated-pivot-table.component';
import { DiscountsAndReturnsComponent } from '@businessplan-item/sections/discounts-and-returns/discounts-and-returns.component';
import { DynamicTableFormComponent } from '@businessplan-item/shared/dynamic-table-form/dynamic-table-form.component';
import { CogsComponent } from '@businessplan-item/sections/cogs/cogs.component';
import { OpexComponent } from '@businessplan-item/sections/opex/opex.component';
import { NetSalesComponent } from '@businessplan-item/sections/net-sales/net-sales.component';
import { GrossMarginComponent } from '@businessplan-item/sections/gross-margin/gross-margin.component';

import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzCollapseModule } from "ng-zorro-antd/collapse";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { UpButtonModule } from "@shared/up-button/up-button.module";
import { NzSelectModule } from 'ng-zorro-antd/select';
import { SectionStatusDirective } from '@businessplan-item/shared/section-status.directive';

import * as SectionsStatusState from '@businessplan-item/store/section-status/index';
import { AiButtonComponent } from './shared/ai-button/ai-button.component';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { AdvancedInflationSettingsComponent } from './pnl-sections/advanced-inflation-settings/advanced-inflation-settings.component';
import { HeadcountAndPayrollComponent } from './pnl-sections/headcount-and-payroll/headcount-and-payroll.component';
import { EbitOperatingProfitComponent } from './pnl-sections/ebit-operating-profit/ebit-operating-profit.component';
import { NzSpinModule } from "ng-zorro-antd/spin";
import { InvestmentAndCapexComponent } from './pnl-sections/investment-and-capexx/investment-and-capex.component';
import { InvestmentsRequiredComponent } from './pnl-sections/investments-required/investments-required.component';
import { MarketingComponent } from "@businessplan-item/sections/marketing/marketing.component";
import {
    OtherOperatingIncomeLoss
} from "@businessplan-item/sections/other-operating-income-loss/other-operating-income-loss";
import { RndComponent } from "@businessplan-item/sections/rnd/rnd.component";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    BusinessplanItemComponent,
    BusinessplanOptionsComponent,
    VisitorsCustomersComponent,
    PortfolioComponent,
    CostPriceComponent,
    PricesComponent,
    SeasonalityComponent,
    AccelerationComponent,
    AccelerationTrendComponent,
    TargetedAudienceComponent,
    VisitorsComponent,
    CustomersComponent,
    VolumeComponent,
    DiscountsAndReturnsComponent,
    CogsComponent,
    OpexComponent,
    NetSalesComponent,
    GrossMarginComponent,
    InvestmentAndCapexComponent,
    EbitOperatingProfitComponent,
    AdvancedInflationSettingsComponent,
    HeadcountAndPayrollComponent,
    InvestmentsRequiredComponent,
    MarketingComponent,
    OtherOperatingIncomeLoss,
    RndComponent
  ],
  providers: [BusinessplanService],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forFeature(AppStore.FEATURE_KEY, AppStore.reducers),
        StoreModule.forFeature(SectionsStatusState.FEATURE_KEY, SectionsStatusState.reducers),
        EffectsModule.forFeature([...effects, ...SectionsStatusState.effects]),
        WebdatarocksPivotModule,
        AccelerationTrendChartComponent,
        AggregatedPivotTableComponent,
        DynamicTableFormComponent,
        BusinessplanDisclaimerComponent,
        NzSwitchModule,
        NzCollapseModule,
        NzDropDownModule,
        NzInputNumberModule,
        NzSelectModule,
        UpButtonModule,
        SectionStatusDirective,
        // DynamicNumberInputComponent,
        AiButtonComponent,
        NzSpinModule,
        TranslateModule,
    ],
  exports: [BusinessplanItemComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BusinessplanItemModule { }
