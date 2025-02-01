import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { AdvancedInflationSettingsActions, BusinessPlanSettingsActions, CostPriceActions, PortfolioActions, Selectors } from "..";
import { switchMap } from "rxjs";

@Injectable()
export class CostPriceEffects {

  constructor(private actions$: Actions, private store: Store) { }

  generateCostsPricePivotData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(...[AdvancedInflationSettingsActions.fillInPivotData]),
      concatLatestFrom(() => [
        this.store.select(Selectors.selectAdvancedInflationSettingsState),
        this.store.select(Selectors.selectPortfolioProductsServicesState),
        this.store.select(Selectors.selectBusinessPlanSettingsState)
      ]),

      switchMap(([action, inflation, productItems, settings]) => {
        if (!productItems.length) return [CostPriceActions.init()];
        if (!inflation.advancedInflationSettings.inflationMultipliers.length) return [CostPriceActions.init()];
        const products = productItems;
        const startPeriod = settings.businessplanSettings.startPeriod;
        const endPeriod = settings.businessplanSettings.endPeriod;
        const yearsList = convertPeriodToYears(new Date(startPeriod), new Date(endPeriod));

        const costPricesData = []
        products.forEach((product, productIndex) => {
          const costPriceData = yearsList.map((year, yearIndex) => {
            let inflationAccumulated = inflation.advancedInflationSettings.inflationSettingsPivotData[productIndex*yearsList.length + yearIndex]?.inflationAccumulatedForProduct ?? 1;
            let productCost = product.cost * inflationAccumulated;
            return {
              pnlrow: 'Cost Price',
              itemcode: product.id.toString(),
              description: product.name,
              itemname: product.name,
              factdate: year + '-01-01T00:00:00Z',
              factvalue: productCost
            };
          });
          costPricesData.push(...costPriceData);
        });

        return [
          CostPriceActions.fillInPivotData({ payload: { costPricePivot: costPricesData } }),
        ]
      })
    )
  })
}

export const convertPeriodToYears = (startPeriod: Date, endPeriod: Date) => {
  let startYear = startPeriod.getFullYear();
  let endYear = endPeriod.getFullYear();
  let years = endYear - startYear + 1;
  let result = Array.from({ length: years }, (value, index) => startYear + index);
  return result
}

export const calculateCostByProductCostIncrease = (cost: number, yearlyCostIncrease: number) => {
  return cost * (1 + yearlyCostIncrease);
}



