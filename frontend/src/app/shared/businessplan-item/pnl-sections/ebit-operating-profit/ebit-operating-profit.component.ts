import {ChangeDetectionStrategy, Component, ViewChild} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngrx/store';
import {WebdatarocksComponent} from '@webdatarocks/ngx-webdatarocks';

import {EbitOperatingProfitActions, Selectors} from '../../store';

@Component({
    selector: 'app-ebit-operating-profit',
    templateUrl: './ebit-operating-profit.component.html',
    styleUrls: ['./ebit-operating-profit.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EbitOperatingProfitComponent {
    private readonly unsubscribe$: Subject<void> = new Subject();
    private pivotData = []

    @ViewChild('pivot') pivotCmp: WebdatarocksComponent;

    constructor(private _store: Store) {
    };

    ngOnInit(): void {
        this._store.dispatch(EbitOperatingProfitActions.Init());
        this._store.select(Selectors.selectEbitOperatingProfitPivotState)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data) => {
                if (!data.length) return;
                this.pivotData = data;
                if (!this.pivotCmp) return;
                this.pivotCmp.webDataRocks.updateData({data: this.setDataSource()});
            })
    };

    ngAfterViewInit() {
        this.pivotCmp.webDataRocks.setReport(this.initPivotTable());
    };

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
        this._store.dispatch(EbitOperatingProfitActions.Init());
    };

    private setDataSource = () => {
        return [
            this.pivotTableConfig,
            ...this.pivotData
        ];
    };

    private pivotTableConfig = {
        "date": {
            type: "string"
        },
        "title": {
            type: "string"
        },
        "year": {
            type: "number"
        },
        "amount": {
            type: "number"
        },
    }

    private initPivotTable(): WebDataRocks.Report {
        return {
            dataSource: {
                data: this.setDataSource(),
            },
            slice: {
                rows: [
                    {
                        uniqueName: "title",
                        caption: "Title",
                        sort: "unsorted",
                    },

                ],
                columns: [
                    {
                        uniqueName: "year",
                        caption: "Periods per Year"
                    },
                    {
                        uniqueName: "date",
                        caption: "Periods per Month"
                    },
                    {
                        uniqueName: "Measures",
                    },


                ],
                measures: [
                    {
                        uniqueName: "amount",
                        aggregation: 'sum',
                    }
                ]
            },
            options: {
                grid: {
                    showTotals: "on",
                    showHeaders: false,
                    showFilter: false,
                    showReportFiltersArea: false,
                    showHierarchies: false,


                },
                configuratorButton: true,
                configuratorActive: false,
                editing: false,
                drillThrough: false,
                showDefaultSlice: false,
                showCalculatedValuesButton: false,
                datePattern: "MM/yyyy",
            },
            formats: [
                {
                    name: "",
                    thousandsSeparator: " ",
                    decimalSeparator: ".",
                    decimalPlaces: 2,
                    currencySymbol: "",
                    currencySymbolAlign: "left",
                    nullValue: "",
                    textAlign: "right",
                    isPercent: false
                }
            ]
        }
    }
}
