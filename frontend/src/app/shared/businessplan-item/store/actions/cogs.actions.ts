import { createAction, props } from "@ngrx/store";
import { iCogs } from "../reducers/cogs.reducer";

export const init = createAction('[Cogs] Init');
export const fillInLoadedData = createAction('[Cogs] Fill In Loaded Data', props<{ payload: { cogs: iCogs[] } }>());
export const updateAll = createAction('[Cogs] Update All', props<{ payload: { cogs: iCogs[] } }>());