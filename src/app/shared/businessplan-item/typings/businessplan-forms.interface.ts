import { FormArray, FormControl, FormGroup } from "@angular/forms";

export type FormCtrl<Type>  =  {
  [Property in keyof Type ]: FormControl<Type[Property]>;
};

export type ControlsOf<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends Record<any, any>
  ? FormGroup<ControlsOf<T[K]>>
  : FormControl<T[K]>;
};


export type Override<T1, T2> = Omit<T1, keyof T2> & T2 ;


export type PeriodFormGrp = {
  period: FormGroup<FormCtrl<IPeriodOptionsForm>>
};

export type InflationMultipliersFormArr = {
  inflationMultipliers: FormArray<FormControl<number>>
}

export type OptionsFormConfig = Override<FormCtrl<IBusinessPlanOptionsConfig>, PeriodFormGrp>;
export type InflatoinMultipliersFormConfig = Override<FormCtrl<IInflationMultipliersConfig>, InflationMultipliersFormArr>;

type home = OptionsFormConfig


export interface IBusinessPlanOptionsConfig {
  period: IPeriodOptionsForm,
  periodEndDate: Date | null,
  currency: string | null,
  yearlyInflationRate: number | null,
  yearlyPriceIncrease: number | null,
  yearlySalaryIncrease: number | null,
  uom: string | null,
  address:  string | null,
  name: string | null,
  description: string | null,
  isInflation: boolean,
  actualConsumer: string,
}

export interface IInflationMultipliersConfig{
  inflationMultipliers: number[] | null
}

export interface IPeriodOptionsForm {
    startDate: Date | null,
    months: number | null
}

export interface IVisitorsFormConfig {
  comment: string | null,
  applicable: boolean | null,
  costPerVisitor: number | null,
  monthlyConversionUserThatBuys: number | null,
  paidTraffic: number | null,
  totalMonthlyCrowd: number | null,
  totalMonthlyVisitors: number | null
  totalMonthlyCustomers: number | null
}

export type VisitorsFormConfig = FormCtrl<IVisitorsFormConfig>;

export interface YearlyValues{
  yearlyInflationRate: number;
  yearlyPriceIncrease: number;
  yearlySalaryIncrease: number;
}
