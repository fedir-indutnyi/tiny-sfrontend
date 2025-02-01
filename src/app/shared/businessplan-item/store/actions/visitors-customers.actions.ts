import { createAction, props } from "@ngrx/store";
import { AboutVisitorsCustomers } from "../../typings";

export const init = createAction('[About Visitors Customers] initial data');
export const fillInLoadedData = createAction('[About Visitors Customers] fill with loaded data', props<{ payload: { aboutVisitorsCustomers: AboutVisitorsCustomers | null } }>());
export const update = createAction('[About Visitors Customers] update data', props<{ payload: { aboutVisitorsCustomers: AboutVisitorsCustomers } }>());
