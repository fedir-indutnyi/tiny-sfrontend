import { Action, createReducer, on } from "@ngrx/store";
import { AggregateSalesDataActions } from "@businessplan-item/store/index";
import { ExecutionStatusCode } from "../models";
import { Pnldata } from "@app/shared/sdk";


export interface TargetedAudiencePivot {
  title: string,
  date: string,
  year: number,
  amount: number,
}

export interface State {
  targetedAudiencePivot: TargetedAudiencePivot[],
  targetedAudienceDataState: Pnldata[],
  visitorsPivot: TargetedAudiencePivot[],
  visitorsDataState: Pnldata[],
  customersPivot: TargetedAudiencePivot[],
  customersDataState: Pnldata[],
  executionStatusCode: ExecutionStatusCode
}

let initialStore: State = {
  targetedAudiencePivot: [],
  targetedAudienceDataState: [],
  visitorsPivot: [],
  visitorsDataState: [],
  customersPivot: [],
  customersDataState: [],
  executionStatusCode: ExecutionStatusCode.INITIAL
}

const AggregatedSalesDataReducer = createReducer(
  initialStore,
  on(AggregateSalesDataActions.init, (state) => initialStore),
  on(AggregateSalesDataActions.fillInTargetedAudiencePivotData, (state, { payload }) => ({ ...state, targetedAudiencePivot: payload.targetedAudiencePivot })),
  on(AggregateSalesDataActions.fillInVisitorsPivotData, (state, { payload }) => ({ ...state, visitorsPivot: payload.visitorsPivot })),
  on(AggregateSalesDataActions.fillInCustomersPivotData, (state, { payload }) => ({ ...state, customersPivot: payload.customersPivot })),

  on(AggregateSalesDataActions.fillInTargetedAudienceDataState, (state, { payload }) =>
    ({ ...state, targetedAudienceDataState: payload.targetedAudienceDataState })),
  on(AggregateSalesDataActions.fillInVisitorsDataState, (state, { payload }) => ({ ...state, visitorsDataState: payload.visitorsDataState })),
  on(AggregateSalesDataActions.fillInCustomersDataState, (state, { payload }) => ({ ...state, customersDataState: payload.customersDataState }))
)

export function reducer(state: State | undefined, action: Action) {
  return AggregatedSalesDataReducer(state, action);
}
