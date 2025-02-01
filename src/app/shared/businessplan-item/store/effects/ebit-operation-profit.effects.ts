import {Injectable} from "@angular/core";
import {Actions, concatLatestFrom, createEffect, ofType} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import {switchMap} from "rxjs";

import {
    EbitOperatingProfitActions,
    GrossMarginActions,
    HeadcountAndPayrollActions,
    MarketingActions,
    OpexActions,
    RnDActions,
    OtherOperatingIncomeLossActions,
    Selectors,
    InvestmentAndCapexActions} from "..";
import {HeadcountAndPayrollPivotCell} from "../../typings";
import {IEbitOperatingProfitPivot} from "../reducers/ebit-operating-profit.reducer";
import {mappedDataForPivot, transformMappedDataForPivot} from "../../businessplan-item.functions";
import {Pnldata} from "@app/shared/sdk";
import {iMarketing} from "@businessplan-item/store/reducers/marketing.reducer";

const HEADCOUNT_EXPENSES_TITLE = "Headcount Expenses";
const OPERATING_EXPENSES_TITLE = "Operating Expenses";
const ASSETS_AMORTIZATION_TITLE = "Assets Depreciation and Ammortisation";
const OTHER_OPERATING_INCOME_LOSS_TITLE = "Other Operating Income Loss";
const MARKETING_TITLE = "Marketing";
const RND_TITLE = "RnD";
@Injectable()
export class EbitOperatingProfitEffects {
    constructor(private actions$: Actions, private store: Store){}

