import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import {BusinessPlanItemActions, SeasonalityActions, Selectors} from '../../store';
import {map, Observable, Subject, takeUntil} from 'rxjs';
import {displayInPercentage, validateFromPercentage} from '../../businessplan-item.functions';
import {ProductSeasonality} from '../../store/reducers/seasonality.reducer';
import {isCalculatingSelector} from "@businessplan-item/store/selectors/businessplan-item.selectors";

const MonthsNames: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


@Component({
    selector: 'app-seasonality',
    templateUrl: './seasonality.component.html',
    styleUrls: ['./seasonality.component.scss']
})
export class SeasonalityComponent implements OnInit, OnDestroy {

    private readonly unsubscribe$: Subject<void> = new Subject();

    seasonalityProducts: ProductSeasonality[] = [];
    seasonalityForm!: FormGroup<{
        products: FormArray<FormArray<FormControl<number>>>;
    }>;

    monthsNames: string[] = MonthsNames;
    componentName: string = 'app-seasonality';
    componentName$: Observable<string | null>;

    constructor(private _fb: FormBuilder, private _store: Store) {
        this.componentName$ = this._store.pipe(select(isCalculatingSelector));
    };

    get productsFormCtrl() {
        return this.seasonalityForm.controls.products as FormArray<FormArray<FormControl<number>>>;
    }

    public ngOnInit(): void {
        this._store.dispatch(SeasonalityActions.init());
        this._store.select(Selectors.selectProductsSeasonalityState)
            .pipe(map(productsSeasonality => {
                    return productsSeasonality.map((product) => {
                        return {
                            ...product,
                            seasonalityIndex: product.seasonalityIndex.map(seasonality => displayInPercentage(seasonality))
                        }
                    })
                }),
                takeUntil(this.unsubscribe$)
            )
            .subscribe((state) => {
                this.seasonalityProducts = state;
                this.seasonalityForm = this._initForm(state);
            });

    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    trackByFn(index: number, item) {
        return index
    }


    trackByFnSeasonality(index: number, item) {
        return index
    }


    editRowIndex: number | null = null;

    startEditingRow(index: number): void {
        this.editRowIndex = index;
    }


    private stopEdit(): void {
        this.editRowIndex = null
    }

    resetEdit(product: ProductSeasonality, index: number, isPristine: boolean): void {
        if (isPristine) {
            this.stopEdit();
            return;
        }
        this.productsFormCtrl.at(index).reset(product.seasonalityIndex)
    }

    saveEdit(index: number): void {
        this.stopEdit();
        this.seasonalityProducts[index].seasonalityIndex = this.productsFormCtrl.at(index).getRawValue();
    }

    populateRow(product: ProductSeasonality) {
        let populatedData = {
            ...product,
            seasonalityIndex: product.seasonalityIndex.map((item) => validateFromPercentage(item))
        };

        this._store.dispatch(SeasonalityActions.populateProductSeasonality({payload: {productSeasonality: populatedData}}));
        if (this.seasonalityForm.pristine) this.seasonalityForm.markAsDirty();
    }


    applyChanges(form): void {
        this._store.dispatch(BusinessPlanItemActions.startCalculating({componentName: this.componentName}))
        let seasonality = form.getRawValue().products;
        let seasonalityData = seasonality.map((product, index) => {
            return {
                productId: this.seasonalityProducts[index].productId,
                name: this.seasonalityProducts[index].name,
                seasonalityIndex: product.map((seasonality) => validateFromPercentage(seasonality))
            }
        });

        this._store.dispatch(SeasonalityActions.update({payload: {productsSeasonality: seasonalityData}}));
        this._store.dispatch(SeasonalityActions.updateStateSucceeded())
        this._store.dispatch(BusinessPlanItemActions.localSaveData());
        this.stopEdit();
    };

    private _initForm(productsSeasonality: ProductSeasonality[] = []): FormGroup {
        let form = this._fb.group({
            products: this._fb.array<FormArray<FormControl<number>>>([])
        });
        if (!productsSeasonality.length) return form;

        form = this._fb.group({
            products: this._fb.array(productsSeasonality.map((product) => {
                return this._fb.nonNullable.array(product.seasonalityIndex.map((seasonality) => {
                    return new FormControl(seasonality)
                }));
            }))
        });

        return form;
    }
}
