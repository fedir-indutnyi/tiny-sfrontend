import {InitialState} from "../initial-store";
import {Action, createReducer, on} from "@ngrx/store";

import {OtherOperatingIncomeLossActions} from "..";

export interface iOtherOperatingIncomeLoss {
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
    otherOperatingIncomeLoss: iOtherOperatingIncomeLoss[]
}

export const initialState: State = {
    otherOperatingIncomeLoss: InitialState.operatingIncomeLoss
};

const OtherOperatingIncomeLossReducer = createReducer(
    initialState,
    on(OtherOperatingIncomeLossActions.init, (state) => initialState),
    on(OtherOperatingIncomeLossActions.fillInLoadedData, (state, props) => ({...state, otherOperatingIncomeLoss: props.payload.otherOperatingIncomeLoss})),
    on(OtherOperatingIncomeLossActions.updateAll, (state, props) => ({...state, otherOperatingIncomeLoss: props.payload.otherOperatingIncomeLoss})),
);

export function reducer(state: State | undefined, action: Action) {
    return OtherOperatingIncomeLossReducer(state, action);
}
