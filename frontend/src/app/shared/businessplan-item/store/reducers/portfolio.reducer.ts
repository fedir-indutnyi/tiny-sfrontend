import { Action, createReducer, on } from "@ngrx/store";
import { BusinessPlanItemActions, BusinessPlanSettingsActions, PortfolioActions } from "..";
import { ProductsService } from "../../typings";
import { InitialState } from "../initial-store"; import { ExecutionStatusCode } from "../models";
;

export interface State {
  pnlRow?: string,
  pnlData?: unknown[],
  applicable?: boolean,
  splitByProducts?: boolean,
  productsServices: ProductsService[],
  productsTotal: ProductsService,
  updatedProduct: UpdatedProduct | null;
  initialProduct: ProductsService | null;
  isTotalsCalculated: boolean;
  isEdited: boolean;
  isLoaded: boolean;
  executionStatusCode: ExecutionStatusCode
  customerCalculationMethod: string;
}

interface UpdatedProduct {
  product: ProductsService,
  index: number
}

let initialProduct: ProductsService = {
  id: null,
  brand: 'All Brands',
  name: '',
  cost: 0.1,
  price: 0.1,
  productMarkup: null,
  productMargin: null,
  eachNCustomerBuys: 2.0,
  absoluteCountValues: 30,
  monthlyConversionUserThatBuys: 0.5,
  customers: null,
  itemsPerOrder: 1,
  ordersMonthPerCustomer: 1,
  totalUnits: null,
  estimatedFailedOrders: 0.01,
  standardDiscount: 0.00,
  onFirstInitialStock: false,
  ammortizationApplied: false,
  totalAssetValue: null,
  beginningMonths: 1,
  ammortisationMonths: 9999,
  endingMonth: 9999,
  yearlyInflationRate: 0,
  yearlyPriceIncrease: 0,
  UOM: "",
  overrideFromBusinessDetails: false,
  numberOfMonthsForInitialStock: 0.5,
  totalMonthlyValue: null,
}

export let initialStore: State = {
  pnlRow: InitialState.portfolio.pnlRow,
  pnlData: InitialState.portfolio.pnlData,
  applicable: InitialState.portfolio.applicable,
  splitByProducts: InitialState.portfolio.splitByProducts,
  productsServices: InitialState.portfolio.productsServices,
  initialProduct: { ...initialProduct },
  productsTotal: {
    ...initialProduct,
    id: 0,
    name: 'Total Product',
    cost: null,
    price: null,
    eachNCustomerBuys: 1,
    monthlyConversionUserThatBuys: 100,
  },
  updatedProduct: null,
  isTotalsCalculated: false,
  isEdited: false,
  isLoaded: false,
  executionStatusCode: ExecutionStatusCode.INITIAL,
  customerCalculationMethod: 'each'
}

const PortfolioReducer = createReducer(
  initialStore,
  on(PortfolioActions.init, (state) => initialStore),
  on(PortfolioActions.update, (state, props) => ({
    ...state, productsServices: props.payload.productsServices,
    customerCalculationMethod: props.payload.customerCalculationMethod ?? state.customerCalculationMethod,
    isEdited: !props.payload.customerCalculationMethod,
    executionStatusCode: ExecutionStatusCode.COMPLETE,
  })),
  on(PortfolioActions.fillInLoadedDataProducts, (state, props) => ({ ...state, productsServices: props.payload.productsServices,
    customerCalculationMethod: props.payload.customerCalculationMethod,
    isLoaded: true, isEdited: false, isFullFilled: true 
  })),


  on(PortfolioActions.initTotal, (state) => ({ ...state, productsTotal: initialStore.productsTotal, isTotalsCalculated: false })),
  on(PortfolioActions.fillInLoadedDataTotal, (state, props) => ({
    ...state,
    productsTotal: props.payload.productsTotal || initialStore.productsTotal,
    isTotalsCalculated: false,
  })),
  on(PortfolioActions.updateTotal, (state, props) => ({ ...state, productsTotal: props.payload.productsTotal, isTotalsCalculated: true })),
  on(PortfolioActions.updateTotalDone, (state, props) => ({ ...state, productsTotal: props.payload.productsTotal })),


  on(PortfolioActions.updateProductByIndexDone, (state, props) => {
    let products = [...state.productsServices];
    products[props.payload.index] = props.payload.productService;
    return { ...state, productsServices: products, isEdited: true, updatedProduct: { product: props.payload.productService, index: props.payload.index } }
  }),
  on(PortfolioActions.resetUpdatedProductState, (state) => ({ ...state, isEdited: false, updatedProduct: null,})),
  on(PortfolioActions.removeProductByIndex, (state, props) => {
    let products = [...state.productsServices];
    products.splice(props.payload.index, 1)
    return { ...state, productsServices: products, isEdited: true }
  }),
  on(PortfolioActions.addNewProduct, (state, props) => ({
    ...state,
    productsServices: [...state.productsServices, props.payload.productService],
    isEdited: true
  })),
  on(PortfolioActions.updateProductsAcceleration, (state, action) => ({
    ...state,
    productsServices: action.payload.products,
    isEdited: false,
    initialProduct: {
      ...initialProduct,
      yearlyInflationRate: action.payload.acceleration.yearlyInflationRate,
      yearlyPriceIncrease: action.payload.acceleration.yearlyPriceIncrease,
      UOM: action.payload.acceleration.UOM
    }
  })),
)

export function reducer(state: State | undefined, action: Action) {
  return PortfolioReducer(state, action);
}
