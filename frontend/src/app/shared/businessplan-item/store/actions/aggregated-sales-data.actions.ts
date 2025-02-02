import { createAction, props } from "@ngrx/store";
import { TargetedAudiencePivot } from "../reducers/aggregated-sales-data.reducer";
import { Pnldata } from "@app/shared/sdk";

export const init = createAction('[Aggregate Sales Data] initial data');
export const empty = createAction('[Aggregate Sales Data] do nothing with');

export const fillInTargetedAudiencePivotData = createAction('[Aggregate Sales Data] fill in targeted audience pivot data', props<{ payload: { targetedAudiencePivot: TargetedAudiencePivot[] } }>());
export const fillInVisitorsPivotData = createAction('[Aggregate Sales Data] fill in visitors pivot data', props<{ payload: { visitorsPivot: TargetedAudiencePivot[] } }>());
export const fillInCustomersPivotData = createAction('[Aggregate Sales Data] fill in customers pivot data', props<{ payload: { customersPivot: TargetedAudiencePivot[] } }>());

export const fillInTargetedAudienceDataState = createAction('[Aggregate Sales Data] fill in targeted audience data state', props<{ payload: { targetedAudienceDataState: Pnldata[] } }>());
export const fillInVisitorsDataState = createAction('[Aggregate Sales Data] fill in visitors data state', props<{ payload: { visitorsDataState: Pnldata[] } }>());
export const fillInCustomersDataState = createAction('[Aggregate Sales Data] fill in customers data state', props<{ payload: { customersDataState: Pnldata[] } }>());


export const updateCustomerDataSucceeded = createAction('[Aggregate Customers Data] update data succeeded');
