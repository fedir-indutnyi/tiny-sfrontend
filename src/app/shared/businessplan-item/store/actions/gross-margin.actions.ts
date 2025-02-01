import { createAction, props } from "@ngrx/store";
import { iGrossMarginPivot } from "../reducers/gross-margin.reducer";
import {Pnldata} from "@shared/sdk";

export const init = createAction('[Gross Margin] Init');
export const fillGrossMarginPivotData = createAction('[Gross Margin] Fill in gross margin pivot data', props<{ payload: { grossMarginPivot: iGrossMarginPivot[] } }>());
export const fillGrossMarginData = createAction('[Gross Margin] Fill in gross margin data', props<{ payload: { grossMargin: Pnldata[] } }>());
