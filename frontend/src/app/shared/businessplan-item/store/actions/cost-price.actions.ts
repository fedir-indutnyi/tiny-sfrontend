import { createAction, props } from "@ngrx/store";
import { Pnldata } from "@app/shared/sdk";

export const init = createAction('[Cost Price] initial data');
export const fillInPivotData = createAction('[Cost Price] fill with pivot data', props<{payload: { costPricePivot: Pnldata[] }}>());
