import { createAction, props } from "@ngrx/store";
import { InflationPivotData } from "../reducers/advanced-inflation-settings.reducer";
import { AdvancedInflationSettings } from "../../typings/businessplan-data-model.interface";
import { YearlyValues } from "../../typings";

export const init = createAction('[Advanced Inflation settings] initial data');
export const update = createAction('[Advanced Inflation settings] update inflation settings');

export const initInflationMultipliers = createAction('[Advanced Inflation settings] init inflation multipliers',
props<{ payload: { inflationMultipliers: number[] }}>())

export const fillInLoadedData = createAction('[Advanced Inflation settings] fill loaded data', props<{
  payload: { advancedInflationSettings: AdvancedInflationSettings }}>());

export const fillInPivotData = createAction('[Advanced Inflation settings] fill pivot data', props<{
  payload: { inflationPivot: InflationPivotData[] }}>());

export const updateInflationMultipliers = createAction('[Advanced Inflation settings] update inflation multipliers', props<{
    payload: {
      advancedInflationSettings:{inflationMultipliers: number[] }
    }
}>());

export const updateYearList = createAction('[Advanced Inflation settings] update yearList', props<{
  payload: {
    yearList: number[] 
  }
}>());

export const updateYearlyValues = createAction('[Advanced Inflation settings] update YearlyValues', props<{
  payload: {
    yearlyValues: YearlyValues[] 
  }
}>());