import {InitialState} from "../initial-store";
import {Action, createReducer, on} from "@ngrx/store";

import {MarketingActions} from "..";

export interface iMarketing {
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
    marketing: iMarketing[]
}

export const initialState: State = {
    marketing: InitialState.marketing
};

const MarketingReducer = createReducer(
    initialState,
    on(MarketingActions.init, (state) => initialState),
    on(MarketingActions.fillInLoadedData, (state, props) => ({...state, marketing: props.payload.marketing})),
    on(MarketingActions.updateAll, (state, props) => ({...state, marketing: props.payload.marketing})),
);

export function reducer(state: State | undefined, action: Action) {
    return MarketingReducer(state, action);
}
