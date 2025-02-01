import { createAction, props } from "@ngrx/store";
import { PivotCell } from "@app/shared/sdk/model/pivotCell";
import { Pnldata } from "@app/shared/sdk";

export const init = createAction('[Investment Required] Init');
export const fillInLoadedData = createAction('[Investment Required] fill in loaded data', props<{payload: {
        safetyPillow: number;
    }}>());
export const updateInvestmentsRequiredTable = createAction('[Investment Required] update Safety Pillow', props<{
    payload:{
        safetyPillow: number;
    }}>());

export const updateInvestmentsRequiredPivotData = createAction('[Investment Required] update Pivot Data', props<{
    payload:{
        investmentsRequiredPivotData: PivotCell[],
    }}>());

export const updateInvestmentsRequiredExportData = createAction('[Investment Required] update Export Data', props<{
    payload:{
        investmentsRequiredExportData: Pnldata[],
    }}>());