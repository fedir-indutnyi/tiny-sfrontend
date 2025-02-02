import { Action, createReducer, on } from "@ngrx/store"
import { ExecutionStatusCode } from "../models"
import { EbitOperatingProfitActions } from ".."
import { Pnldata } from "@app/shared/sdk"


export interface IEbitOperatingProfitPivot{
    title: string,
    date: string,
    year: number,
    amount: number,
}

export interface State {
    ebitOperatingProfit: Pnldata[]
    ebitOperatingProfitPivot: IEbitOperatingProfitPivot[]
    executionStatusCode: ExecutionStatusCode
}

export const initialState: State = {
    ebitOperatingProfit: [],
    ebitOperatingProfitPivot: [],
    executionStatusCode: ExecutionStatusCode.INITIAL
}

const EbitOperatingProfitReducer = createReducer(
    initialState,
    on(EbitOperatingProfitActions.Init, (state) => initialState),
    on(EbitOperatingProfitActions.fillEbitOperatingProfitData, (state, { payload }) => ({...state, ebitOperatingProfit: payload.ebitOperatingProfits})),
    on(EbitOperatingProfitActions.fillEbitOperatingProfitPivotData, (state, { payload }) => ({...state, ebitOperatingProfitPivot: payload.ebitOperatingProfitPivot}))
)

export function reducer(state: State | undefined, action: Action){
    return EbitOperatingProfitReducer(state, action)
}