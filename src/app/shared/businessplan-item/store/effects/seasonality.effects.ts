import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { PortfolioActions, SeasonalityActions, Selectors } from "..";
import { switchMap } from "rxjs";

@Injectable()
export class ProductSeasonalityEffects {

  constructor(private actions$: Actions, private store: Store) { }

  updateProductSeasonality$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(...[PortfolioActions.update]),
      concatLatestFrom(() => [this.store.select(Selectors.selectProductsSeasonalityState)]),
      switchMap(([action, seasonality]) => {
        let products = action.payload.productsServices;

        const seasonalityMap = new Map(seasonality.map((item) => [item.productId, item]));

        let productsSeasonality = products.map((product) => {
          let seasonalityIndex = seasonalityMap.get(product.id)?.seasonalityIndex;
          return {
            productId: product.id,
            name: product.name,
            seasonalityIndex: seasonalityIndex ? seasonalityIndex : Array.from({ length: 12 }, () => 1.0)
          }
        });

        productsSeasonality.unshift(seasonality[0])
        return [
          SeasonalityActions.update({ payload: { productsSeasonality: productsSeasonality } }),
          SeasonalityActions.updateStateSucceeded()
        ]
      }
      )
    )
  })
}
