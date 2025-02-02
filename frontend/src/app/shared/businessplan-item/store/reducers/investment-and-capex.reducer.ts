import { PivotCell } from "@app/shared/sdk/model/pivotCell";
import { InitialState } from "../initial-store";
import { Action, createReducer, on } from "@ngrx/store";
import { InvestmentAndCapexActions } from "..";
import { Pnldata } from "@app/shared/sdk";

export interface State {
    tableData: InvestmentAndCapex[],
    pivotData: InvestmentAndCapexPivotData,
    exportData: Pnldata[]
}

export interface InvestmentAndCapexPivotData {
    assetsAvaliabilityPivotData: PivotCell[],
    montlyCapexInvestmentPivotData: PivotCell[],
    assetsDepriciationPivotData: PivotCell[],
    inventoryIncreasePivotData: PivotCell[],
}

export interface InvestmentAndCapexData {
    assetsAvaliabilityPivotData: Pnldata[],
    inventoryIncreasePivotData: Pnldata[],
}

export interface InvestmentAndCapex {
    category: string;
    pnlRow: string;
    description: string;
    totalValuePrice: number;
    ammortizationApplied: boolean;
    depreciationMonths: number
    vendor: string;
    startMonth: number;
    endMonth: number;
    comments: string;
}

export const initialState: State = {...InitialState.investmentAndCapex};

const HeadcountAndPayrollReducer = createReducer(
    initialState,
    on(InvestmentAndCapexActions.init, (state) => initialState),
    on(InvestmentAndCapexActions.fillInLoadedData, (state, props) => ({...state, ...props.payload})),
    on(InvestmentAndCapexActions.updateInvestmentAndCapexTable, (state, props) => ({...state, tableData: props.payload.tableData})),
    on(InvestmentAndCapexActions.updateInvestmentAndCapexPivotData, (state, props) => ({...state, pivotData: {...state.pivotData, ...props.payload.pivotData}})),
    on(InvestmentAndCapexActions.updateInvestmentAndCapexPnlData, (state, props) => ({...state, exportData: props.payload.exportData})),
    
)

export function reducer(state: State | undefined, action: Action){
    return HeadcountAndPayrollReducer(state, action);
}