import { Action, createReducer, on } from "@ngrx/store";
import { InitialState } from "../initial-store";
import { PricesActions } from "..";
import { Pnldata } from "@app/shared/sdk";

export interface pricesPivot {
  productId: number,
  name: string,
  year: number,
  price: number
}

export interface State {
  pricesPivot: Pnldata[]
}

let initialStore: State = {
  pricesPivot: InitialState.prices
}

const PricesReducer = createReducer(
  initialStore,
  on(PricesActions.init, (state) => initialStore),
  on(PricesActions.fillInPivotData, (state, props) => ({...state, pricesPivot: props.payload.pricesPivot})),
)

export function reducer(state: State | undefined, action: Action) {
  return PricesReducer(state, action);
}
