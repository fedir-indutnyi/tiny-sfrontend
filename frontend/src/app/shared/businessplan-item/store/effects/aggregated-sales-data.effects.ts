import { Injectable } from "@angular/core";
import { AccelerationActions, AggregateSalesDataActions, BusinessPlanItemActions, BusinessPlanSettingsActions, SeasonalityActions, Selectors } from "@businessplan-item/store/index";
import { TargetedAudiencePivot } from "@businessplan-item/store/reducers/aggregated-sales-data.reducer";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { EMPTY, switchMap } from "rxjs";
import { ProductsService } from "../../typings";
import { ProductSeasonality } from "../reducers/seasonality.reducer";
import { Pnldata } from "@app/shared/sdk";

@Injectable()
export class AggregatedSalesDataEffects {
  workerDataSource!: Worker;
  workerPivot!: Worker;
  constructor(private actions$: Actions, private store: Store) {
    this.workerDataSource = new Worker(new URL('./aggregated-sales-data-generator.worker', import.meta.url));
    this.workerPivot = new Worker(new URL('./aggregated-sales-data-pivot-generator.worker', import.meta.url));
  }

  generateTargetedAudiencePivotData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(...[BusinessPlanItemActions.loadSuccess,
      BusinessPlanSettingsActions.update,
      SeasonalityActions.updateStateSucceeded]),
      concatLatestFrom(() => [
        this.store.select(Selectors.selectBusinessPlanSettingsState),
        this.store.select(Selectors.selectVisitorsCustomersState),
        this.store.select(Selectors.selectProductsSeasonalityState),
      ]),
      switchMap(([
        action,
        settings,
        visitorsCustomers,
        seasonality
      ]) => {
        if (!seasonality.length) return EMPTY;
        const seasonalityTotalProduct = seasonality.filter((product) => product.productId === 0);
        const crowd = visitorsCustomers.aboutVisitorsCustomers.totalMonthlyCrowd;
        const startPeriod = settings.businessplanSettings.startPeriod;
        const endPeriod = settings.businessplanSettings.endPeriod;
        const dateList = generateListOfMonths(new Date(startPeriod), new Date(endPeriod));
        const productPivotDataSource: TargetedAudiencePivot[] = [];
        const productDataSource: Pnldata[] = [];


        const sourceData = { seasonality, dateList, crowd, result: [] }
        this.workerDataSource.postMessage(sourceData);

        this.workerDataSource.onmessage = ({ data }) => {
          this.store.dispatch(AggregateSalesDataActions.fillInTargetedAudienceDataState({ payload: { targetedAudienceDataState: data.result } }));
        }


        const sourceDataPivot = { seasonality: seasonalityTotalProduct, dateList, crowd, result: [] }
        this.workerPivot.postMessage(sourceDataPivot);

        this.workerPivot.onmessage = ({ data }) => {
          this.store.dispatch(AggregateSalesDataActions.fillInTargetedAudiencePivotData({ payload: { targetedAudiencePivot: data.result } }));
        }



        return [
          AggregateSalesDataActions.fillInTargetedAudiencePivotData({ payload: { targetedAudiencePivot: productPivotDataSource } }),
          AggregateSalesDataActions.fillInTargetedAudienceDataState({ payload: { targetedAudienceDataState: productDataSource } })
        ]
      })
    )
  });

  generatePivotData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        ...[
          BusinessPlanItemActions.loadSuccess,
          BusinessPlanSettingsActions.update,
          SeasonalityActions.updateStateSucceeded,
          AccelerationActions.updateStateSucceeded,
        ]
      ),
      concatLatestFrom(() => [
        this.store.select(Selectors.selectBusinessPlanSettingsState),
        this.store.select(Selectors.selectVisitorsCustomersState),
        this.store.select(Selectors.selectProductsSeasonalityState),
        this.store.select(Selectors.selectAccelerationState),
        this.store.select(Selectors.selectPortfolioState),
      ]),
      switchMap(
        ([
          action,
          settings,
          visitorsCustomers,
          seasonality,
          acceleration,
          portfolio,
        ]) => {
          const calculateAmount = (setting: { peopleAmount: number, seasonality: number, accelerationTrend: number }) => {
            return setting.peopleAmount * setting.seasonality * setting.accelerationTrend;
          };

          const accelerationTrendData = acceleration.acceleration.trendData;
          if (!accelerationTrendData.length) return EMPTY;
          const visitors = visitorsCustomers.aboutVisitorsCustomers.totalMonthlyVisitors;
          const portfolioCustomers = [portfolio.productsTotal, ...portfolio.productsServices];
          const portfolioCustomersTotalProduct = [portfolio.productsTotal];
          const seasonalityForTotalProduct = seasonality.filter((product) => product.productId === 0);

          const startPeriod = settings.businessplanSettings.startPeriod;
          const endPeriod = settings.businessplanSettings.endPeriod;
          const dateList = generateListOfMonths(new Date(startPeriod), new Date(endPeriod));


          const customersDataSource = generateDataSource({
            products: portfolioCustomers,
            seasonality,
            dateList,
            accelerationData: accelerationTrendData,
            calculate: calculateAmount,
            pnlrow:'Monthly Customers',
          });
          const visitorsDataSource = generateDataSource({
            products: portfolioCustomers,
            seasonality,
            dateList,
            accelerationData: accelerationTrendData,
            calculate: calculateAmount,
            peopleAmount: visitors,
            pnlrow: 'Monthly Visitors'
          });

          const customersPivotDataSource = generateDataPivot({
            products: portfolioCustomersTotalProduct,
            seasonality: seasonalityForTotalProduct,
            dateList,
            accelerationData: accelerationTrendData,
            calculate: calculateAmount
          });
          const visitorsPivotDataSource = generateDataPivot({
            products: portfolioCustomersTotalProduct,
            seasonality: seasonalityForTotalProduct,
            dateList,
            accelerationData: accelerationTrendData,
            calculate: calculateAmount,
            peopleAmount: visitors
          });


          const actionsToDispatch = [];
          if (visitorsPivotDataSource.length > 0) {
            actionsToDispatch.push(
              AggregateSalesDataActions.fillInVisitorsPivotData({ payload: { visitorsPivot: visitorsPivotDataSource } }),
              AggregateSalesDataActions.fillInVisitorsDataState({ payload: { visitorsDataState: visitorsDataSource } })
            );
          }
          if (customersPivotDataSource.length > 0) {
            actionsToDispatch.push(
              AggregateSalesDataActions.fillInCustomersPivotData({ payload: { customersPivot: customersPivotDataSource } }),
              AggregateSalesDataActions.fillInCustomersDataState({ payload: { customersDataState: customersDataSource } }),

              AggregateSalesDataActions.updateCustomerDataSucceeded()
            );
          }

          return actionsToDispatch;
        }
      )
    );
  });

}


