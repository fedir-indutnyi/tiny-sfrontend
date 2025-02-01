import {InitialState} from "../initial-store";
import {Action, createReducer, on} from "@ngrx/store";

import {OpexActions} from "..";

export interface iOpex {
    pnlRow: string,
    description: string,
    percentage: number,
    staticMonthlyNumber: number,
    vendor: string,
    comments: string,
    startMonth: number,
    endMonth: number,
}

export interface State {
    opex: iOpex[],
}

export const initialState: State = {
    opex: InitialState.opex
};

const OpexReducer = createReducer(
    initialState,
    on(OpexActions.init, (state) => initialState),
    on(OpexActions.fillInLoadedData, (state, props) => ({...state, opex: props.payload.opex})),
    on(OpexActions.updateAll, (state, props) => ({...state, opex: props.payload.opex})),
);

export function reducer(state: State | undefined, action: Action) {
    return OpexReducer(state, action);
}
