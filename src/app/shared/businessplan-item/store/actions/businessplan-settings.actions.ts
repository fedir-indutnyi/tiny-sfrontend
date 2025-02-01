import { createAction, props } from "@ngrx/store";
import { BusinessplanSetting } from "../../typings";

export const init = createAction('[Business Plan Settings] initial data');
export const fillInLoadedData = createAction('[Business Plan Settings] fill with loaded data', props<{ payload: { businessPlanSettings: BusinessplanSetting } }>());
export const update = createAction('[Business Plan Settings] update data', props<{ payload: { businessPlanSettings: BusinessplanSetting } }>());
export const updatePeriods = createAction('[Business Plan Settings] update periods', props<{ payload: { 
  periods: number,
  startPeriod: Date,
  endPeriod: Date
} }>());

export const updateAcceleration = createAction('[Business Plan Settings] update acceleration', props<{
  payload: {
    businessPlanSettings:
    { yearlyInflationRate: number, yearlyPriceIncrease: number, 
      yearlySalaryIncrease: number, UOM: string, isInflation: boolean }
  }
}>());

