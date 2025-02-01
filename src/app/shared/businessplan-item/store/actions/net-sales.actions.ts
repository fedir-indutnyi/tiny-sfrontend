import { createAction, props } from "@ngrx/store";
import { iNetSalesPivot } from "../reducers/net-sales.reducer";
import { Pnldata } from "@app/shared/sdk";
import {NetSales} from "@businessplan-item/typings";

export const init = createAction('[NetSales] init');
export const fillNetSalesPivotData = createAction('[NetSales] Fill in net sales pivot data', props<{ payload: { netSalesPivot: iNetSalesPivot[] } }>());

export const fillNetSalesData = createAction('[NetSales] Fill in net sales data', props<{ payload: { netSales: Pnldata[] } }>());

export const fillTotalGrossByMonth = createAction('[NetSales] Fill in total gross by month', props<{ payload: { totalGrossByMonth: {} } }>());
export const fillInLoadedData = createAction('[NetSales] Fill in loaded data', props<{ payload: NetSales }>());

export const updateNetSalesSettings = createAction(
    '[Net Sales] Update Settings',
    props<{monthsShift: number}>()
  );
