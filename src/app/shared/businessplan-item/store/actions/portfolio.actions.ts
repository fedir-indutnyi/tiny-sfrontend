import { createAction, props } from "@ngrx/store";
import { ProductsService } from "../../typings";

const createProductTotal = (actionType: string) => createAction(actionType, props<{ payload: { productsTotal: ProductsService } }>())
const createProductByIndex = (actionType: string) => createAction(actionType, props<{ payload: { productService: ProductsService, index: number} }>())
const createProductsServices = (actionType: string) => createAction(actionType, props<{ payload: { productsServices: ProductsService[], customerCalculationMethod?: string } }>())

export const init = createAction('[Portfolio] initial data');
export const update = createProductsServices('[Portfolio] update all products data');
export const fillInLoadedDataProducts = createProductsServices('[Portfolio] fill with loaded data of products items');

export const initTotal = createAction('[Portfolio Total] initial products total data');
export const fillInLoadedDataTotal = createProductTotal('[Portfolio Total] fill with loaded data of products total');
export const updateTotal = createProductTotal('[Portfolio Total] update products totals data');
export const updateTotalUnits = createAction('[Portfolio Total] update total units based on all products')
export const updateTotalMonthlyValue = createAction('[Portfolio Total] update total monthly value on all products')
export const updateTotalDone = createAction('[Portfolio Total] update total units Done', props<{ payload: { productsTotal: ProductsService } }>())

export const updateProductByIndex = createAction('[Portfolio Product] update product item by Index', props<{ payload: { productService: ProductsService, index: number, customerCalculationMethod?: string} }>())
export const updateProductByIndexDone = createProductByIndex('[Portfolio Product] update product item by Index Done');
export const removeProductByIndex = createAction('[Portfolio Product] remove product item by Index', props<{ payload: { index: number } }>());
export const addNewProduct = createAction('[Portfolio Product] add new product', props<{ payload: { productService: ProductsService, index: number } }>());

export const resetUpdatedProductState = createAction('[Portfolio Product] Reset Updated state to empty. Cancel editing')

export const updateFormView = createAction('[Portfolio Product] Show correct calculation option');

export const updateProductsAcceleration = createAction('[Portfolio Product] update products acceleration', props<{payload: {products: ProductsService[],
  acceleration: {
    yearlyInflationRate: number,
    yearlyPriceIncrease: number,
    UOM: string
  }}}>());
