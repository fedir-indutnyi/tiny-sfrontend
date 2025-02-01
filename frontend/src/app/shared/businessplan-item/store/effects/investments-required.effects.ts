import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { EbitOperatingProfitActions, InvestmentAndCapexActions, InvestmentsRequiredActions, Selectors } from "..";
import { EMPTY, switchMap } from "rxjs";
import { PivotCell } from "@app/shared/sdk/model/pivotCell";
import { mappedDataForPivot, transformMappedDataForPivot } from "../../businessplan-item.functions";

const EBIDTA = 'Negative EBIDTA';
const STOCK = 'Stock and Materials Acquisition Total';
const INVESTMENT = 'Fixed Assets Acquisition (Capital Investment), Equipment Total';
const SAFETY_PILLOW = 'Safety Pillow for Investments';
@Injectable()
export class InvestmentsRequiredEffects{

    constructor(private actions$: Actions, private store: Store) { }

    generateInvestmentsRequiredPivotData$ = createEffect(()=>{
        return this.actions$.pipe(
            ofType(...[EbitOperatingProfitActions.fillEbitOperatingProfitPivotData, InvestmentAndCapexActions.updateInvestmentAndCapexPivotData, InvestmentsRequiredActions.updateInvestmentsRequiredTable, InvestmentsRequiredActions.fillInLoadedData]),
            concatLatestFrom(() => [
                this.store.select(Selectors.selectEbitOperatingProfitPivotState),
                this.store.select(Selectors.selectInvestmentAndCapexState),
                this.store.select(Selectors.selectSafetyPillowState),
            ]),
            switchMap(([action, ebit, investmentAndCapex, safetyPillow]) => {
                if (!ebit.length || !investmentAndCapex) return EMPTY
                let ebitSource = ebit.filter((ebit) => ebit.title != 'Assets Depreciation and Ammortisation')
                .map((ebitCell) => ({
                    itemname: ebitCell.title,
                    pnlrow: EBIDTA,
                    description: ebitCell.title,
                    factdate: ebitCell.date ,
                    factvalue: ebitCell.amount,
                }));
                let ebidta = transformMappedDataForPivot(mappedDataForPivot(ebitSource, EBIDTA))
                .map((ebitCell) => {
                    if (ebitCell.amount < 0)
                        return {
                            itemname: ebitCell.title,
                            pnlrow: EBIDTA,
                            description: ebitCell.key,
                            factdate: ebitCell.date + '-01T00:00:00Z',
                            factvalue: ebitCell.amount,
                        }
                    else return {
                        itemname: ebitCell.title,
                        pnlrow: EBIDTA,
                        description: ebitCell.key,
                        factdate: ebitCell.date + '-01T00:00:00Z',
                        factvalue: 0,
                    }
                });
                let stocks = investmentAndCapex.pivotData.montlyCapexInvestmentPivotData.filter((stock) => 
                    stock.key.includes('Initial Stock for ')
                ).map((stock, index) => (this.convertFromPivotToPnlData(stock, STOCK)));

                let investments = investmentAndCapex.pivotData.montlyCapexInvestmentPivotData.filter((stock) => 
                    !stock.key.includes('Initial Stock for ')
                ).map((investment) => (this.convertFromPivotToPnlData(investment, INVESTMENT)));

                const ebidtaMapped = transformMappedDataForPivot(mappedDataForPivot(ebidta, EBIDTA))
                const stocksMapped = transformMappedDataForPivot(mappedDataForPivot(stocks, STOCK))
                const investmentsMapped = transformMappedDataForPivot(mappedDataForPivot(investments, INVESTMENT))

                let investmentNeededWithoutSafetyPillow = [...stocks, ...investments, ...ebidta];
                const safetyPillowMapped = transformMappedDataForPivot(
                    mappedDataForPivot(investmentNeededWithoutSafetyPillow, SAFETY_PILLOW)).map((safetyPillowCell) => ({
                        ...safetyPillowCell, amount:safetyPillowCell.amount*safetyPillow 
                    }));
                const safetyPillows = safetyPillowMapped.map((safetyPillowCell) => ({
                    itemname: safetyPillowCell.title,
                    pnlrow: SAFETY_PILLOW,
                    description: safetyPillowCell.title,
                    factdate: safetyPillowCell.date + '-01T00:00:00Z',
                    factvalue: safetyPillowCell.amount, 
                }))

                const pivotData = [...stocks, ...investments, ...ebidta, ...safetyPillows]
                const pivotDataMapped = [...stocksMapped, ...investmentsMapped, ...ebidtaMapped, ...safetyPillowMapped]

                return [ 
                    InvestmentsRequiredActions.updateInvestmentsRequiredExportData({payload: {investmentsRequiredExportData: pivotData}}),
                    InvestmentsRequiredActions.updateInvestmentsRequiredPivotData({payload: {investmentsRequiredPivotData: pivotDataMapped}})
                ]
            })
        )
    })

    convertFromPivotToPnlData(data: PivotCell, PnlRow: string){
        return {
            itemname: data.key,
            pnlrow: PnlRow,
            description: data.key,
            factdate: data.date + '-01T00:00:00Z',
            factvalue: data.value, 
        }
    }

}