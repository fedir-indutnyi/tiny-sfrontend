import { Action, createReducer, on } from "@ngrx/store";
import { NetSalesActions } from "@businessplan-item/store/index";
import {fillInLoadedData, updateNetSalesSettings} from '../actions/net-sales.actions';
import { Pnldata } from "@app/shared/sdk";


export interface iNetSalesPivot {
  title: string,
  date: string,
  year: number,
  amount: number,
}

export interface State {
  netSales: Pnldata[],
  netSalesPivot: iNetSalesPivot[],
  netSalesPivotOriginal: iNetSalesPivot[],
  totalGrossByMonth: {},
  monthsShift: number;
}

export const initialState: State = {
  netSales: [],
  netSalesPivot: [],
  netSalesPivotOriginal: [],
  totalGrossByMonth: {},
  monthsShift: 0
};

const NetSalesReducer = createReducer(
  initialState,
  on(NetSalesActions.init, (state) => initialState),
  on(NetSalesActions.fillNetSalesData, (state, { payload }) => ({ ...state, netSales: payload.netSales })),
  on(NetSalesActions.fillNetSalesPivotData, (state, { payload }) => ({ ...state, netSalesPivot: payload.netSalesPivot,netSalesPivotOriginal: payload.netSalesPivot })),
  on(NetSalesActions.fillTotalGrossByMonth, (state, { payload }) => ({ ...state, totalGrossByMonth: payload.totalGrossByMonth })),
  on(NetSalesActions.fillInLoadedData, (state, { payload }) => ({ ...state, monthsShift: payload?.monthsShift ?? 0 })),
  on(updateNetSalesSettings, (state, { monthsShift }) => ({ ...state, monthsShift: monthsShift }))
);

export function reducer(state: State | undefined, action: Action) {
  return NetSalesReducer(state, action);
}

// export function netSalesReducer(state, action) {
//   return _netSalesReducer(state, action);
// }
