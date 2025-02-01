import { createAction, props } from "@ngrx/store";
import { InvestmentAndCapex, InvestmentAndCapexData, InvestmentAndCapexPivotData } from "../reducers/investment-and-capex.reducer";
import { Pnldata } from "@app/shared/sdk";

export const init = createAction('[Investment And Capex] Init');
export const fillInLoadedData = createAction('[Investment And Capex] fill in loaded data', props<{payload: {
    tableData: InvestmentAndCapex[]
    }}>());
export const updateInvestmentAndCapexTable = createAction('[Investment And Capex] update Investment And Capex table', props<{
    payload:{
        tableData: InvestmentAndCapex[]
    }}>());

export const updateInvestmentAndCapexPivotData = createAction('[Investment And Capex] update Pivot Data', props<{
    payload:{
         pivotData: InvestmentAndCapexPivotData
    }}>());

export const updateInvestmentAndCapexPnlData = createAction('[Investment And Capex] update Data', props<{
    payload:{
         exportData: Pnldata[]
    }}>());