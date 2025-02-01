import { Action, createReducer, on } from "@ngrx/store";
import { BusinessPlanSettingsActions } from "..";
import { BusinessplanSetting } from "../../typings";
import { InitialState } from "../initial-store";

export interface State {
  businessplanSettings: BusinessplanSetting;
  initialSettings: BusinessplanSetting;
  isEdited: boolean,
  isLoaded: boolean,
  isInitial: boolean,
}

let initialStore: State = {
  businessplanSettings: { ...InitialState.businessplanSetting },
  initialSettings: { ...InitialState.businessplanSetting },
  isEdited: false,
  isLoaded: false,
  isInitial: true
}


export interface InflationHistory{
  yearlyInflationRate: number,
  yearlyPriceIncrease: number,
  yearlySalaryIncrease: number
}


const BusinessPlanSettingsReducer = createReducer(
  initialStore,
  on(BusinessPlanSettingsActions.init, (state) => initialStore),
  on(BusinessPlanSettingsActions.fillInLoadedData, (state, props) =>
    ({ ...state, businessplanSettings: { ...state.businessplanSettings, ...props.payload.businessPlanSettings }, isLoaded: true, isInitial: false, isEdited: !!props.payload.businessPlanSettings })),
  on(BusinessPlanSettingsActions.update, (state, props) =>
    ({ ...state, businessplanSettings: { ...state.businessplanSettings, ...props.payload.businessPlanSettings },
      isEdited: true,
      isInitial: false })),
  on(BusinessPlanSettingsActions.updatePeriods, (state, props) => ({ ...state, businessplanSettings: 
    { ...state.businessplanSettings, periods: props.payload.periods, startPeriod: props.payload.startPeriod, endPeriod: props.payload.endPeriod } })),
  on(BusinessPlanSettingsActions.updateAcceleration, (state, props) => ({ ...state, businessplanSettings: 
    { ...state.businessplanSettings, yearlyInflationRate: props.payload.businessPlanSettings.yearlyInflationRate, 
      yearlyPriceIncrease: props.payload.businessPlanSettings.yearlyPriceIncrease, 
      yearlySalaryIncrease: props.payload.businessPlanSettings.yearlySalaryIncrease,
      UOM: props.payload.businessPlanSettings.UOM,
      isInflation: props.payload.businessPlanSettings.isInflation }}))
)

export function reducer(state: State | undefined, action: Action) {
  return BusinessPlanSettingsReducer(state, action);
}
