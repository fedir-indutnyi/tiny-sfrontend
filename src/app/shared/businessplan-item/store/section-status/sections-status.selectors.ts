import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as SectionStatus from '@businessplan-item/store/section-status/index';

const sectionStatusState = createFeatureSelector<SectionStatus.State>(SectionStatus.FEATURE_KEY);

export const getSectionsStatuses = createSelector(
  sectionStatusState,
  (state: SectionStatus.State) => state.StatusState
);

export const getPortfolioStatus = createSelector(
  sectionStatusState,
  (state: SectionStatus.State) => state.StatusState.portfolio
)
