import { Action, createReducer, on } from "@ngrx/store";
import { InitialState } from "../initial-store";
import { SeasonalityActions } from "..";
import { initialStore as portfolioInitialState } from "./portfolio.reducer";
import { ExecutionStatusCode } from "../models";

export interface ProductSeasonality {
  productId: number
  name: string,
  seasonalityIndex: number[]
}

export interface State {
  productsSeasonality: ProductSeasonality[],
  executionStatusCode: ExecutionStatusCode
}

InitialState.productsSeasonality.push({
  productId: portfolioInitialState.productsTotal.id,
  name: portfolioInitialState.productsTotal.name,
  seasonalityIndex: Array.from({ length: 12 }, () => 1.0)
});

const initialStore: State = {
  productsSeasonality: InitialState.productsSeasonality,
  executionStatusCode: ExecutionStatusCode.INITIAL
}



const SeasonalityReducer = createReducer(
  initialStore,
  on(SeasonalityActions.init, (state) => ({ ...initialStore})),
  on(SeasonalityActions.fillInSeasonalityData, (state, { payload }) => ({ ...state, productsSeasonality: payload.productsSeasonality })),
  on(SeasonalityActions.populateProductSeasonality, (state, { payload }) => ({ ...state, productsSeasonality: state.productsSeasonality.map((product) => {
   return {
      ...product,
      seasonalityIndex: payload.productSeasonality.seasonalityIndex
   }
  })})),
  on(SeasonalityActions.update, (state, { payload }) => ({ ...state, productsSeasonality: payload.productsSeasonality }))
)

export function reducer(state: State | undefined, action: Action) {
  return SeasonalityReducer(state, action);
}
