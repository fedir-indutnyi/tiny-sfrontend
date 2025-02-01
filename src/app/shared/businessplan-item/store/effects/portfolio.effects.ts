import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import { Observable, map, switchMap } from "rxjs";
import { Selectors, PortfolioActions, VisitorsCustomersActions, BusinessPlanSettingsActions } from "..";
import { getTotalUnits, getTotalActiveMonthlyCustomers, getTradeMargin, getTradeMarkup, getTotalAssetValue, getMonthlyCustomerConversionFromEachN } from "../../businessplan-item.functions";
import { convertToDifferentCustomerMetrics } from "../../businessplan-item.functions"


@Injectable()
export class CalculateTotalsEffects {

  constructor(private action$: Actions, private store: Store) { }

  updateProductsAcceleration$: Observable<Action> = createEffect(() => {
    return this.action$.pipe(
      ofType(BusinessPlanSettingsActions.updateAcceleration, BusinessPlanSettingsActions.fillInLoadedData),
      concatLatestFrom(() => [
        this.store.select(Selectors.selectPortfolioProductsServicesState)
      ]),
      map(([{payload}, products]) => {
        products.map((product, index) => {
          if (product.overrideFromBusinessDetails) return product;
          product.yearlyInflationRate = payload.businessPlanSettings.yearlyInflationRate;
          product.yearlyPriceIncrease = payload.businessPlanSettings.yearlyPriceIncrease;
          return product
        });

        return PortfolioActions.updateProductsAcceleration({ payload: { products: products, acceleration: payload.businessPlanSettings } });
      }));
  })

  updateTotalCustomers$: Observable<Action> = createEffect(() => {
    return this.action$.pipe(
      ofType(VisitorsCustomersActions.update),
      concatLatestFrom(() => [
        this.store.select(Selectors.selectPortfolioTotalsState),
        this.store.select(Selectors.selectPortfolioProductsServicesState)
      ]),
      map(([action, productsTotal, products]) => {
        products.forEach((product, index) => {
          this.store.dispatch(PortfolioActions.updateProductByIndex({ payload: { index: index, productService: product } }));
        })

        return PortfolioActions.updateTotal({
          payload: {
            productsTotal: {
              ...productsTotal,
              monthlyConversionUserThatBuys: getMonthlyCustomerConversionFromEachN(productsTotal.eachNCustomerBuys),
              customers: action.payload.aboutVisitorsCustomers.totalMonthlyCustomers
            }
          }
        });
      }))
  });

  calcTotalUnits$ = createEffect(() => {
    return this.action$.pipe(
      ofType(PortfolioActions.updateTotalUnits),
      concatLatestFrom(() => [
        this.store.select(Selectors.selectPortfolioTotalsState),
        this.store.select(Selectors.selectPortfolioProductsServicesState)
      ]),
      map(([action, productsTotal, products]) => {
        let unitsSum: number = 0;
        products.forEach((product, index) => {
          if (!product.totalUnits) return;
          unitsSum += product.totalUnits
        })
        productsTotal.totalUnits = Number(unitsSum.toFixed(2));
        return PortfolioActions.updateTotalDone({ payload: { productsTotal: { ...productsTotal } } });
      })
    )
  })

  calculateTotalMonthlyValue$ = createEffect(() => {
    return this.action$.pipe(
      ofType(PortfolioActions.updateTotalMonthlyValue),
      concatLatestFrom(() => [
        this.store.select(Selectors.selectPortfolioProductsServicesState),
        this.store.select(Selectors.selectPortfolioTotalsState)
      ]),
      map(([action, products, productsTotal]) => {
        let monthlyValue: number = 0;
        products.forEach((product, index) => {
          if (!product.totalMonthlyValue) return;
          monthlyValue += product.totalMonthlyValue
        })
        
        productsTotal.totalMonthlyValue = monthlyValue;
        return PortfolioActions.updateTotalDone({ payload: { productsTotal: productsTotal } });
      })
    )
  })

}


@Injectable()
export class CalculateProductsItemEffects {
  constructor(private action$: Actions, private store: Store) { }

  updateProductService$ = createEffect(() => {
    return this.action$.pipe(
      ofType(PortfolioActions.updateProductByIndex, PortfolioActions.addNewProduct),
      concatLatestFrom(() => [
        this.store.select(Selectors.selectVisitorsCustomersState),
      ]),
      switchMap(([action, visitorsCustomerState]) => {
        let product = { ...action.payload.productService };
        let numberOfCustomers =  visitorsCustomerState.aboutVisitorsCustomers.totalMonthlyCustomers;
        if (action.type == "[Portfolio Product] update product item by Index" && action.payload.customerCalculationMethod){
          let customerCalculationMethod = action.payload.customerCalculationMethod
          product = convertToDifferentCustomerMetrics(product, customerCalculationMethod, numberOfCustomers)
        }
        product.productMarkup = getTradeMarkup(product.cost, product.price);
        product.productMargin = getTradeMargin(product.cost, product.price);
        product.customers = getTotalActiveMonthlyCustomers(visitorsCustomerState.aboutVisitorsCustomers.totalMonthlyCustomers, product.monthlyConversionUserThatBuys);
        product.totalUnits = getTotalUnits(product.ordersMonthPerCustomer, product.customers);
        product.onFirstInitialStock = Number(product.onFirstInitialStock);
        product.totalAssetValue = getTotalAssetValue(product.numberOfMonthsForInitialStock, product.cost, product.totalUnits);
        product.yearlyInflationRate = product.yearlyInflationRate;
        product.yearlyPriceIncrease = product.yearlyPriceIncrease;
        product.totalMonthlyValue = +(product.price * product.totalUnits).toFixed(2)

        return [PortfolioActions.updateProductByIndexDone({ payload: { index: action.payload.index, productService: product } }),
        PortfolioActions.updateTotalUnits(),
        PortfolioActions.updateTotalMonthlyValue()
        ];
      })
    )
  });

  updateAllProductServices$ = createEffect(() => {
    return this.action$.pipe(
      ofType(PortfolioActions.fillInLoadedDataProducts),
      concatLatestFrom(() => [
        this.store.select(Selectors.selectVisitorsCustomersState),
      ]),
      switchMap(([action, visitorsCustomerState,]) => {
        let productsServices = action.payload.productsServices;
        productsServices = productsServices.map((product) => {
          product.productMarkup = getTradeMarkup(product.cost, product.price);
          product.productMargin = getTradeMargin(product.cost, product.price);
          product.monthlyConversionUserThatBuys = product.monthlyConversionUserThatBuys;
          product.eachNCustomerBuys = product.eachNCustomerBuys;
          product.customers = getTotalActiveMonthlyCustomers(visitorsCustomerState.aboutVisitorsCustomers.totalMonthlyCustomers, product.monthlyConversionUserThatBuys);
          product.totalUnits = getTotalUnits(product.ordersMonthPerCustomer, product.customers);
          product.onFirstInitialStock = Number(product.onFirstInitialStock);
          product.totalAssetValue = getTotalAssetValue(product.numberOfMonthsForInitialStock, product.cost, product.totalUnits);
          product.yearlyInflationRate = product.yearlyInflationRate;
          product.yearlyPriceIncrease = product.yearlyPriceIncrease;

          return product;
        })

        return [PortfolioActions.updateTotalUnits(), PortfolioActions.updateTotalUnits()];
      })
    )
  })


}
