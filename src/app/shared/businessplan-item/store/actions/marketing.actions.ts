import { createAction, props } from "@ngrx/store";
import {iMarketing} from "@businessplan-item/store/reducers/marketing.reducer";

export const init = createAction('[Marketing] Init');
export const fillInLoadedData = createAction('[Marketing] Fill In Loaded Data', props<{ payload: { marketing: iMarketing[] } }>());
export const updateAll = createAction('[Marketing] Update All', props<{ payload: { marketing: iMarketing[] } }>());
