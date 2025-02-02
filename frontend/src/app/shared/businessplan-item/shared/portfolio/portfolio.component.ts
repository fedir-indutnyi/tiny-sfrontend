import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild
} from "@angular/core";
import {FormCtrl, ProductsService} from "src/app/interfaces";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {map, Observable, Subject, takeUntil} from "rxjs";
import {select, Store} from "@ngrx/store";
import {BusinessPlanItemActions, PortfolioActions, Selectors} from "@businessplan-item/store";
import {displayInPercentage, validateFromPercentage} from "@businessplan-item/businessplan-item.functions";
import {NzFormTooltipIcon} from "ng-zorro-antd/form";
import {TitlesDescription} from "./models";
import {ClipboardService} from "@app/shared/services/clipboard.service";
import {TsvConverterService} from "@app/shared/services/tsv-converter.service";
import {AiButtonService} from "@app/shared/services/ai-button.service";
import {isCalculatingSelector} from "@businessplan-item/store/selectors/businessplan-item.selectors";

@Component({
    selector: "app-portfolio",
    templateUrl: "./portfolio.component.html",
    styleUrls: ["./portfolio.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioComponent implements OnInit, OnDestroy {
    private readonly unsubscribe$: Subject<void> = new Subject();
    protected _emptyProduct: ProductsService = null;
    protected percentageCalculationMethod$: Observable<boolean>;
    protected decimalSeparatorCommaControl: FormControl<boolean> = new FormControl(true);
    componentName: string = 'app-portfolio'
    componentName$: Observable<string | null>;

    @ViewChild('portfolioTable') portfolioTable: { elementRef: ElementRef };
    portfolioTableForm = this._initForm();
    productsTotalData$: Observable<ProductsService>;
    tooltipIcon: NzFormTooltipIcon = {
        type: 'info-circle',
        theme: 'outline'
    };
    tooltipTitle = TitlesDescription;
    customerCalculationMethod: string = "each";
    monthlyValueTotal = 0;

    products: ProductsService[] = [];


    constructor(
        private _fb: FormBuilder,
        private _store: Store,
        private _cdr: ChangeDetectorRef,
        private _clipboad: ClipboardService,
        private _tsvConverter: TsvConverterService,
        protected _aiButton: AiButtonService,
    ) {
        this.componentName$ = this._store.pipe(select(isCalculatingSelector));
    }

    ngOnInit(): void {

        this._store.dispatch(PortfolioActions.init());
        this._store.dispatch(PortfolioActions.initTotal());

        this._store.select(Selectors.selectPortfolioInitialProductState)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(initialProductData => {
                if (!initialProductData) return;

                this._emptyProduct = initialProductData;
            });


        this.productsTotalData$ = this._store.select(Selectors.selectPortfolioTotalsState)
            .pipe(takeUntil(this.unsubscribe$))
            .pipe(map(totals => {
                totals.monthlyConversionUserThatBuys = displayInPercentage(totals.eachNCustomerBuys);
                return totals
            }));

        this._store.select(Selectors.selectPortfolioState)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(productsState => {
                if (productsState.isEdited) return;
                this.products = productsState.productsServices.map((product) => ({
                    ...product,
                    monthlyConversionUserThatBuys: displayInPercentage(product.monthlyConversionUserThatBuys),
                    estimatedFailedOrders: displayInPercentage(product.estimatedFailedOrders),
                    standardDiscount: displayInPercentage(product.standardDiscount),
                    yearlyInflationRate: displayInPercentage(product.yearlyInflationRate),
                    yearlyPriceIncrease: displayInPercentage(product.yearlyPriceIncrease),
                }));
                this.portfolioTableForm = this._initForm(productsState.customerCalculationMethod, productsState.productsServices);
                this.customerCalculationMethod = productsState.customerCalculationMethod

                if (!productsState.isEdited && productsState.isLoaded) {
                    this.portfolioTableForm.markAllAsTouched();
                    this._cdr.markForCheck();
                }

                this.portfolioTableForm.controls.products.controls.forEach((ctrl) => {
                    ctrl.controls.overrideFromBusinessDetails.valueChanges.subscribe((value) => {
                        if (!value) {
                            ctrl.patchValue({
                                yearlyInflationRate: displayInPercentage(productsState.initialProduct.yearlyInflationRate),
                                yearlyPriceIncrease: displayInPercentage(productsState.initialProduct.yearlyPriceIncrease),
                            })
                        }
                    })
                })

                this.portfolioTableForm.controls.customerCalculationMethod.valueChanges.subscribe((value) => {
                    this.customerCalculationMethod = value
                })


            })

        this._store.select(Selectors.selectPortfolioUpdatedProductState)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(data => {
                if (!data) return;
                if (!this.portfolioTableForm.controls.products.at(data.index)) return;
                let product = data.product;

                this.portfolioTableForm.controls.products.at(data.index).patchValue(<ProductsService>{
                    id: product.id,
                    brand: product.brand,
                    name: product.name.split("##")[1] ?? product.name,
                    cost: product.cost,
                    price: product.price,
                    productMarkup: product.productMarkup,
                    productMargin: product.productMargin,
                    eachNCustomerBuys: product.eachNCustomerBuys,
                    absoluteCountValues: product.absoluteCountValues,
                    monthlyConversionUserThatBuys: displayInPercentage(product.monthlyConversionUserThatBuys),
                    customers: product.customers,
                    itemsPerOrder: product.itemsPerOrder,
                    ordersMonthPerCustomer: product.ordersMonthPerCustomer,
                    totalUnits: product.totalUnits,
                    estimatedFailedOrders: displayInPercentage(product.estimatedFailedOrders),
                    standardDiscount: displayInPercentage(product.standardDiscount),
                    onFirstInitialStock: !!product.onFirstInitialStock,
                    ammortizationApplied: !!product.ammortizationApplied,
                    totalAssetValue: product.totalAssetValue,
                    beginningMonths: product.beginningMonths,
                    endingMonth: product.endingMonth,
                    ammortisationMonths: product.ammortisationMonths,
                    yearlyInflationRate: displayInPercentage(product.yearlyInflationRate),
                    yearlyPriceIncrease: displayInPercentage(product.yearlyPriceIncrease),
                    UOM: product.UOM,
                    overrideFromBusinessDetails: product.overrideFromBusinessDetails,
                    totalMonthlyValue: product.totalMonthlyValue
                }, {emitEvent: false, onlySelf: false});
            })

    }

    ngOnDestroy(): void {
        this._store.dispatch(PortfolioActions.init())
        this._store.dispatch(PortfolioActions.initTotal())

        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    trackByFn(index: number) {
        return index
    }

    editRowIndex: number | null = null;

    startEditingRow(index: number): void {
        if (this.editRowIndex != null)
            this.saveEdit(this.portfolioTableForm.controls.products.controls[this.editRowIndex], this.editRowIndex)
        this.editRowIndex = index;
    }

    resetEdit(productFromGrp, index: number): void {
        productFromGrp.reset(this.products[index], {emitEvent: false});
        this.stopEdit();
    }

    private stopEdit(): void {
        this.editRowIndex = null
    }

    saveEdit(productFormGrp, index: number): void {
        this.stopEdit();
        productFormGrp.markAsUntouched();
        productFormGrp.markAsPristine();
        if (this.portfolioTableForm.pristine) this.portfolioTableForm.markAsDirty({onlySelf: true});
        let editedProduct = productFormGrp.getRawValue() as ProductsService;
        this._store.dispatch(PortfolioActions.updateProductByIndex({
            payload: {
                index: index,
                productService: {
                    ...editedProduct,
                    brand: editedProduct.brand || "All Brands",
                    monthlyConversionUserThatBuys: validateFromPercentage(editedProduct.monthlyConversionUserThatBuys),
                    estimatedFailedOrders: validateFromPercentage(editedProduct.estimatedFailedOrders),
                    yearlyInflationRate: validateFromPercentage(editedProduct.yearlyInflationRate),
                    yearlyPriceIncrease: validateFromPercentage(editedProduct.yearlyPriceIncrease),
                },
                customerCalculationMethod: this.customerCalculationMethod
            }
        }));
        this._store.dispatch(PortfolioActions.updateTotalUnits());
        this._store.dispatch(PortfolioActions.updateTotalMonthlyValue());
    }

    addRow(): void {
        this.portfolioTableForm.markAsDirty();
        this.portfolioTableForm.markAllAsTouched();
        let emptyProduct = {
            ...this._emptyProduct,
            id: Date.now(),
            name: this.products.length ? `Product ${this.products.length + 1}` : 'Product 1',
        };


        this.portfolioTableForm.controls.products.push(this._emptyFormGrp(emptyProduct));


        this.startEditingRow(this.portfolioTableForm.controls.products.length - 1);

        this._store.dispatch(PortfolioActions.addNewProduct({
            payload: {
                productService: emptyProduct,
                index: this.editRowIndex
            }
        }));
    }

    deleteRow(index: number): void {
        this.portfolioTableForm.markAsDirty();
        this.portfolioTableForm.markAsTouched();
        this.portfolioTableForm.controls.products.removeAt(index);

        this._store.dispatch(PortfolioActions.removeProductByIndex({payload: {index: index}}));
    }

    copyToClipboard(): void {
        var products = this.products;
        products.forEach((product) => {
            product.name = product.name.split("##")[1] ?? product.name;
        });
        var tsv = this._tsvConverter.toTsv<ProductsService>(products);
        if (this.decimalSeparatorCommaControl.value) tsv = tsv.replace(/\./g, ",");

        this._clipboad.put(tsv);
    }

    pasteFromClipboard(): void {
        this._clipboad.get()
            .then((tsv) => {
                if (this.decimalSeparatorCommaControl.value) tsv = tsv.replace(/\,/g, ".");
                const products = this._tsvConverter.fromTsv<ProductsService>(tsv, ['name', 'price'])
                    .map((product, index) => {
                        return {
                            ...product,
                            id: index + 10
                        } as ProductsService
                    });
                products.forEach((product) => {
                    product.name = product.brand + "##" + product.name;
                    product.monthlyConversionUserThatBuys = validateFromPercentage(product.monthlyConversionUserThatBuys);
                    product.estimatedFailedOrders = validateFromPercentage(product.estimatedFailedOrders);
                    product.yearlyInflationRate = validateFromPercentage(product.yearlyInflationRate);
                    product.yearlyPriceIncrease = validateFromPercentage(product.yearlyPriceIncrease);
                });
                if (!products.length) return alert('Incorrect format.');

                this._store.dispatch(PortfolioActions.fillInLoadedDataProducts({payload: {productsServices: products, customerCalculationMethod: this.customerCalculationMethod}}));
                this._store.dispatch(PortfolioActions.updateTotalUnits());
                this._store.dispatch(PortfolioActions.updateTotalMonthlyValue());

                this.portfolioTableForm.markAsDirty();
                this._cdr.detectChanges();
            });
    }

    pasteFromJSON(products: ProductsService[]): void {
        products.forEach((product) => {
            product.name = product.brand + "##" + product.name;
        })

        this._store.dispatch(PortfolioActions.fillInLoadedDataProducts({payload: {productsServices: products, customerCalculationMethod: this.customerCalculationMethod}}));
        this._store.dispatch(PortfolioActions.updateTotalUnits())
        this._store.dispatch(PortfolioActions.updateTotalMonthlyValue())

        this.portfolioTableForm.markAsDirty();
        this._cdr.detectChanges();
    }


    applyPortfolio(form: FormGroup): void {
        this._store.dispatch(BusinessPlanItemActions.startCalculating({componentName: this.componentName}))
        form.markAsUntouched();
        form.markAsPristine();
        this.stopEdit();
        let products = form.controls.products.getRawValue();
        let customerCalculationMethod = form.controls.customerCalculationMethod.getRawValue();
        products = products.map(product => {
            return {
                ...product,
                name: product.brand + '##' + product.name,
                monthlyConversionUserThatBuys: validateFromPercentage(product.monthlyConversionUserThatBuys),
                estimatedFailedOrders: validateFromPercentage(product.estimatedFailedOrders),
                yearlyInflationRate: validateFromPercentage(product.yearlyInflationRate),
                yearlyPriceIncrease: validateFromPercentage(product.yearlyPriceIncrease),
            }
        });
        
        this._store.dispatch(PortfolioActions.update({payload: {productsServices: products, customerCalculationMethod: customerCalculationMethod}}));
        this._store.dispatch(BusinessPlanItemActions.localSaveData());
    };

    private _initForm(customerCalculationMethod = 'each', products?: ProductsService[]) {
        let form = this._fb.group({
            products: this._fb.array<FormGroup>([], {updateOn: 'blur'}),
            customerCalculationMethod: this._fb.control(customerCalculationMethod, {updateOn: 'blur'})
        }, {updateOn: 'blur'})

        if (products && products.length) {
            products.forEach((product, index) => {
                const formGroup = this._emptyFormGrp(product);
                formGroup.controls.overrideFromBusinessDetails.disable({emitEvent: false});
                formGroup.controls.onFirstInitialStock.disable({emitEvent: false});
                form.controls.products.insert(index, formGroup, {emitEvent: false});
            })
        }
        return form
    }

    private _emptyFormGrp(product?: ProductsService) {
        return this._fb.group<FormCtrl<ProductsService>>({
            id: this._fb.control(product.id),
            brand: this._fb.control(product.brand),
            name: this._fb.control(product.name.split("##")[1] ?? product.name, Validators.required),
            cost: this._fb.control(product.cost),
            price: this._fb.control(product.price),
            productMarkup: this._fb.control(product.productMarkup),
            productMargin: this._fb.control(product.productMargin),
            eachNCustomerBuys: this._fb.control(product.eachNCustomerBuys),
            absoluteCountValues: this._fb.control(product.absoluteCountValues),
            monthlyConversionUserThatBuys: this._fb.control(displayInPercentage(product.monthlyConversionUserThatBuys)),
            customers: this._fb.control(product.customers),
            itemsPerOrder: this._fb.control(product.itemsPerOrder),
            ordersMonthPerCustomer: this._fb.control(product.ordersMonthPerCustomer),
            totalUnits: this._fb.control(product.totalUnits),
            estimatedFailedOrders: this._fb.control(displayInPercentage(product.estimatedFailedOrders)),
            standardDiscount: this._fb.control(displayInPercentage(product.standardDiscount)),
            onFirstInitialStock: this._fb.control(!!product.onFirstInitialStock),
            ammortizationApplied: this._fb.control(!!product.ammortizationApplied),
            totalAssetValue: this._fb.control(product.totalAssetValue),
            beginningMonths: this._fb.control(product.beginningMonths),
            ammortisationMonths: this._fb.control(product.ammortisationMonths),
            endingMonth: this._fb.control(product.endingMonth),
            yearlyInflationRate: this._fb.control(displayInPercentage(product.yearlyInflationRate), Validators.required),
            yearlyPriceIncrease: this._fb.control(displayInPercentage(product.yearlyPriceIncrease), Validators.required),
            UOM: this._fb.control(product.UOM, Validators.required),
            overrideFromBusinessDetails: this._fb.control(product.overrideFromBusinessDetails),
            numberOfMonthsForInitialStock: this._fb.control(product.numberOfMonthsForInitialStock),
            totalMonthlyValue: this._fb.control(product.totalMonthlyValue),
        });
    }

}
