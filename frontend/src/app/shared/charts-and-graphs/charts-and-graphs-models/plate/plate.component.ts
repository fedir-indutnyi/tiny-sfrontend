import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import * as jspreadsheet from 'jspreadsheet-ce';

@Component({
    selector: 'app-plate',
    standalone: true,
    templateUrl: './plate.component.html',
    styleUrls: ['./plate.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlateComponent implements AfterViewInit, OnChanges{
    @ViewChild('spreadsheet', { static: true }) spreadsheet: ElementRef;

    @Input() tableTitle: string;
    @Input() years: number[];
    @Input() rowData: { title: string; values: number[]; formula?: (values: number[]) => number[] }[];
    @Input() includeColumnTotals = false;
    @Input() includeRowTotals = false;
    @Input() colomnWidth = 120;
    
    ngOnChanges(changes: SimpleChanges) {
        this.ngAfterViewInit();
    }

    ngAfterViewInit() {
        const columns: jspreadsheet.Column[] = [
            { type: 'text', title: ' ', width: 200 }, // Тип "text" для першого стовпця
            ...this.years.map((year) => ({ type: 'numeric', title: year.toString(), width: this.colomnWidth } as jspreadsheet.Column)), // Явний тип "numeric" для років
            ...(this.includeRowTotals ? [{ type: 'numeric', title: 'Total', width: this.colomnWidth } as jspreadsheet.Column] : []), // Тип "numeric" для стовпця Total
        ];

        if (!this.rowData){
            return;
        }

        const data = this.rowData.map((row) => {
            const computedValues = row.formula
                ? row.formula(row.values)
                : row.values;
            const total = computedValues.reduce((sum, value) => sum + value, 0);
            return this.includeRowTotals ? [row.title, ...computedValues, total] : [row.title, ...computedValues];
        });

        if (this.includeColumnTotals) {
            const columnTotals = this.years.map((_, colIndex) =>
                data.reduce((sum, row) => sum + (+row[colIndex + 1] || 0), 0)
            );
            const rowTotalSum = this.includeRowTotals
                ? columnTotals.reduce((sum, value) => sum + value, 0)
                : null;

            data.push([
                'Total',
                ...columnTotals,
                ...(this.includeRowTotals ? [rowTotalSum] : []),
            ]);
        }

        jspreadsheet(this.spreadsheet.nativeElement, {
            data,
            columns,
            updateTable: (instance, cell, col, row) => {
                if (
                    (this.includeColumnTotals && row === data.length - 1) || // Нижній тотал
                    (this.includeRowTotals && col === columns.length - 1 && row >= 0) // Тотал по рядках
                ) {
                    cell.classList.add('total-cell');
                }
            },
        });
    }
}
