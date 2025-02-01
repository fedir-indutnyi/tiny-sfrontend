import {Action, createReducer, on} from "@ngrx/store";
import {BusinessPlanItemActions} from "..";

export interface State {
    isCalculating: { componentName: string | null }
}

let initialStore: State = {
    isCalculating: {componentName: null}
};


const BusinessPlanItemReducer = createReducer(
    initialStore,
    on(BusinessPlanItemActions.init, (state) => initialStore),
    on(BusinessPlanItemActions.loadDataDone, (state, props) => state),
    on(BusinessPlanItemActions.startCalculating, (state, props) => ({
        ...state,
        isCalculating: {componentName: props.componentName}
    })),
    on(BusinessPlanItemActions.endCalculating, (state, props) => ({
        ...state,
        isCalculating: {componentName: null}
    })),
)

export function reducer(state: State | undefined, action: Action) {
    return BusinessPlanItemReducer(state, action);
}
