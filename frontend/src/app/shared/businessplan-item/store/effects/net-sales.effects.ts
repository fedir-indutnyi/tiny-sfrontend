import { Injectable } from "@angular/core";
import { pnlDictionary } from "@businessplan-item/sections/discounts-and-returns/pnl-dictionary";
import { DiscountsAndReturnsActions, NetSalesActions, Selectors, VolumeActions } from "@businessplan-item/store/index";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { EMPTY, switchMap } from "rxjs";
import { iNetSalesPivot } from "../reducers/net-sales.reducer";
import { Pnldata } from "@app/shared/sdk";
import {shiftDate} from "@app/utils/date-utils";

const GROSS_SALE_TITLE = 'Gross Sales';
const RETURN_TITLE = 'Return';
const DISCOUNTS_TITLE = 'Discounts';


@Injectable()
export class NetSalesEffects {

  constructor(private actions$: Actions, private store: Store) { }

  generateNetSalesPivotData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(...[DiscountsAndReturnsActions.updateAll, DiscountsAndReturnsActions.fillInLoadedData, VolumeActions.fillInVolumePivotData,NetSalesActions.updateNetSalesSettings]),
      concatLatestFrom(() => [
        this.store.select(Selectors.selectPricesPivotState),
        this.store.select(Selectors.selectVolumeDataSourceState),
        this.store.select(Selectors.selectPortfolioProductsServicesState),
        this.store.select(Selectors.selectDiscountAndReturnsState),
        this.store.select(Selectors.selectNetSalesMonth),
      ]),
      switchMap(([action, pricesPivotData, volumePivotData, productsPortfolio, discounts,monthShift]) => {
        if (!volumePivotData.length) return EMPTY;
        const netSalesData: Pnldata[] = [];
        const netSalesPivot: iNetSalesPivot[] = [];
        const grossSalesPivot = [];
        const returnsPivot = [];
        const discountsPivot = [];
        const productsMappedByIds = new Map(productsPortfolio.map((product) => [product.id, product]));

        const pricesMappedByIdsAndYears = new Map(pricesPivotData.map((price) => [price.itemcode, new Map()]));
        pricesPivotData.forEach((price) => {
          pricesMappedByIdsAndYears.get(price.itemcode).set(new Date(price.factdate).getFullYear(), price);
        })


        volumePivotData.forEach((volumeItem) => {
          let volumeItemYear = new Date(volumeItem.factdate).getFullYear();
          const productPortfolio = productsMappedByIds.get(+volumeItem.itemcode);
          const priceItemByYear = pricesMappedByIdsAndYears.get(volumeItem.itemcode.toString()).get(volumeItemYear);

          if (!priceItemByYear) return;
          let grossValue = volumeItem.factvalue * priceItemByYear.factvalue;
          grossSalesPivot.push({
            itemcode: volumeItem.itemcode,
            itemname: volumeItem.itemname,
            pnlrow: GROSS_SALE_TITLE,
            description: volumeItem.itemname,
            factdate: volumeItem.factdate,
            factvalue: grossValue,
          });

          returnsPivot.push({
            itemcode: volumeItem.itemcode,
            itemname: volumeItem.itemname,
            pnlrow: RETURN_TITLE,
            description: volumeItem.itemname,
            factdate: volumeItem.factdate,
            factvalue: grossValue * productPortfolio.estimatedFailedOrders * -1,
          });
        })


        let grossSalesTotal = this.getDataSummedByMonth(grossSalesPivot);

        Object.entries(grossSalesTotal).forEach(([date, amount], index) => {
          discounts.forEach((discount) => {

            const discountFormula = -(Number(amount) * discount.percentage + discount.staticMonthlyNumber);
            let amountValue = 0;
            if (discount.startMonth <= index + 1 && discount.endMonth >= index + 1) {
              amountValue = discountFormula;
            }

            discountsPivot.push({
              itemname: discount.description,
              pnlrow: pnlDictionary[discount.pnlRow],
              description: discount.description,
              factdate: date,
              factvalue: amountValue
            });
          });

        });

        grossSalesPivot.forEach((volume) => {
          const date =shiftDate(volume.factdate, monthShift)
          volume.factdate = date.toISOString()
        })
        returnsPivot.forEach((volume) => {
          const date = shiftDate(volume.factdate, monthShift)

          volume.factdate = date.toISOString()
        })

        netSalesData.push(...grossSalesPivot, ...returnsPivot, ...discountsPivot);

        const grossSalesPivotMapped = this.transformMappedData(this.mappedData(grossSalesPivot, GROSS_SALE_TITLE));
        const netSalesPivotMapped = this.transformMappedData(this.mappedData(returnsPivot, RETURN_TITLE));
        const discountsPivotMapped = this.transformMappedData(this.mappedData(discountsPivot, DISCOUNTS_TITLE));

        netSalesPivot.push(...grossSalesPivotMapped, ...netSalesPivotMapped, ...discountsPivotMapped);

        return [
          NetSalesActions.fillTotalGrossByMonth({ payload: { totalGrossByMonth: grossSalesTotal } }),
          NetSalesActions.fillNetSalesData({ payload: { netSales: netSalesData } }),
          NetSalesActions.fillNetSalesPivotData({ payload: { netSalesPivot: netSalesPivot } }),
        ]
      }))
  });

  private mappedData = (data: Pnldata[], title: string) => {
    const dataSummedByDate = this.getDataSummedByMonth(data);
    return {
      [title]: dataSummedByDate
    }
  }

  private transformMappedData = (objData: Pnldata) => {
    let result = [];
    Object.entries(objData).forEach(([title, item]) => {
      Object.entries(item).forEach(([date, amount]) => {
        result.push({
          title: title,
          date: date.substring(0, 7),
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
      let currentAmount = result[item.factdate]
      result[item.factdate] = result[item.factdate] ? currentAmount + item.factvalue : item.factvalue;
    });
    return result;
  }

}
