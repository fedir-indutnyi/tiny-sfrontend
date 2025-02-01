import { Type } from '@angular/core';
import { combineReducers } from '@ngrx/store';
import { SectionsStatusEffects } from './section-status.effects';
import * as SectionStatusReducer from './section-status.reducer';


export const FEATURE_KEY: string = 'StatusesStore'

export interface State {
  StatusState: SectionStatusReducer.State
}

export const reducers = combineReducers<State>({
  StatusState: SectionStatusReducer.reducer
})


export const effects: Type<unknown>[] = [
  SectionsStatusEffects
];
