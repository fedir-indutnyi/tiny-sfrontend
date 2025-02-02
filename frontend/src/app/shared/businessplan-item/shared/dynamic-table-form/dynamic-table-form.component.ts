import {CommonModule, KeyValue} from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewEncapsulation
} from '@angular/core';
import {iDynamicControl, iDynamicTableDataSource, iDynamicTableFormConfig} from './models';
import {FormArray, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {NzListModule} from 'ng-zorro-antd/list';
import {ControlInjectorPipe} from './control-injector.pipe';
import {DynamicControlResolver} from './dynamic-control-resolver.service';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzTableModule} from 'ng-zorro-antd/table';
import {Observable} from "rxjs";
import {select, Store} from "@ngrx/store";
import {isCalculatingSelector} from "@businessplan-item/store/selectors/businessplan-item.selectors";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {TranslateModule} from "@ngx-translate/core";


@Component({
    selector: 'app-dynamic-table-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule,
        ControlInjectorPipe,
        NzButtonModule,
        NzPopconfirmModule,
        NzIconModule,
        NzGridModule,
        NzTableModule,
        NzListModule,
        NzSpinModule, TranslateModule,],
    templateUrl: './dynamic-table-form.component.html',
    styleUrls: ['./dynamic-table-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class DynamicTableFormComponent implements OnInit, OnChanges {
    @Input() config!: iDynamicTableFormConfig;
    @Input() dataSource!: iDynamicTableDataSource[];
    @Input() componentName: string;

    @Output() onApply = new EventEmitter<iDynamicTableDataSource[]>();

    protected formConfig: { config: iDynamicTableFormConfig, form: FormArray } = {
        config: this.config,
        form: new FormArray([])
    };
    protected tableWidth: number = 1300;
    protected get tableData() {
        return this.formConfig.form.controls
    };

    form!: FormGroup;
    componentName$: Observable<string | null>;

    constructor(protected controlResolver: DynamicControlResolver,
                private _cdr: ChangeDetectorRef,
                private _store: Store
    ) {
        this.componentName$ = this._store.pipe(select(isCalculatingSelector));
    };

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.config && changes.config.currentValue) {
            this.tableWidth = this.calculateTableWidth(changes.config.currentValue);
            this.formConfig.config = changes.config.currentValue;
        }

        if (changes.dataSource && changes.dataSource.currentValue) {
            this.formConfig.form = this.buildForm(changes.dataSource.currentValue);
        }
    }

    addRow() {
        this.formConfig.form.push(new FormGroup({}));

    }

    deleteRow(index: number) {
        this.formConfig.form.removeAt(index);
        this._cdr.markForCheck();
    }

    private buildForm(dataSource) {
        let form = new FormArray([...new Array(dataSource.length)].map(() => new FormGroup({})))

        return form
    }

    private calculateTableWidth(formConfig: iDynamicTableFormConfig) {
        let width = 0;
        Object.values(formConfig.controls).forEach((control: iDynamicControl) => {
            width += control.width;
        });
        return width;
    }

    protected comparatorFn = (
        a: KeyValue<string, iDynamicControl>,
        b: KeyValue<string, iDynamicControl>
    ): number => a.value.order - b.value.order;

    protected onSubmit(form: FormGroup) {
        let tableData: iDynamicTableDataSource[] = Object.values(form.getRawValue());
        this.onApply.emit(tableData);
    }


}
