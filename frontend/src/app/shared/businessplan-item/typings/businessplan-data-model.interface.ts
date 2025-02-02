import { iCogs } from "@businessplan-item/store/reducers/cogs.reducer";
import { InflationHistory } from "../store/reducers/businessplan-settings.reducer";
import { InflationPivotData } from "../store/reducers/advanced-inflation-settings.reducer";
import { YearlyValues } from "./businessplan-forms.interface";
import { InvestmentAndCapex } from "../store/reducers/investment-and-capex.reducer";
import {iMarketing} from "@businessplan-item/store/reducers/marketing.reducer";
import {iOtherOperatingIncomeLoss} from "@businessplan-item/store/reducers/other-operating-income-loss.reducer";
import {iOpex} from "@businessplan-item/store/reducers/opex.reducer";
import {iRnD} from "@businessplan-item/store/reducers/rnd.reducer";
import { CellValue } from "jspreadsheet-ce";


export interface IBusinessplanRootObject {
  lastmodified?:number;
  businessplanSetting: BusinessplanSetting;
  aboutVisitorsCustomers: AboutVisitorsCustomers;
  portfolio: Portfolio;
  advancedInflationSettings: AdvancedInflationSettings;
  costPrice: CostPrice;
  priceList: PriceList;
  seasonality: SeasonalityOptionList[];
  headcountAndPayroll: HeadcountAndPayroll;
  acceleration: AccelerationList;
  cogs: iCogs[];
  opex: iOpex[];
  rnd: iRnD[];
  otherOperatingIncomeLoss: iOtherOperatingIncomeLoss[];
  marketing: iMarketing[];
  discountsAndReturns: DiscountsAndReturns[];
  investmentAndCapex: InvestmentAndCapex[];
  safetyPillow: number;
  netSale:NetSales
}

export interface NetSales {
  monthsShift: number;
}

export interface DiscountsAndReturns {
  pnlRow: string,
  description: string,
  staticMonthlyNumber: number,
  percentage: number,
  comments: string,
  startMonth: number,
  endMonth: number,
}



export interface Capex {
  pnlRow: string,
  totalValuePrice: number,
  staticMonthlyNumber: number,
  vendor: string,
  comments: string,
  depreciation: number,
  monthShift: number,
  monthDuration: number,
}

export interface SeasonalityOptionList {
  typeOfData: string;
  pnlRow?: string;
  itemCode: string;
  valueOfMoney: number;
}

interface AccelerationList {
  pnlRow?: string,
  trendType: string,
  trendData: number[],
  trendSettings: {
    months: number[],
    growths: number[]
  }
}

export interface PriceList {
  pnlRow?: string;
  yearlyPriceIncrease: number;
  pnlData?: any[];
}

export interface CostPrice {
  pnlRow?: string;
  pnlData?: any[];
}

export interface Portfolio {
  pnlRow?: string;
  applicable: boolean;
  splitByProducts: boolean;
  productsServices: ProductsService[];
  pnlData?: any[];
  customerCalculationMethod: string;
}
export interface ProductsService {
  id: number;
  brand: string;
  name: string;
  cost: number;
  price: number;
  productMarkup: number;
  productMargin: number;
  eachNCustomerBuys: number;
  absoluteCountValues: number;
  monthlyConversionUserThatBuys: number;
  customers: number;
  itemsPerOrder: number;
  ordersMonthPerCustomer: number;
  totalUnits: number;
  estimatedFailedOrders: number;
  standardDiscount: number;
  onFirstInitialStock: number | boolean;
  ammortizationApplied: boolean;
  totalAssetValue: number;
  beginningMonths: number;
  endingMonth: number;
  ammortisationMonths: number;
  yearlyInflationRate: number;
  yearlyPriceIncrease: number;
  UOM:string;
  overrideFromBusinessDetails: boolean;
  numberOfMonthsForInitialStock: number;
  totalMonthlyValue: number
}

export interface AboutVisitorsCustomers {
  pnlRow?: string;
  applicable: boolean;
  totalMonthlyCrowd: number;
  paidTraffic: number;
  totalMonthlyVisitors: number;
  costPerVisitor: number;
  monthlyConversionUserThatBuys: number;
  totalMonthlyCustomers: number;
  comment: string;
  sheetData?: CellValue[][];
  pnlData?: any[];
}

export interface BusinessplanSetting {
  pnlRow?: string;
  nameOfPlan: string;
  currency: string;
  startPeriod: Date;
  endPeriod: Date;
  periods: number;
  UOM: string;
  itemType: string;
  yearlyInflationRate: number;
  yearlyPriceIncrease: number;
  yearlySalaryIncrease: number;
  address: string;
  pnlData?: any[];
  description: string;
  isInflation: boolean;
  inflationHistory: InflationHistory;
  actualConsumer: string;
  consumersList: string[];
}

export interface AdvancedInflationSettings{
  plnRow?: string;
  inflationMultipliers: number[];
  inflationSettingsPivotData: InflationPivotData[];
  yearList: number[];
  yearlyValues: YearlyValues[];
}

export interface HeadcountAndPayroll{
  headcount: Headcount[],
  payroll: Payroll[],
}

export interface Headcount {
  salespersonRegion: number,
  jobTitle: string,
  generatesSales: boolean,
  numOfPeople: number,
  beginningMonth: number,
  endingMonth: number,
  netSalary: number,
  salaryPlnRow: string,
  recruitmentCost: number,
  monthOfService: number,
  salaryTax: number,
  extraPayments: number
}

export interface Payroll {
  plnRow: string,
  description: string,
  monthlyPricePerEmployee: number,
  staticMonthlyNumber: number,
  comment: string,
  vendorName: string,
  startMonth: number,
  endMonth: number
}

export interface HeadcountAndPayrollPivotData {
  numberOfEmployees: HeadcountAndPayrollPivotCell[],
  headcountExpenses: HeadcountAndPayrollPivotCell[],
  recruitmentCost: HeadcountAndPayrollPivotCell[],
  salaryTax: HeadcountAndPayrollPivotCell[],
  extraPayments: HeadcountAndPayrollPivotCell[],
  otherHeadcountCost?: HeadcountAndPayrollPivotCell[]
}

export interface HeadcountAndPayrollPivotCell {
  pivotDescription: string,
  pnlRow: string,
  month: string,
  year: number,
  key: string,
  value: number,
}
