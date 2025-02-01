import {createAction, props} from "@ngrx/store";
import {iOtherOperatingIncomeLoss} from "@businessplan-item/store/reducers/other-operating-income-loss.reducer";

export const init = createAction('[Other Operating Income Loss] Init');
export const fillInLoadedData = createAction('[Other Operating Income Loss] Fill In Loaded Data', props<{ payload: { otherOperatingIncomeLoss: iOtherOperatingIncomeLoss[] } }>());
export const updateAll = createAction('[Other Operating Income Loss] Update All', props<{ payload: { otherOperatingIncomeLoss: iOtherOperatingIncomeLoss[] } }>());
