import { createAction, props } from "@ngrx/store";
import { iDiscountsAndReturns } from "@businessplan-item/store/reducers/discounts-and-returns.reducer";

export const init = createAction('[DiscountsAndReturns] Init');
export const fillInLoadedData = createAction('[DiscountsAndReturns] Fill In Loaded Data', props<{ payload: { discountsAndReturns: iDiscountsAndReturns[] } }>());
export const updateAll = createAction('[DiscountsAndReturns] Update All', props<{ payload: { discountsAndReturns: iDiscountsAndReturns[] } }>());