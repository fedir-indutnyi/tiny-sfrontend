import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { AdvancedInflationSettingsActions, BusinessPlanSettingsActions, HeadcountAndPayrollActions, Selectors } from "..";
import { switchMap } from "rxjs";
import { HeadcountAndPayrollPivotData } from "../../typings";
import { generateListOfMonths } from "./aggregated-sales-data.effects";

const HEADCOUNT_NUMBER= 'Headcount Number'

@Injectable()

export class HeadcountAndPayrollEffects{

    constructor(private actions$: Actions, private store: Store) { }

    generateHeadcountAndPayrollPivotData$ = createEffect(()=>{
        return this.actions$.pipe(
            ofType(...[HeadcountAndPayrollActions.updateHeadcount, HeadcountAndPayrollActions.fillInLoadedData, AdvancedInflationSettingsActions.updateInflationMultipliers]),
            concatLatestFrom(() => [
                this.store.select(Selectors.selectHeadcountAndPayroll),
                this.store.select(Selectors.selectBusinessPlanSettingsState),
                this.store.select(Selectors.selectAdvancedInflationSettingsState)
            ]),
            switchMap(([action, headcountAndPayroll, settings, advancedInflation]) => {
                let pivotData: HeadcountAndPayrollPivotData = {
                    numberOfEmployees: [],
                    headcountExpenses: [],
                    recruitmentCost: [],
                    salaryTax: [],
                    extraPayments: [],
                }

                const dateList = generateListOfMonths(new Date(settings.businessplanSettings.startPeriod), new Date(settings.businessplanSettings.endPeriod))

                headcountAndPayroll.tableData.headcount.forEach((employee) => {
                    dateList.forEach((date, j) => {
                        var inflation = advancedInflation.advancedInflationSettings.yearlyValues[Math.floor(j/12)]?.yearlyInflationRate ?? 0;
                        var salary = advancedInflation.advancedInflationSettings.yearlyValues[Math.floor(j/12)]?.yearlySalaryIncrease ?? 0;

                        let keys = {
                            month: date,
                            year: new Date(date).getUTCFullYear(),
                            pnlRow: employee.salaryPlnRow,
                            key: employee.jobTitle,
                        };
                        pivotData.numberOfEmployees.push({
                            ...keys,
                            pnlRow: HEADCOUNT_NUMBER,
                            pivotDescription: 'Headcount Number',
                            value: ((employee.beginningMonth <= j) && (j <= employee.endingMonth)) ?
                                employee.numOfPeople : 0
                        });
                        pivotData.headcountExpenses.push({
                            ...keys,
                            pivotDescription: 'Net Salary',
                            value: -(employee.netSalary * pivotData.numberOfEmployees.at(-1).value * (1 + salary))
                        })
                        pivotData.recruitmentCost.push({
                            ...keys,
                            pivotDescription: 'Recruitment',
                            value: (j >= employee.beginningMonth) ?
                                -(Number((employee.recruitmentCost / employee.monthOfService).toFixed(2)) * employee.numOfPeople * (1 + inflation)) : 0
                        })
                        pivotData.salaryTax.push({
                            ...keys,
                            pivotDescription: 'Tax',
                            value: (pivotData.headcountExpenses.at(-1).value / ( 1 - employee.salaryTax) - pivotData.headcountExpenses.at(-1).value)
                        })
                        pivotData.extraPayments.push({
                            ...keys,
                            pivotDescription: 'Extra Spent',
                            value: (pivotData.headcountExpenses.at(-1).value / ( 1 - employee.extraPayments) - pivotData.headcountExpenses.at(-1).value)
                        })
                    })

                })
                return [ HeadcountAndPayrollActions.updatePivotData({payload: {pivotData: pivotData}})]
            })
        )
    })

    generateOtherExpensesPivotData$ = createEffect(()=>{
        return this.actions$.pipe(
            ofType(...[ HeadcountAndPayrollActions.updatePayroll, HeadcountAndPayrollActions.fillInLoadedData, BusinessPlanSettingsActions.updatePeriods, AdvancedInflationSettingsActions.updateYearlyValues]),
            concatLatestFrom(() => [
                this.store.select(Selectors.selectHeadcountAndPayroll),
                this.store.select(Selectors.selectBusinessPlanSettingsState),
                this.store.select(Selectors.selectAdvancedInflationSettingsState)

            ]),
            switchMap(([action, headcountAndPayroll, settings, advancedInflation]) => {
                let otherHeadcountCost = [];

                const dateList = generateListOfMonths(new Date(settings.businessplanSettings.startPeriod), new Date(settings.businessplanSettings.endPeriod))

                dateList.forEach((date, i) => {
                    var numberOfEmployees = 0;

                    headcountAndPayroll.tableData.headcount.forEach((employee) => {
                         if ((employee.beginningMonth < i) && (i < employee.endingMonth))
                             numberOfEmployees += employee.numOfPeople
                    })

                    headcountAndPayroll.tableData.payroll.forEach((payroll)=>{
                        let inflation = advancedInflation.advancedInflationSettings.yearlyValues[Math.floor(i/12)]?.yearlyInflationRate ?? 0 ;
                        otherHeadcountCost.push({
                            pivotDescription: 'Other Headcount Cost',
                            pnlRow: payroll.plnRow,
                            month: date,
                            year: new Date(date).getUTCFullYear(),
                            key: payroll.description,
                            value: -((payroll.monthlyPricePerEmployee * numberOfEmployees + payroll.staticMonthlyNumber ) * (1 + inflation))
                        })
                    })
                })

                return [ HeadcountAndPayrollActions.updatePivotData({payload: {pivotData: {otherHeadcountCost}}})]
            })
        )
    })
}
