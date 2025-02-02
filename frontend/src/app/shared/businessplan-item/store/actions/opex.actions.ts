import { createAction, props } from "@ngrx/store";
import {iOpex} from "@businessplan-item/store/reducers/opex.reducer";

export const init = createAction('[Opex] Init');
export const fillInLoadedData = createAction('[Opex] Fill In Loaded Data', props<{ payload: { opex: iOpex[] } }>());
export const updateAll = createAction('[Opex] Update All', props<{ payload: { opex: iOpex[] } }>());
