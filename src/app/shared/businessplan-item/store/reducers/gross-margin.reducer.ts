import { Action, createReducer, on } from "@ngrx/store";
import { GrossMarginActions, NetSalesActions } from "@businessplan-item/store/index";
import { ExecutionStatusCode } from "../models";
import { Pnldata } from "@app/shared/sdk";


export interface iGrossMarginPivot {
  title: string,
  date: string,
  year: number,
  amount: number,
}

export interface State {
  grossMargin: Pnldata[],
  grossMarginPivot: iGrossMarginPivot[],
  executionStatusCode: ExecutionStatusCode
}

export const initialState: State = {
  grossMargin: [],
  grossMarginPivot: [],
  executionStatusCode: ExecutionStatusCode.INITIAL
};

const GrossMarginReducer = createReducer(
  initialState,
  on(GrossMarginActions.init, (state) => initialState),
  on(GrossMarginActions.fillGrossMarginPivotData, (state, { payload }) => ({ ...state, grossMarginPivot: payload.grossMarginPivot })),
  on(GrossMarginActions.fillGrossMarginData, (state, { payload }) => ({ ...state, grossMargin: payload.grossMargin })),
);

export function reducer(state: State | undefined, action: Action) {
  return GrossMarginReducer(state, action);
}
