import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { AdvancedInflationSettingsActions, BusinessPlanSettingsActions, PortfolioActions, PricesActions, Selectors } from "..";
import { switchMap } from "rxjs";

@Injectable()
export class PricesEffects {

  constructor(private actions$: Actions, private store: Store) { }

  generatePricesPivotData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(...[AdvancedInflationSettingsActions.fillInPivotData]),
      concatLatestFrom(() => [
        this.store.select(Selectors.selectAdvancedInflationSettingsState),
        this.store.select(Selectors.selectBusinessPlanSettingsState),
        this.store.select(Selectors.selectPortfolioProductsServicesState)
      ]),

      switchMap(([action, inflation, settings, productItems]) => {
        if (!productItems.length) return [PricesActions.init()];
        const products = productItems;
        const startPeriod = settings.businessplanSettings.startPeriod;
        const endPeriod = settings.businessplanSettings.endPeriod;
        const yearsList = convertPeriodToYears(new Date(startPeriod), new Date(endPeriod));

        const pricesData = [];

        products.forEach((product, productIndex) => {
          const priceData = yearsList.map((year, yearIndex) => {
            let inflationAccumulated = inflation.advancedInflationSettings.inflationSettingsPivotData[productIndex * yearsList.length + yearIndex]?.priceAccumulatedForProduct ?? 1;
            let productPrice = product.price * inflationAccumulated ;
            return {
              pnlrow: 'Price List',
              itemcode: product.id.toString(),
              description: product.name,
              itemname: product.name,
              factdate: year + '-01-01T00:00:00Z',
              factvalue: productPrice
            };
          });

          pricesData.push(...priceData);
        });

        return [
          PricesActions.fillInPivotData({ payload: { pricesPivot: pricesData } }),
        ]
      })
    )
  })
}

const convertPeriodToYears = (startPeriod: Date, endPeriod: Date) => {
  let startYear = startPeriod.getFullYear();
  let endYear = endPeriod.getFullYear();
  let years = endYear - startYear + 1;
  let result = Array.from({ length: years }, (value, index) => startYear + index);
  return result
}

const calculatePriceByProductPriceIncrease = (price: number, yearlyPriceIncrease: number) => {
  return price * (1 + yearlyPriceIncrease);
}



