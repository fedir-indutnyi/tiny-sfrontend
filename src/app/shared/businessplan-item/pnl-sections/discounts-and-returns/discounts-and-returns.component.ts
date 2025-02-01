import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {iDynamicTableDataSource, iDynamicTableFormConfig} from '@businessplan-item/shared/dynamic-table-form/models';
import {map, Observable} from 'rxjs';
import {displayInPercentage, validateFromPercentage} from '@shared/businessplan-item/businessplan-item.functions';
import {Store} from '@ngrx/store';
import {DiscountsAndReturnsActions, Selectors} from '@businessplan-item/store/index';
import {iDiscountsAndReturns} from '@businessplan-item/store/reducers/discounts-and-returns.reducer';
import {pnlDictionary} from './pnl-dictionary';
import {BusinessPlanItemActions} from '../../store';

@Component({
    selector: 'app-discounts-and-returns',
    templateUrl: './discounts-and-returns.component.html',
    styleUrls: ['./discounts-and-returns.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiscountsAndReturnsComponent implements OnInit {
    protected dataSource$!: Observable<iDynamicTableDataSource[]>;
    componentName: string = 'app-discounts-and-returns';

    constructor(private _store: Store) {
    };

    ngOnInit(): void {
        this._store.dispatch(DiscountsAndReturnsActions.init());

        this.dataSource$ = this._store.select(Selectors.selectDiscountAndReturnsState).pipe(
            map(data => data.map((row, index) => {
                return {
                    ...row,
                    percentage: displayInPercentage(row.percentage as number),
                }
            }))
        );
    }

    onApply(data: iDynamicTableDataSource[]) {
        this._store.dispatch(BusinessPlanItemActions.startCalculating({componentName: this.componentName}))
        data = data.map((row, index) => {
            return {
                ...row,
                percentage: validateFromPercentage(row.percentage as number),
            }
        });

        this._store.dispatch(DiscountsAndReturnsActions.updateAll({payload: {discountsAndReturns: data as unknown as iDiscountsAndReturns[]}}));
        this._store.dispatch(BusinessPlanItemActions.localSaveData());

        console.log('Discounts & Returns table data', data);
    }


    protected dataConfig: iDynamicTableFormConfig<string | number> = {
        controls: {
            pnlRow: {
                controlType: 'select',
                label: 'bp.inputTables.pnlRow',
                value: Object.keys(pnlDictionary)[0],
                options: Object.entries(pnlDictionary).map(([key, value]) => ({label: value, value: key})),
                order: 0,
                width: 150
            },
            description: {
                controlType: 'textInput',
                label: 'bp.inputTables.description',
                value: '',
                type: 'text',
                order: 1,
                width: 250
            },
            staticMonthlyNumber: {
                controlType: 'numberInput',
                label: 'bp.inputTables.staticMonthlyNumber',
                value: 0,
                type: 'number',
                order: 2,
                width: 100
            },
            percentage: {
                controlType: 'percentInput',
                label: 'bp.inputTables.percentOfGrossSales',
                value: 0,
                type: 'number',
                order: 3,
                width: 100
            },
            startMonth: {
                controlType: 'numberInput',
                label: 'bp.inputTables.startMonth',
                value: 1,
                type: 'number',
                order: 4,
                width: 100
            },
            endMonth: {
                controlType: 'numberInput',
                label: 'bp.inputTables.endMonth',
                value: 999,
                type: 'number',
                order: 5,
                width: 100
            },
            comment: {
                controlType: 'textarea',
                label: 'bp.inputTables.comment',
                value: '',
                type: 'text',
                order: 6,
                width: 250
            },

        }
    }
}
