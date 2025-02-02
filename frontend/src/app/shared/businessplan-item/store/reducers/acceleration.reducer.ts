import { Action, createReducer, on } from "@ngrx/store";
import { AccelerationActions } from "..";
import { InitialState } from "../initial-store";
import { ExecutionStatusCode } from "../models";

export interface AccelerationData {
  pnlRow?: string,
  trendType: string,
  trendData: number[],
  trendSettings: {
    months: number[],
    growths: number[]
  }
}

export interface State {
  acceleration: AccelerationData,
  isLoaded: boolean,
  isInitial: boolean,
  executionStatusCode: ExecutionStatusCode
}

let initialStore: State = {
  acceleration: InitialState.acceleration,
  isLoaded: false,
  isInitial: true,
  executionStatusCode: ExecutionStatusCode.INITIAL
}

const AccelerationReducer = createReducer(
  initialStore,
  on(AccelerationActions.init, (state) => initialStore),
  on(AccelerationActions.fillInLoadedData, (state, props) => ({ ...state, acceleration: props.payload.acceleration, isLoaded: true, isInitial: false })),
  on(AccelerationActions.update, (state, props) => ({ ...state, acceleration: props.payload.acceleration,
    isInitial: false,
    isLoaded: false,
    executionStatusCode: ExecutionStatusCode.COMPLETE })),
)

export function reducer(state: State | undefined, action: Action) {
  return AccelerationReducer(state, action);
}
