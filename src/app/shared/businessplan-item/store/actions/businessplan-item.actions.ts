import { createAction, props } from "@ngrx/store";
import { IBusinessplanRootObject } from "../../typings";
// refactor all action to accept props with payload object and error if needed
export const init = createAction('[Business Plan Item] load init data');
export const load = createAction('[Business Plan Item] load initial data by postId', props<{ payload: { postId: number, postName?: string, localDraft:IBusinessplanRootObject|null } }>());
export const loadDataDone = createAction('[Business Plan Item] load initial data for PostId Done', props<{ payload: { businessPlanItem: IBusinessplanRootObject } }>());
export const loadSuccess = createAction('[Business Plan Item] load initial data Success');


export const saveData = createAction('[Business Plan Item] save all draft data');
export const startCalculating = createAction('[Business Plan Item] start calculating on apply btn ', props<{componentName:string}>());
export const endCalculating = createAction('[Business Plan Item] end calculating');
export const localSaveData = createAction('[Business Plan Item] save all draft data to localstorage');
export const savedSuccess = createAction('[Business Plan Item] saved all draft data Success');
export const savedFailure = createAction('[Business Plan Item] saved all draft data Failed', props<{ error: any }>());