export const generateListOfMonths = (startPeriod: Date, endPeriod: Date) => {
  let startYear = startPeriod.getFullYear();
  let startMonth = startPeriod.getMonth() ;
  let endYear = endPeriod.getFullYear();
  let endMonth = endPeriod.getMonth() + 1;

  let months = (endYear - startYear) * 12 + (endMonth - startMonth);
  return Array.from({ length: months }, (_, i) => 
    new Date(Date.UTC(startYear, startMonth + i)).toISOString().slice(0, 7)
  );
}


const generateDataSource = (
  settings: {
    products: ProductsService[],
    seasonality: ProductSeasonality[],
    dateList: string[],
    accelerationData: number[],
    calculate: (
      setting: { peopleAmount: number, seasonality: number, accelerationTrend: number }) => number,
    peopleAmount?: number,
    pnlrow?:string,
  }

): Pnldata[] => {


  const aggregatedDataSource = [];
  const productsMappedByIds = new Map(settings.products.map((product) => [product.id, product]));

  settings.seasonality.forEach((productItem, index) => {
    if (!productsMappedByIds.has(productItem.productId)) return;

    const seasonalityIndex = productItem.seasonalityIndex;
    if (!seasonalityIndex) {
      return;
    }
    const productCustomers = settings.peopleAmount ? settings.peopleAmount : productsMappedByIds.get(productItem.productId).customers;

    const data = [];
    settings.dateList.forEach((date, index) => {
      const month = new Date(date).getUTCMonth();
      data.push({
        pnlrow:settings.pnlrow,
        itemcode: productItem.productId.toString(),
        description: productItem.name,
        itemname: productItem.name,
        factdate: date + '-01T00:00:00Z',
        currency: 'QTY',
        factvalue: settings.calculate({
          peopleAmount: productCustomers,
          seasonality: seasonalityIndex[month],
          accelerationTrend: settings.accelerationData[index]
        }),
      });
    });
    aggregatedDataSource.push(...data);

  });

  return aggregatedDataSource;
}

const generateDataPivot = (
  settings: {
    products: ProductsService[],
    seasonality: ProductSeasonality[],
    dateList: string[],
    accelerationData: number[],
    calculate: (
      setting: { peopleAmount: number, seasonality: number, accelerationTrend: number }) => number,
    peopleAmount?: number,
  }
): TargetedAudiencePivot[] => {


  const aggregatedDataSource = [];
  const productsMappedByIds = new Map(settings.products.map((product) => [product.id, product]));

  settings.seasonality.forEach((productItem, index) => {
    if (!productsMappedByIds.has(productItem.productId)) return;

    const seasonalityIndex = productItem.seasonalityIndex;
    if (!seasonalityIndex) {
      return;
    }
    const productCustomers = settings.peopleAmount ? settings.peopleAmount : productsMappedByIds.get(productItem.productId).customers;

    const data = [];
    settings.dateList.forEach((date, index) => {
      const month = new Date(date).getUTCMonth();
      data.push({
        title: productItem.name,
        date: date,
        year: new Date(date).getUTCFullYear(),
        amount: settings.calculate({
          peopleAmount: productCustomers,
          seasonality: seasonalityIndex[month],
          accelerationTrend: settings.accelerationData[index]
        }),
      });
    });
    aggregatedDataSource.push(...data);

  });

  return aggregatedDataSource;
}
