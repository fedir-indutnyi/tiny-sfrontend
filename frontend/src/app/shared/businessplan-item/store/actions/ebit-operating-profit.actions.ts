import { createAction, props } from "@ngrx/store";
import { IEbitOperatingProfitPivot } from "../reducers/ebit-operating-profit.reducer";
import { Pnldata } from "@app/shared/sdk";

export const Init = createAction("[EBIT operating profit] init");
export const fillEbitOperatingProfitData = createAction("[EBIT operating profit] fill in EBIT operating profit data", props<{ payload: {ebitOperatingProfits: Pnldata[]} }>())
export const fillEbitOperatingProfitPivotData = createAction("[EBIT operating profit] fill in EBIT operating profit pivot data", props<{ payload: {ebitOperatingProfitPivot: IEbitOperatingProfitPivot[]} }>())