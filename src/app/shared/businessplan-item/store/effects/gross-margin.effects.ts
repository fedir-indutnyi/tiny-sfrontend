import {Injectable} from "@angular/core";
import {Actions, concatLatestFrom, createEffect, ofType} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import {EMPTY, switchMap} from "rxjs";

import {
    CogsActions,
    GrossMarginActions,
    HeadcountAndPayrollActions,
    NetSalesActions,
    Selectors
} from "@businessplan-item/store/index";
import {HeadcountAndPayrollPivotCell} from "../../typings";
import {mappedDataForPivot, transformMappedDataForPivot} from "../../businessplan-item.functions";
import {Pnldata} from "@shared/sdk";

const COGS_STANDARD_TITLE = 'Standard Cogs';
const COGS_OTHER_TITLE = 'Other Cogs';
const COGS_HEADCOUNT_TITLE = 'Headcount Cogs'

@Injectable()
export class GrossMarginEffects {

    constructor(private actions$: Actions, private store: Store) {};

    generateGrossMarginPivotData$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(...[NetSalesActions.fillNetSalesPivotData, CogsActions.fillInLoadedData, CogsActions.updateAll, HeadcountAndPayrollActions.updatePivotData]),
            concatLatestFrom(() => [
                this.store.select(Selectors.selectCostPricePivotState),
                this.store.select(Selectors.selectVolumeDataSourceState),
                this.store.select(Selectors.selectOtherCogs),
                this.store.select(Selectors.selectNetSalesState),
                this.store.select(Selectors.selectNetSalesPivotState),
                this.store.select(Selectors.selectTotalGrossState),
                this.store.select(Selectors.selectHeadcountAndPayroll)
            ]),
            switchMap(([action,
                           costPricesPivotData,
                           volumePivotData,
                           otherCogsData,
                           selectNetSalesData,
                           netSalesPivotData,
                           totalGrossByMonth,
                           headcount
                       ]) => {
                if (!volumePivotData.length || !costPricesPivotData.length) return EMPTY;
                let standardCogs: Pnldata[] = [];
                let otherCogs: Pnldata[] = [];
                let headcountCogs: Pnldata[] = [];


                const costsMappedByIdsAndYears = new Map(costPricesPivotData.map((cost) => [cost.itemcode, new Map()]));
                costPricesPivotData.forEach((cost) => {
                    costsMappedByIdsAndYears.get(cost.itemcode).set(cost.factdate.substring(0, 4), cost);
                });

                volumePivotData.forEach((volumeItem) => {
                    let volumeItemYear = new Date(volumeItem.factdate).getFullYear();

                    const costPriceItemByYear = costsMappedByIdsAndYears.get(volumeItem.itemcode.toString()).get(volumeItemYear.toString());

                    if (!costPriceItemByYear) return;
                    let grossValue = volumeItem.factvalue * costPriceItemByYear.factvalue;
                    standardCogs.push({
                        itemcode: volumeItem.itemcode,
                        itemname: volumeItem.itemname,
                        pnlrow: COGS_STANDARD_TITLE,
                        factdate: volumeItem.factdate,
                        factvalue: -grossValue,
                        description: volumeItem.itemname,
                    });
                });

                Object.entries(totalGrossByMonth).forEach(([date, amount], index) => {
                    otherCogsData.forEach((otherCogsItem) => {

                        const otherCogsFormula = -(Number(amount) * otherCogsItem.percentage + otherCogsItem.staticMonthlyNumber)
                        let amountValue = 0;
                        if (otherCogsItem.startMonth <= index + 1 && otherCogsItem.endMonth >= index + 1) {
                            amountValue = otherCogsFormula;
                        }

                        otherCogs.push({
                            itemname: otherCogsItem.description,
                            pnlrow: COGS_OTHER_TITLE,
                            description: otherCogsItem.description,
                            factdate: date,
                            factvalue: amountValue
                        });
                    });
                });

                Object.values(headcount.pivotData).forEach((pivot: HeadcountAndPayrollPivotCell[]) => {
                    pivot.forEach(headcountCog => {
                        if (headcountCog.pnlRow == 'Headcount Cogs') {
                            headcountCogs.push({
                                itemname: headcountCog.key,
                                pnlrow: COGS_HEADCOUNT_TITLE,
                                description: headcountCog.key,
                                factdate: headcountCog.month + '-01T00:00:00Z',
                                factvalue: headcountCog.value
                            })
                        }
                    });
                });

                let pivotData = [...selectNetSalesData, ...standardCogs, ...otherCogs, ...headcountCogs];


                const standardCogsMapped = transformMappedDataForPivot(mappedDataForPivot(standardCogs, COGS_STANDARD_TITLE));
                const otherCogsMapped = transformMappedDataForPivot(mappedDataForPivot(otherCogs, COGS_OTHER_TITLE));
                const headcountCogsMapped = transformMappedDataForPivot(mappedDataForPivot(headcountCogs, COGS_HEADCOUNT_TITLE))

                const pivotDataMapped = [...netSalesPivotData, ...standardCogsMapped, ...otherCogsMapped, ...headcountCogsMapped];

                return [
                    GrossMarginActions.fillGrossMarginData({payload: {grossMargin: pivotData}}),
                    GrossMarginActions.fillGrossMarginPivotData({payload: {grossMarginPivot: pivotDataMapped}}),
                ];

            }));
    });
}
