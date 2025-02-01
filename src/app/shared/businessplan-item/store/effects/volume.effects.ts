import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType, concatLatestFrom } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { EMPTY, switchMap } from "rxjs";
import { AggregateSalesDataActions, BusinessPlanItemActions, PortfolioActions, Selectors, VolumeActions } from "..";
import { Pnldata } from "@app/shared/sdk";

@Injectable()
export class VolumeEffects {

  constructor(private actions$: Actions, private store: Store) { }

  generateVolumePivotData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(...[BusinessPlanItemActions.loadSuccess,
      PortfolioActions.update,
      AggregateSalesDataActions.fillInCustomersDataState]),
      concatLatestFrom(() => [
        this.store.select(Selectors.selectPortfolioState),
        this.store.select(Selectors.selectCustomersDataState),
      ]),

      switchMap(([
        action,
        portfolio,
        customersPivot,
      ]) => {
        if (!(portfolio.productsServices.length && customersPivot.length)) return EMPTY;
        let products = [...portfolio.productsServices];
        const productsMappedByIds = new Map(products.map((product) => [product.id, product]));
        let customersWithoutTotal = customersPivot.filter((customer) => +customer.itemcode!== 0);
        let volumeDataSource: Pnldata[] = customersWithoutTotal.map((customer) => {
          let product = productsMappedByIds.get(+customer.itemcode);
          return {
            pnlrow: 'Monthly Volume',
            itemcode: customer.itemcode,
            itemname: product.name,
            factdate: customer.factdate,
            factvalue: customer.factvalue * product.ordersMonthPerCustomer,
            description: product.name,
            uom:product.UOM.toString() || null
          };
        });

        let volumePivot = this.transformMappedData(this.mappedData(volumeDataSource, 'Total'));


        return [
          VolumeActions.fillInVolumeDataSource({ payload: { volumeDataSource: volumeDataSource } }),
          VolumeActions.fillInVolumePivotData({ payload: { volumePivot: volumePivot } }),
        ]
      })
    )
  });


  private mappedData = (data: Pnldata[], title: string) => {
    const dataSummedByDate = this.getDataSummedByMonth(data);
    return {
      [title]: dataSummedByDate
    }
  }

  private transformMappedData = (objData: { [key: string]: { [key: string]: number } }) => {
    let result = [];
    Object.entries(objData).forEach(([title, item]) => {
      Object.entries(item).forEach(([date, amount]) => {
        result.push({
          title: title,
          date: date,
          year: new Date(date).getFullYear(),
          amount: amount
        })
      })
    })
    return result;
  }


  private getDataSummedByMonth = (dataSource: { factdate?: string, factvalue?: number }[]) => {
    let result = {};

    dataSource.forEach((item) => {
      let year = item.factdate.substring(0, 7);
      let currentAmount = result[year]
      result[year] = result[year] ? currentAmount + item.factvalue : item.factvalue;
    });
    return result;
  }

}