    $generateEbitOperatingProfitPivotData = createEffect(() => {
        return this.actions$.pipe(
            ofType(...[GrossMarginActions.fillGrossMarginPivotData, HeadcountAndPayrollActions.updatePivotData, OpexActions.updateAll, InvestmentAndCapexActions.updateInvestmentAndCapexPivotData, RnDActions.updateAll, OtherOperatingIncomeLossActions.updateAll, MarketingActions.updateAll]),
            concatLatestFrom(() => [
                this.store.select(Selectors.selectGrossMarginPivotState),
                this.store.select(Selectors.selectGrossMarginState),
                this.store.select(Selectors.selectHeadcountAndPayroll),
                this.store.select(Selectors.selectOpex),
                this.store.select(Selectors.selectRnD),
                this.store.select(Selectors.selectOtherOperatingIncomeLoss),
                this.store.select(Selectors.selectMarketing),
                this.store.select(Selectors.selectTotalGrossState),
                this.store.select(Selectors.selectInvestmentAndCapexState),
            ]),
            switchMap(([action,
                            grossMarginPivot,
                            grossMargin,
                            headcountAndPayroll,
                            opex,
                            rnd,
                            otherOperatingIncomeLoss,
                            marketing,
                            totalGrossByMonth,
                            investmentAndCapex]) => {

                let headcountExpenses: Pnldata[] = [];
                let headcountNumber: Pnldata[] = [];
                let assetsAmortization: Pnldata[] = []

                Object.values(headcountAndPayroll.pivotData).forEach((pivotTable: HeadcountAndPayrollPivotCell[]) =>{
                    pivotTable.forEach((item) => {

                        if (item.pnlRow == 'Headcount Expenses'){
                            headcountExpenses.push({
                                itemname: item.key,
                                pnlrow: HEADCOUNT_EXPENSES_TITLE,
                                description: item.key,
                                factdate: item.month + '-01T00:00:00Z',
                                factvalue: item.value
                            })
                        }
                        if (item.pnlRow == 'Headcount Number') {
                            headcountNumber.push({
                                itemname: item.key,
                                pnlrow: item.pnlRow,
                                description: item.key,
                                factdate: item.month + '-01T00:00:00Z',
                                factvalue: item.value
                            })
                        }
                    })
                })

                let opexPnl = [];
                Object.entries(totalGrossByMonth).forEach(([date, amount], index) => {
                    opex.forEach((opexItem) => {
                        const opexFormula = -(Number(amount) * opexItem.percentage + opexItem.staticMonthlyNumber)
                        let amountValue = 0;
                        if (opexItem.startMonth <= index + 1 && opexItem.endMonth >= index + 1) {
                            amountValue = opexFormula;
                        }
                        opexPnl.push({
                            itemname: opexItem.description,
                            pnlrow: opexItem.pnlRow,
                            description: opexItem.description,
                            factdate: date,
                            factvalue: amountValue
                        });
                    });
                });

                assetsAmortization = investmentAndCapex.pivotData.assetsDepriciationPivotData.map((amortization) => ({
                    itemname: amortization.key,
                    pnlrow: ASSETS_AMORTIZATION_TITLE,
                    description: amortization.key,
                    factdate: amortization.date + '-01T00:00:00Z',
                    factvalue: amortization.value,
                }));

                let marketingPnl = [];
                Object.entries(totalGrossByMonth).forEach(([date, amount], index) => {
                    marketing.forEach((marketingItem:iMarketing) => {
                        const marketingFormula = -(Number(amount) * marketingItem.percentage + marketingItem.staticMonthlyNumber)
                        let amountValue = 0;
                        if (marketingItem.startMonth <= index + 1 && marketingItem.endMonth >= index + 1) {
                            amountValue = marketingFormula;
                        }
                        marketingPnl.push({
                            itemname: marketingItem.description,
                            pnlrow: marketingItem.pnlRow,
                            description: marketingItem.description,
                            factdate: date,
                            factvalue: amountValue
                        });
                    });
                });

                let otherOperatingIncomeLossPnl = [];
                Object.entries(totalGrossByMonth).forEach(([date, amount], index) => {
                    otherOperatingIncomeLoss.forEach((operatingIncomeLossItem) => {
                        const OperatingIncomeLossFormula = -(Number(amount) * operatingIncomeLossItem.percentage + operatingIncomeLossItem.staticMonthlyNumber)
                        let amountValue = 0;
                        if (operatingIncomeLossItem.startMonth <= index + 1 && operatingIncomeLossItem.endMonth >= index + 1) {
                            amountValue = OperatingIncomeLossFormula;
                        }
                        otherOperatingIncomeLossPnl.push({
                            itemname: operatingIncomeLossItem.description,
                            pnlrow: operatingIncomeLossItem.pnlRow,
                            description: operatingIncomeLossItem.description,
                            factdate: date,
                            factvalue: amountValue
                        });
                    });
                });

                let rndPnl = [];
                Object.entries(totalGrossByMonth).forEach(([date, amount], index) => {
                    rnd.forEach((rndItem) => {
                        const rndFormula = -(Number(amount) * rndItem.percentage + rndItem.staticMonthlyNumber)
                        let amountValue = 0;
                        if (rndItem.startMonth <= index + 1 && rndItem.endMonth >= index + 1) {
                            amountValue = rndFormula;
                        }
                        rndPnl.push({
                            itemname: rndItem.description,
                            pnlrow: rndItem.pnlRow,
                            description: rndItem.description,
                            factdate: date,
                            factvalue: amountValue
                        });
                    });
                });

                let pivotData = [...grossMargin as Pnldata[], ...headcountExpenses, ...opexPnl, ...otherOperatingIncomeLossPnl, ...marketingPnl, ...rndPnl, ...assetsAmortization, ...headcountNumber];

                const headcountExpensesMapped = transformMappedDataForPivot(mappedDataForPivot(headcountExpenses, HEADCOUNT_EXPENSES_TITLE))
                const opexMapped = transformMappedDataForPivot(mappedDataForPivot(opexPnl, OPERATING_EXPENSES_TITLE))
                const assetsAmortizationMapped = transformMappedDataForPivot(mappedDataForPivot(assetsAmortization, ASSETS_AMORTIZATION_TITLE))
                const otherOperatingIncomeLossMapped = transformMappedDataForPivot(mappedDataForPivot(otherOperatingIncomeLossPnl, OTHER_OPERATING_INCOME_LOSS_TITLE))
                const marketingMapped = transformMappedDataForPivot(mappedDataForPivot(marketingPnl, MARKETING_TITLE))
                const rndMapped = transformMappedDataForPivot(mappedDataForPivot(rndPnl, RND_TITLE))

                const pivotDataMapped = [...grossMarginPivot as IEbitOperatingProfitPivot[], ...marketingMapped, ...headcountExpensesMapped, ...opexMapped, ...rndMapped, ...otherOperatingIncomeLossMapped, ...assetsAmortizationMapped, ]
                return [
                    EbitOperatingProfitActions.fillEbitOperatingProfitData({payload: {ebitOperatingProfits: pivotData}}),
                    EbitOperatingProfitActions.fillEbitOperatingProfitPivotData({payload: {ebitOperatingProfitPivot: pivotDataMapped}})
                ]
            })
        )
    })
}
