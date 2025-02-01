import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable, map} from 'rxjs';

import {iDynamicTableDataSource, iDynamicTableFormConfig} from '@businessplan-item/shared/dynamic-table-form/models';
import {BusinessPlanItemActions, CogsActions, Selectors} from '@businessplan-item/store/index';
import {iCogs} from '@businessplan-item/store/reducers/cogs.reducer';
import {displayInPercentage, validateFromPercentage} from '@shared/businessplan-item/businessplan-item.functions';

@Component({
    selector: 'app-cogs',
    templateUrl: './cogs.component.html',
    styleUrls: ['./cogs.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CogsComponent implements OnInit {
    protected dataSource$!: Observable<iDynamicTableDataSource[]>;
    componentName: string = 'app-cogs';

    constructor(private _store: Store) {
    };


    ngOnInit(): void {
        this._store.dispatch(CogsActions.init());

        this.dataSource$ = this._store.select(Selectors.selectOtherCogs).pipe(
            map(data => data ? data.map((row, index) => {
                return {
                    ...row,
                    percentage: displayInPercentage(row.percentage as number),
                }
            }) : [])
        );
    };

    onApply(data: iDynamicTableDataSource[]): void {
        this._store.dispatch(BusinessPlanItemActions.startCalculating({componentName: this.componentName}));
        data = data.map((row, index) => {
            return {
                ...row,
                percentage: validateFromPercentage(row.percentage as number),
            }
        });

        this._store.dispatch(CogsActions.updateAll({payload: {cogs: data as unknown as iCogs[]}}));
        this._store.dispatch(BusinessPlanItemActions.localSaveData());
    };

    protected dataConfig: iDynamicTableFormConfig<string | number> = {
        controls: {
            pnlRow: {
                controlType: 'select',
                label: 'bp.inputTables.pnlRow',
                value: 'cogs',
                options: [
                    {label: 'Cogs', value: 'cogs'},
                    {label: 'Other Cogs', value: 'otherCogs'}
                ],
                order: 0,
                width: 150
            },
            description: {
                controlType: 'textInput',
                label: 'bp.inputTables.description',
                value: 'Complimentary Samples',
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
                label: 'bp.inputTables.percentage',
                value: 0,
                type: 'number',
                order: 3,
                width: 100
            },
            vendor: {
                controlType: 'textarea',
                label: 'bp.inputTables.vendorSupplierName',
                value: 'Vendor of Complimentary Samples',
                type: 'text',
                order: 4,
                width: 250
            },
            startMonth: {
                controlType: 'numberInput',
                label: 'bp.inputTables.startMonth',
                value: 1,
                type: 'number',
                order: 5,
                width: 100
            },
            endMonth: {
                controlType: 'numberInput',
                label: 'bp.inputTables.endMonth',
                value: 999,
                type: 'number',
                order: 6,
                width: 100
            },
            comment: {
                controlType: 'textarea',
                label: 'bp.inputTables.comment',
                value: '',
                type: 'text',
                order: 7,
                width: 250
            },
        }
    }

}
