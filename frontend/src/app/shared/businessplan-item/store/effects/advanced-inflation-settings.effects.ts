import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { AdvancedInflationSettingsActions, BusinessPlanSettingsActions, PortfolioActions, Selectors } from "..";
import { EMPTY, switchMap } from "rxjs";
import { calculateCostByProductCostIncrease, convertPeriodToYears } from "./cost-price.effects";
import { calcYearlyRatesForYears } from "../../businessplan-item.functions";
import { YearlyValues } from "../../typings";

@Injectable()
export class AdvancedInflationSettingsEffects {

  constructor(private actions$: Actions, private store: Store) { }

  private calcYearlyValueUsingMultiplier(yearlyValue: number, multiplier: number){
    return Number((yearlyValue * multiplier).toFixed(2));
  }

  getYearsList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(...[BusinessPlanSettingsActions.fillInLoadedData, BusinessPlanSettingsActions.updatePeriods]),
      concatLatestFrom(() => [
        this.store.select(Selectors.selectBusinessPlanSettingsState),
      ]),
      
      switchMap(([action, settings]) => {
        if (!settings.businessplanSettings.startPeriod || !settings.businessplanSettings.endPeriod) 
        return EMPTY;

        let yearsList = convertPeriodToYears(new Date(settings.businessplanSettings.startPeriod), new Date(settings.businessplanSettings.endPeriod));

        
        return [
          AdvancedInflationSettingsActions.updateYearList({ payload: { yearList: yearsList } }),
        ]
      })
    )
  });

  initInflationMultipliers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(...[AdvancedInflationSettingsActions.fillInLoadedData, AdvancedInflationSettingsActions.updateYearList, BusinessPlanSettingsActions.updateAcceleration]),
      concatLatestFrom(() => [
        this.store.select(Selectors.selectAdvancedInflationSettingsState),
      ]),
      
      switchMap(([action, inflationState]) => {
        let settings = inflationState.advancedInflationSettings;
        if (settings.inflationMultipliers.length == settings.yearList.length) return EMPTY;

        let inflationMultipliers = Array.from(
          {length: settings.yearList.length}, () => 1);

        
        return [
          AdvancedInflationSettingsActions.initInflationMultipliers({ payload: { inflationMultipliers: inflationMultipliers } }),
        ]
      })
    )
  });

  generateInflationPriceAndSalaryIncreaseForYears$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(...[AdvancedInflationSettingsActions.fillInLoadedData, AdvancedInflationSettingsActions.initInflationMultipliers, AdvancedInflationSettingsActions.updateInflationMultipliers, BusinessPlanSettingsActions.updateAcceleration]),
      concatLatestFrom(() => [
        this.store.select(Selectors.selectAdvancedInflationSettingsState),
        this.store.select(Selectors.selectBusinessPlanSettingsState)
      ]),
      
      switchMap(([action, inflationState, settings]) => {
        if(!inflationState.advancedInflationSettings.inflationMultipliers.length) return EMPTY;
        let yearlyValues: YearlyValues[] = []

        inflationState.advancedInflationSettings.inflationMultipliers.forEach((multiplier)=>{
          let yearlyValue = {
            yearlyInflationRate: this.calcYearlyValueUsingMultiplier(
              settings.businessplanSettings.yearlyInflationRate, multiplier),
            yearlyPriceIncrease: this.calcYearlyValueUsingMultiplier(
              settings.businessplanSettings.yearlyPriceIncrease, multiplier),
            yearlySalaryIncrease: this.calcYearlyValueUsingMultiplier(
              settings.businessplanSettings.yearlySalaryIncrease, multiplier)
          };
          
          yearlyValues.push(yearlyValue);
        })
        
        return [
          AdvancedInflationSettingsActions.updateYearlyValues({payload: {yearlyValues: yearlyValues}})
        ]
      })
    )
  })
  

  generateCostsPricePivotData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(...[PortfolioActions.fillInLoadedDataProducts, PortfolioActions.update, PortfolioActions.updateProductsAcceleration, AdvancedInflationSettingsActions.updateYearList, AdvancedInflationSettingsActions.updateInflationMultipliers, AdvancedInflationSettingsActions.fillInLoadedData, BusinessPlanSettingsActions.updateAcceleration]),
      concatLatestFrom(() => [
        this.store.select(Selectors.selectAdvancedInflationSettingsState),
        this.store.select(Selectors.selectPortfolioProductsServicesState),
        this.store.select(Selectors.selectBusinessPlanSettingsState)
      ]),
      
      switchMap(([action, inflationState, productItems, settings]) => {
        if (!productItems.length) return EMPTY;
        if (!inflationState.advancedInflationSettings.inflationMultipliers.length) return EMPTY;
        if (!settings.businessplanSettings.isInflation){
          productItems = productItems.map((value)=>{
            return { ...value, yearlyInflationRate: 0, yearlyPriceIncrease: 0}
          })
        }

        let products = productItems;
        let yearsList = inflationState.advancedInflationSettings.yearList;

        let productsInflationData = products.map((product, index) => {

          let accumulatedCost = 1
          let accumulatedPrice = 1

          let inflationData = yearsList.map((year, index) => {

            let inflation = Number(calcYearlyRatesForYears(
              product.yearlyInflationRate, inflationState.advancedInflationSettings.inflationMultipliers[index] ?? 1))
            let priceIncrease = Number(calcYearlyRatesForYears(
              product.yearlyPriceIncrease, inflationState.advancedInflationSettings.inflationMultipliers[index] ?? 1))
            accumulatedCost = calculateCostByProductCostIncrease(accumulatedCost, inflation);
            accumulatedPrice = calculateCostByProductCostIncrease(accumulatedPrice, priceIncrease);

            return {
              productId: product.id,
              name: product.name,
              year: year,
              inflationForProduct: inflation,
              priceForProduct: priceIncrease,
              inflationAccumulatedForProduct: accumulatedCost,
              priceAccumulatedForProduct: accumulatedPrice,
            };
          });


          return inflationData;
        });

        let InflationPivotData = []
        productsInflationData.forEach((products) => {
          products.forEach((product) => {
            InflationPivotData.push(product)
          })
        });

        return [
          AdvancedInflationSettingsActions.fillInPivotData({ payload: { inflationPivot: InflationPivotData } }),
        ]
      })
    )
  }) 
}




