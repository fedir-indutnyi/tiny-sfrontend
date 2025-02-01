import { Action, createReducer, on } from "@ngrx/store";
import { DiscountsAndReturnsActions } from "@businessplan-item/store/index";
import { InitialState } from "../initial-store";
import { ExecutionStatusCode } from "../models";


export interface iDiscountsAndReturns {
    pnlRow: string,
    description: string,
    staticMonthlyNumber: number,
    percentage: number,
    comments: string,
    startMonth: number,
    endMonth: number,
  }

export interface State {
    discountsAndReturns: iDiscountsAndReturns[],
    executionStatusCode: ExecutionStatusCode
  }

  export const initialState: State = {
    discountsAndReturns: InitialState.discountsAndReturns,
    executionStatusCode: ExecutionStatusCode.INITIAL
  };


const DiscountsAndReturnsReducer = createReducer(
    initialState,
    on(DiscountsAndReturnsActions.init, (state) => initialState),
    on(DiscountsAndReturnsActions.fillInLoadedData, (state, { payload }) => ({ ...state, discountsAndReturns: payload.discountsAndReturns })),
    on(DiscountsAndReturnsActions.updateAll, (state, { payload }) => ({ ...state, discountsAndReturns: payload.discountsAndReturns })),
)

export function reducer(state: State | undefined, action: Action) {
    return DiscountsAndReturnsReducer(state, action);
  }
