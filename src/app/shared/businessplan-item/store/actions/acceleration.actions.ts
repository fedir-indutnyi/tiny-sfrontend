import { createAction, props } from "@ngrx/store";
import { AccelerationData } from "../reducers/acceleration.reducer";

export const init = createAction('[Acceleration] initial data');
export const fillInLoadedData = createAction('[Acceleration] fill in data', props<{payload: { acceleration: AccelerationData }}>());
export const update = createAction('[Acceleration] update data', props<{payload: { acceleration: AccelerationData }}>());

export const reset = createAction('[Acceleration] reset data');

export const updateStateSucceeded = createAction('[Acceleration] update state succeeded');
