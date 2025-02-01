import { PivotCell } from "@app/shared/sdk/model/pivotCell";
import { InitialState } from "../initial-store";
import { Action, createReducer, on } from "@ngrx/store";
import { InvestmentsRequiredActions } from "..";
import { Pnldata } from "@app/shared/sdk";

export interface State {
    safetyPillow: number,
    investmentsRequiredPivotData: PivotCell[],
    investmentsRequiredExportData: Pnldata[],
}


export const initialState: State = {...InitialState.investmentsRequired};

const InvestmentsRequiredReducer = createReducer(
    initialState,
    on(InvestmentsRequiredActions.init, (state) => initialState),
    on(InvestmentsRequiredActions.fillInLoadedData, (state, props) => ({...state, safetyPillow: props.payload.safetyPillow})),
    on(InvestmentsRequiredActions.updateInvestmentsRequiredTable, (state, props) => ({...state, safetyPillow: props.payload.safetyPillow})),
    on(InvestmentsRequiredActions.updateInvestmentsRequiredPivotData, (state, props) => ({...state, investmentsRequiredPivotData:  props.payload.investmentsRequiredPivotData})),
    on(InvestmentsRequiredActions.updateInvestmentsRequiredExportData, (state, props) => ({...state, investmentsRequiredExportData:  props.payload.investmentsRequiredExportData})),
)

export function reducer(state: State | undefined, action: Action){
    return InvestmentsRequiredReducer(state, action);
}