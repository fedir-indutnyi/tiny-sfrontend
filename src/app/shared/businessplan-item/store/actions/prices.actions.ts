import { createAction, props } from "@ngrx/store";
import { pricesPivot } from "../reducers/prices.reducer";
import { Pnldata } from "@app/shared/sdk";

export const init = createAction('[Prices] Init');
export const fillInPivotData = createAction('[Prices] Fill In Pivot Data', props<{payload: {pricesPivot: Pnldata[]}}>());
