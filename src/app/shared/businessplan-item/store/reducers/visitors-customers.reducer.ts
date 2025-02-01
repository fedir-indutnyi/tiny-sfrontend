import { Action, createReducer, on } from "@ngrx/store";
import { VisitorsCustomersActions } from "..";
import { AboutVisitorsCustomers } from "../../typings";
import { InitialState } from "../initial-store";
import { ExecutionStatusCode } from "../models";


export interface State {
  aboutVisitorsCustomers: AboutVisitorsCustomers;
  isEdited: boolean,
  isLoaded: boolean,
  isInitial: boolean,
  executionStatusCode: ExecutionStatusCode
}

let initialStore: State = {
  aboutVisitorsCustomers: { ...InitialState.aboutVisitorsCustomers },
  isEdited: false,
  isLoaded: false,
  isInitial: true,
  executionStatusCode: ExecutionStatusCode.INITIAL
}

const VisitorsCustomersReducer = createReducer(
  initialStore,
  on(VisitorsCustomersActions.init, (state) => initialStore),
  on(VisitorsCustomersActions.fillInLoadedData, (state, props) =>
    ({ ...state, aboutVisitorsCustomers: { ...state.aboutVisitorsCustomers, ...props.payload.aboutVisitorsCustomers }, isLoaded: true, isInitial: false, isEdited: !!props.payload.aboutVisitorsCustomers })),
  on(VisitorsCustomersActions.update, (state, props) =>
    ({ ...state, aboutVisitorsCustomers: { ...state.aboutVisitorsCustomers, ...props.payload.aboutVisitorsCustomers },
      isEdited: true,
      isInitial: false,
      executionStatusCode: ExecutionStatusCode.COMPLETE })),
)

export function reducer(state: State | undefined, action: Action) {
  return VisitorsCustomersReducer(state, action);
}
