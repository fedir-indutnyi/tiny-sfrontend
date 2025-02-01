import { Action, createReducer, on } from "@ngrx/store"
import { AdvancedInflationSettingsActions } from "..";
import { AdvancedInflationSettings } from "../../typings";
import { InitialState } from "../initial-store";



export interface State {
    advancedInflationSettings: AdvancedInflationSettings,
    isEdited: boolean,
    isLoaded: boolean,
    isInitial: boolean,
}

let initialStore: State = {
    advancedInflationSettings: { ...InitialState.advancedInflationSettings},
    isEdited: false,
    isLoaded: false,
    isInitial: true
}

export interface InflationPivotData {
    name: string,
    year: number,
    inflationForProduct: number,
    priceForProduct: number,
    inflationAccumulatedForProduct: number,
    priceAccumulatedForProduct: number,
}


export interface PivotData {
    name: string,
    year: number,
    data: number,
}

const AdvancedInflationSettingsReducer = createReducer(
    initialStore,
    on(AdvancedInflationSettingsActions.init, (state)=> initialStore),
    on(AdvancedInflationSettingsActions.initInflationMultipliers, (state, props) => ({...state, advancedInflationSettings:
        {...state.advancedInflationSettings, inflationMultipliers: props.payload.inflationMultipliers},
        isInitial: true})),
    on(AdvancedInflationSettingsActions.fillInLoadedData, (state, props) => 
        ({...state, advancedInflationSettings:{...state.advancedInflationSettings, ...props.payload.advancedInflationSettings},
        isLoaded: true, isInitial: true, isEdited: !!props.payload.advancedInflationSettings
    })),
    on(AdvancedInflationSettingsActions.updateInflationMultipliers, (state, props) => ({...state, advancedInflationSettings:
        {...state.advancedInflationSettings, inflationMultipliers: props.payload.advancedInflationSettings.inflationMultipliers},})),
    on(AdvancedInflationSettingsActions.fillInPivotData, (state, props) => ({...state, advancedInflationSettings:
        {...state.advancedInflationSettings, inflationSettingsPivotData: props.payload.inflationPivot}})),
    on(AdvancedInflationSettingsActions.updateYearList, (state, props) => ({...state, advancedInflationSettings:
        {...state.advancedInflationSettings, yearList: props.payload.yearList},
        isInitial: true
    })),
    on(AdvancedInflationSettingsActions.updateYearlyValues, (state, props) => ({...state, advancedInflationSettings:
        {...state.advancedInflationSettings, yearlyValues: props.payload.yearlyValues},
    }))
)

export function reducer(state: State | undefined, action: Action) {
    return AdvancedInflationSettingsReducer(state, action);
}