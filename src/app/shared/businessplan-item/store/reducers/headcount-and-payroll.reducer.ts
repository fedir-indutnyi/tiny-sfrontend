import { createReducer, on, props, Action } from "@ngrx/store";
import { HeadcountAndPayrollActions } from "@businessplan-item/store/index"
import { InitialState } from "../initial-store";
import { HeadcountAndPayroll, HeadcountAndPayrollPivotData} from "../../typings/businessplan-data-model.interface";

export interface State {
    tableData: HeadcountAndPayroll,
    pivotData: HeadcountAndPayrollPivotData,
}

export const initialState: State = {...InitialState.headcountAndPayroll};

const HeadcountAndPayrollReducer = createReducer(
    initialState,
    on(HeadcountAndPayrollActions.init, (state) => initialState),
    on(HeadcountAndPayrollActions.fillInLoadedData, (state, props) => ({...state, ...props.payload})),
    on(HeadcountAndPayrollActions.updateHeadcount, (state, props) => ({...state, tableData: { headcount: props.payload.headcount, payroll: state.tableData.payroll}})),
    on(HeadcountAndPayrollActions.updatePayroll, (state, props) => ({...state, tableData: { headcount: state.tableData.headcount, payroll: props.payload.payroll}})),
    on(HeadcountAndPayrollActions.updatePivotData, (state, props) => ({...state, pivotData: {...state.pivotData, ...props.payload.pivotData}})),
)

export function reducer(state: State | undefined, action: Action){
    return HeadcountAndPayrollReducer(state, action);
}