import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { InvestmentAndCapexActions, PortfolioActions, Selectors } from "..";
import { switchMap } from "rxjs";
import { generateListOfMonths } from "./aggregated-sales-data.effects";
import { InvestmentAndCapexPivotData } from "../reducers/investment-and-capex.reducer";

const ASSETS_AVALIABILITY = 'Assets Avaliability and Renewal'
const MONTHLY_INVESTMENT = 'Montly CAPEX Investment'
const ASSETS_DEPRICATION = 'Assets Depriciation'
const INVENTORY_INCREASE = 'Inventory Increase'

@Injectable()
export class InvestmentAndCapexEffects{

    constructor(private actions$: Actions, private store: Store) { }

    generateInvestmentAndCapexPivotData$ = createEffect(()=>{
        return this.actions$.pipe(
            ofType(...[InvestmentAndCapexActions.updateInvestmentAndCapexTable, InvestmentAndCapexActions.fillInLoadedData, PortfolioActions.update, PortfolioActions.fillInLoadedDataProducts]),
            concatLatestFrom(() => [
                this.store.select(Selectors.selectInvestmentAndCapexState),
                this.store.select(Selectors.selectBusinessPlanSettingsState),
                this.store.select(Selectors.selectPortfolioProductsServicesState),
            ]),
            switchMap(([action, investmentAndCapex, settings, products]) => {
                let pivotData: InvestmentAndCapexPivotData = {
                    assetsAvaliabilityPivotData: [],
                    montlyCapexInvestmentPivotData: [],
                    assetsDepriciationPivotData: [],
                    inventoryIncreasePivotData: [],
                }

                const dateList = generateListOfMonths(new Date(settings.businessplanSettings.startPeriod), new Date(settings.businessplanSettings.endPeriod))                

                dateList.forEach((date, j) => {
                    j++;
                    products?.forEach((product) => {
                        let initialStockCost = -product.totalUnits * product.cost * product.numberOfMonthsForInitialStock;
                        let keys = {
                            date: date,
                            year: new Date(date).getUTCFullYear(),
                            key: "Initial Stock for " + product.name,
                        };
                        pivotData.assetsAvaliabilityPivotData.push({
                            ...keys,
                            value: this.calculateAvaliabilityPivotData(j, product.beginningMonths, product.endingMonth, product.endingMonth, product.ammortizationApplied),
                        });
                        pivotData.montlyCapexInvestmentPivotData.push({
                            ...keys,
                            value: ((pivotData.assetsAvaliabilityPivotData.slice(-1)[0].value == 1 && product.ammortizationApplied) || j == 1) ? initialStockCost : 0
                        })
                        pivotData.assetsDepriciationPivotData.push({
                            ...keys,
                            value: ((j <= product.endingMonth) && product.ammortizationApplied) ? initialStockCost / product.endingMonth : 0
                        })
                        pivotData.inventoryIncreasePivotData.push({
                            ...keys,
                            value: -pivotData.assetsDepriciationPivotData.slice(-1)[0].value,
                        })
                    })
                    investmentAndCapex.tableData?.forEach((investment) => {
                        let keys = {
                            date: date,
                            year: new Date(date).getUTCFullYear(),
                            key: investment.description,
                        };
                        pivotData.assetsAvaliabilityPivotData.push({
                            ...keys,
                            value: this.calculateAvaliabilityPivotData(j, investment.startMonth, investment.endMonth, investment.depreciationMonths, investment.ammortizationApplied),
                        });
                        let monthlyCapexValue = 0 ;
                        if (investment.ammortizationApplied ||  j == 1){
                            monthlyCapexValue = pivotData.assetsAvaliabilityPivotData.slice(-1)[0].value == 1 ? -investment.totalValuePrice : 0
                        }
                        pivotData.montlyCapexInvestmentPivotData.push({
                            ...keys,
                            value: monthlyCapexValue
                        })
                        pivotData.assetsDepriciationPivotData.push({
                            ...keys,
                            value: ((j >= investment.startMonth) && (j <= investment.endMonth)) && investment.ammortizationApplied ? -investment.totalValuePrice / investment.depreciationMonths : 0
                        })
                        pivotData.inventoryIncreasePivotData.push({
                            ...keys,
                            value: -pivotData.montlyCapexInvestmentPivotData.slice(-1)[0].value
                        })
                    })

                })
                
                return [ InvestmentAndCapexActions.updateInvestmentAndCapexPivotData({payload: {pivotData: pivotData}})]
            })
        )
    })

    generateInvestmentAndCapexExportData$ = createEffect(()=>{
        return this.actions$.pipe(
            ofType(...[InvestmentAndCapexActions.updateInvestmentAndCapexPivotData]),
            concatLatestFrom(() => [
                this.store.select(Selectors.selectInvestmentAndCapexState),
            ]),
            switchMap(([action, investmentAndCapex]) => {
                
                let assetsAvaliabilityPivotData = [];
                let inventoryIncreasePivotData =  [];

                assetsAvaliabilityPivotData = investmentAndCapex.pivotData.assetsAvaliabilityPivotData.map((avaliability) => ({
                    itemname: avaliability.key,
                    pnlrow: ASSETS_AVALIABILITY,
                    description: avaliability.key,
                    factdate: avaliability.date + '-01T00:00:00Z',
                    factvalue: avaliability.value
                }))

                inventoryIncreasePivotData = investmentAndCapex.pivotData.inventoryIncreasePivotData.map((inventory) => ({
                    itemname: inventory.key,
                    pnlrow: INVENTORY_INCREASE,
                    description: inventory.key,
                    factdate: inventory.date + '-01T00:00:00Z',
                    factvalue: inventory.value
                }))

                let exportResult = [...assetsAvaliabilityPivotData, ...inventoryIncreasePivotData]
                
                return [ InvestmentAndCapexActions.updateInvestmentAndCapexPnlData({payload: {exportData: exportResult}})]
            })
        )
    })

    calculateAvaliabilityPivotData(currentDate: number, startMonth: number, endMonth: number, depreciationMonths: number, ammortizationApplied: boolean): number {
        if(!ammortizationApplied) return 1;
        if ((currentDate >= startMonth) && (currentDate <= endMonth)) {
            let monthesFromPurchase = (currentDate - startMonth) % depreciationMonths;
            return 1 - monthesFromPurchase / depreciationMonths;
        }
        else return 0;
        
    }



}