import { createAction, props } from "@ngrx/store";
import { iVolumePivot } from "../reducers/volume.reducer";
import { Pnldata } from "@app/shared/sdk";

export const init = createAction('[Volume] Init');

export const fillInVolumePivotData = createAction('[Volume] Fill in volume pivot data', props<{ payload: { volumePivot: iVolumePivot[] } }>());
export const fillInVolumeDataSource = createAction('[Volume] Fill in volume data source', props<{ payload: { volumeDataSource: Pnldata[] } }>());
