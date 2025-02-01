import {createAction, props} from "@ngrx/store";
import {iRnD} from "@businessplan-item/store/reducers/rnd.reducer";

export const init = createAction('[RnD] Init');
export const fillInLoadedData = createAction('[RnD] Fill In Loaded Data', props<{ payload: { rnd: iRnD[] } }>());
export const updateAll = createAction('[RnD] Update All', props<{ payload: { rnd: iRnD[] } }>());
