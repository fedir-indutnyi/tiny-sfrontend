import {InitialState} from "../initial-store";
import {Action, createReducer, on} from "@ngrx/store";

import {RnDActions} from "..";

export interface iRnD {
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
    rnd: iRnD[],
}

export const initialState: State = {
    rnd: InitialState.rnd
};

const RnDReducer = createReducer(
    initialState,
    on(RnDActions.init, (state) => initialState),
    on(RnDActions.fillInLoadedData, (state, props) => ({...state, rnd: props.payload.rnd})),
    on(RnDActions.updateAll, (state, props) => ({...state, rnd: props.payload.rnd})),
);

export function reducer(state: State | undefined, action: Action) {
    return RnDReducer(state, action);
}
