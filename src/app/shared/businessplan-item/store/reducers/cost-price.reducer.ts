import { Action, createReducer, on } from "@ngrx/store";
import { CostPriceActions } from "..";
import { InitialState } from "../initial-store";
import { ExecutionStatusCode } from "../models";
import { Pnldata } from "@app/shared/sdk";


export interface State {
  costPricePivot: Pnldata[]
  executionStatusCode: ExecutionStatusCode
}

let initialStore: State = {
  costPricePivot: InitialState.costPrices,
  executionStatusCode: ExecutionStatusCode.INITIAL
}

const CostPriceReducer = createReducer(
  initialStore,
  on(CostPriceActions.init, (state) => initialStore),
  on(CostPriceActions.fillInPivotData, (state, props) => ({...state, costPricePivot: props.payload.costPricePivot})),
)

export function reducer(state: State | undefined, action: Action) {
  return CostPriceReducer(state, action);
}
