import { createAction, props } from "@ngrx/store";
import { ProductSeasonality } from "@businessplan-item/store/reducers/seasonality.reducer";

export const init = createAction('[Seasonality] Init');
export const fillInSeasonalityData = createAction('[Seasonality] Fill In Seasonality Data', props<{payload: { productsSeasonality: ProductSeasonality[] }}>());
export const update = createAction('[Seasonality] Update Product Seasonality', props<{payload: { productsSeasonality: ProductSeasonality[] }}>());

export const populateProductSeasonality = createAction('[Seasonality] Populate Product Seasonality', props<{payload: { productSeasonality: ProductSeasonality }}>());

export const updateStateSucceeded = createAction('[Seasonality] Update State Succeeded');
