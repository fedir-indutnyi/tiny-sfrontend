import { Action, createReducer, on } from "@ngrx/store";
import { VolumeActions } from "..";
import { Pnldata } from "@app/shared/sdk";


export interface iAggregatedPivot {
  title: string,
  date: string,
  year: number,
  amount: number,
}

export interface iVolumePivot extends iAggregatedPivot { }

export interface State {
  volumePivot: iVolumePivot[],
  volumeDataSource: Pnldata[],
}

let initialStore: State = {
  volumePivot: [],
  volumeDataSource: [],
}

const VolumeReducer = createReducer(
  initialStore,
  on(VolumeActions.init, (state) => initialStore),
  on(VolumeActions.fillInVolumePivotData, (state, { payload }) => ({ ...state, volumePivot: payload.volumePivot })),
  on(VolumeActions.fillInVolumeDataSource, (state, { payload }) => ({ ...state, volumeDataSource: payload.volumeDataSource })),
)

export function reducer(state: State | undefined, action: Action) {
  return VolumeReducer(state, action);
}
