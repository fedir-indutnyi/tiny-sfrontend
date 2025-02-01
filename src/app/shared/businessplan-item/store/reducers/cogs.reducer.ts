import { InitialState } from "../initial-store";
import { Action, createReducer, on } from "@ngrx/store";
import { CogsActions } from "..";

export interface iCogs {
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
    cogs: iCogs[]
}

export const initialState: State = {
    cogs: InitialState.cogs
};

const CogsReducer = createReducer(
    initialState,
    on(CogsActions.init, (state) => initialState),
    on(CogsActions.fillInLoadedData, (state, props) => ({ ...state, cogs: props.payload.cogs })),
    on(CogsActions.updateAll, (state, props) => ({ ...state, cogs: props.payload.cogs })),
)
export function reducer(state: State | undefined, action: Action) {
    return CogsReducer(state, action);
}
