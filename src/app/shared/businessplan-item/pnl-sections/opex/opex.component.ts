import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {map, Observable} from 'rxjs';
import {Store} from "@ngrx/store";

import {displayInPercentage, validateFromPercentage} from '@shared/businessplan-item/businessplan-item.functions';
import {iDynamicTableDataSource, iDynamicTableFormConfig} from '@businessplan-item/shared/dynamic-table-form/models';
import {pnlDictionary} from './pnl-dictionary';
import {BusinessPlanItemActions, OpexActions, Selectors} from '@businessplan-item/store/index';
import {iOpex} from "@businessplan-item/store/reducers/opex.reducer";


@Component({
    selector: 'app-opex',
    templateUrl: './opex.component.html',
    styleUrls: ['./opex.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpexComponent implements OnInit {
    protected dataSource$!: Observable<iDynamicTableDataSource[]>;
    componentName: string = 'app-opex';

    constructor(private _store: Store) {
    };

    ngOnInit(): void {
        this._store.dispatch(OpexActions.init());

        this.dataSource$ = this._store.select(Selectors.selectOpex).pipe(
            map(data => data ? data.map((row, index) => {
                return {
                    ...row,
                    percentage: displayInPercentage(row.percentage as number),
                }
            }) : [])
        );
    }

    onApply(data: iDynamicTableDataSource[]): void {
        this._store.dispatch(BusinessPlanItemActions.startCalculating({componentName: this.componentName}));
        data = data.map((row, index) => {
            return {
                ...row,
                percentage: validateFromPercentage(row.percentage as number),
            }
        });
        this._store.dispatch(OpexActions.updateAll({payload: {opex: data as unknown as iOpex[]}}));
        this._store.dispatch(BusinessPlanItemActions.localSaveData());
    };


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
                value: 'Rent',
                type: 'text',
                order: 1,
                width: 250,
                propagateValueTo: (value) => {
                    return {
                        controlName: 'vendor',
                        value: `Vendor for ${value}`
                    }
                }
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
            vendor: {
                controlType: 'textarea',
                label: 'bp.inputTables.vendorSupplierName',
                value: 'Vendor of Rent',
                type: 'text',
                order: 5,
                width: 250
            },
            startMonth: {
                controlType: 'numberInput',
                label: 'bp.inputTables.startMonth',
                value: 1,
                type: 'number',
                order: 6,
                width: 100
            },
            endMonth: {
                controlType: 'numberInput',
                label: 'bp.inputTables.endMonth',
                value: 999,
                type: 'number',
                order: 7,
                width: 100
            },
            comment: {
                controlType: 'textarea',
                label: 'bp.inputTables.comment',
                value: 'text area',
                type: 'text',
                order: 8,
                width: 250
            },
        }
    }

    protected dataSource: iDynamicTableDataSource[] = []
}
