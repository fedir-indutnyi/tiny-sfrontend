import { createAction, props } from "@ngrx/store";
import { Headcount, HeadcountAndPayroll, HeadcountAndPayrollPivotCell, HeadcountAndPayrollPivotData, Payroll } from "../../typings";

export const init = createAction('[Headcount And Payroll] Init');
export const fillInLoadedData = createAction('[Headcount And Payroll] fill in loaded data', props<{payload: {
    tableData: HeadcountAndPayroll
    }}>());
export const updateHeadcount = createAction('[Headcount And Payroll] update Headcount', props<{
    payload:{
        headcount: Headcount[]
    }}>());
export const updatePayroll = createAction('[Headcount And Payroll] update Payroll', props<{
    payload:{
        payroll: Payroll[]
    }}>());
export const updatePivotData = createAction('[Headcount And Payroll] update Pivot Data', props<{
    payload:{
         pivotData: {
            numberOfEmployees?: HeadcountAndPayrollPivotCell[],
            headcountExpenses?: HeadcountAndPayrollPivotCell[],
            recruitmentCost?: HeadcountAndPayrollPivotCell[],
            salaryTax?: HeadcountAndPayrollPivotCell[],
            extraPayments?: HeadcountAndPayrollPivotCell[],
            otherHeadcountCost?: HeadcountAndPayrollPivotCell[]
         }
    }}>());
