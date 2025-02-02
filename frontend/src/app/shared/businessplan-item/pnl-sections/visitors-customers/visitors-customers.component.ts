import {ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IVisitorsFormConfig, VisitorsFormConfig} from 'src/app/interfaces';
import {Observable, Subject, takeUntil} from "rxjs";
import {displayInPercentage, getTotalMonthlyCustomers, validateFromPercentage} from '../../businessplan-item.functions';
import {select, Store} from '@ngrx/store';
import {BusinessPlanItemActions, Selectors, VisitorsCustomersActions} from '../../store';
import {NzFormTooltipIcon} from 'ng-zorro-antd/form';
import {TitlesDescription} from './models';
import {isCalculatingSelector} from "@businessplan-item/store/selectors/businessplan-item.selectors";
import { CellValue, JspreadsheetInstance } from "jspreadsheet-ce"
import * as jspreadsheet from 'jspreadsheet-ce';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'visitors-customers',
    templateUrl: './visitors-customers.component.html',
    styleUrls: ['./visitors-customers.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class VisitorsCustomersComponent implements OnInit, OnDestroy {
    visitorsForm!: FormGroup<VisitorsFormConfig>;
    tooltipIcon: NzFormTooltipIcon = {
        type: 'info-circle',
        theme: 'outline'
    };
    tooltipTitle = TitlesDescription;
    private readonly unsubscribe$: Subject<void> = new Subject();
    componentName: string = 'visitors-customers';
    componentName$: Observable<string | null>;
    @ViewChild("spreadsheetCalculator") spreadsheetCont: ElementRef<HTMLDivElement>;
    spreadsheet: JspreadsheetInstance;
    spreadsheetData: CellValue[][];
    isCustomerCalcVisible: boolean = false;

    constructor(private _fb: FormBuilder, private _store: Store, private _message: NzMessageService) {
        this.componentName$ = this._store.pipe(select(isCalculatingSelector));
    };



    ngOnInit(): void {
        this._store.dispatch(VisitorsCustomersActions.init());

        this._store.select(Selectors.selectVisitorsCustomersState).pipe(
            takeUntil(this.unsubscribe$)
        ).subscribe(data => {
            if (data.isInitial) this.visitorsForm = this._initForm(data.aboutVisitorsCustomers);
            if (!data.isLoaded) return;

            let visitorsData = data.aboutVisitorsCustomers;
            this.visitorsForm.patchValue({
                applicable: visitorsData.applicable,
                comment: visitorsData.comment,
                costPerVisitor: visitorsData.costPerVisitor,
                monthlyConversionUserThatBuys: displayInPercentage(visitorsData.monthlyConversionUserThatBuys),
                paidTraffic: displayInPercentage(visitorsData.paidTraffic),
                totalMonthlyCrowd: visitorsData.totalMonthlyCrowd,
                totalMonthlyVisitors: visitorsData.totalMonthlyVisitors,
                totalMonthlyCustomers: visitorsData.totalMonthlyCustomers
            });

            this.spreadsheetData = visitorsData.sheetData
        });

        

        this.visitorsForm.controls.monthlyConversionUserThatBuys.valueChanges
            .pipe(
                takeUntil(this.unsubscribe$)
            )
            .subscribe(value => {
                this.visitorsForm.controls.monthlyConversionUserThatBuys.patchValue(value, {emitEvent: false})
            })

        this.visitorsForm.controls.paidTraffic.valueChanges
            .pipe(
                takeUntil(this.unsubscribe$)
            )
            .subscribe(value => {
                this.visitorsForm.controls.paidTraffic.patchValue(value, {emitEvent: false})
            })

        this.visitorsForm.controls.monthlyConversionUserThatBuys.valueChanges
            .subscribe(val => {
                let value = validateFromPercentage(val);
                this.visitorsForm.controls.totalMonthlyCustomers.patchValue(getTotalMonthlyCustomers(this.visitorsForm.value.totalMonthlyVisitors, value))
            })
        this.visitorsForm.controls.totalMonthlyVisitors.valueChanges
            .subscribe(val => {
                let value = validateFromPercentage(val);
                this.visitorsForm.controls.totalMonthlyCustomers.patchValue(getTotalMonthlyCustomers(value, this.visitorsForm.value.monthlyConversionUserThatBuys))
            })
    }

    ngOnDestroy(): void {
        this._store.dispatch(VisitorsCustomersActions.init());
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    applyForm(form: FormGroup<VisitorsFormConfig>): void {
        this._store.dispatch(BusinessPlanItemActions.startCalculating({componentName: this.componentName}))
        form.markAsUntouched();

        let formValues = form.value;
        let visitorsData = {
            applicable: formValues.applicable,
            comment: formValues.comment,
            costPerVisitor: formValues.costPerVisitor,
            monthlyConversionUserThatBuys: validateFromPercentage(formValues.monthlyConversionUserThatBuys),
            paidTraffic: validateFromPercentage(formValues.paidTraffic),
            totalMonthlyCrowd: formValues.totalMonthlyCrowd,
            totalMonthlyVisitors: formValues.totalMonthlyVisitors,
            totalMonthlyCustomers: formValues.totalMonthlyCustomers,
            sheetData: this.spreadsheet?.getData()
        };

        this._store.dispatch(VisitorsCustomersActions.update({payload: {aboutVisitorsCustomers: visitorsData}}))
        this._store.dispatch(BusinessPlanItemActions.localSaveData());
        console.log('Visitors Customers Data  Applied', visitorsData);
    };

    private _initForm(visitorsData: IVisitorsFormConfig) {
        return this._fb.nonNullable.group<VisitorsFormConfig>({
            comment: this._fb.control(visitorsData.comment || null),
            applicable: this._fb.control(visitorsData.applicable || null, [Validators.required]),
            costPerVisitor: this._fb.control(visitorsData.costPerVisitor || null, [Validators.required]),
            monthlyConversionUserThatBuys: this._fb.control(displayInPercentage(visitorsData.monthlyConversionUserThatBuys) || null, [Validators.required]),
            paidTraffic: this._fb.control(displayInPercentage(visitorsData.paidTraffic) || null, [Validators.required]),
            totalMonthlyCrowd: this._fb.control(visitorsData.totalMonthlyCrowd || null, [Validators.required]),
            totalMonthlyVisitors: this._fb.control(visitorsData.totalMonthlyVisitors || null, [Validators.required]),
            totalMonthlyCustomers: this._fb.control(visitorsData.totalMonthlyCustomers || null)
        })
    }

    showAdvancedCustomerCalculation(): void {
      this.isCustomerCalcVisible = true;
      
      setTimeout(() => {
        this.spreadsheet = jspreadsheet(this.spreadsheetCont.nativeElement, {
        data: this.spreadsheetData,
        columns:[
            { width: 300 },
            { width: 100 },
            { width: 50 },
            { width: 50 },
            { width: 50 },
            { width: 50 },
        ]
      });}, 0);
      
    }

    advancedCustomerCalculationHandleOk(): void {
        let unRegistered: number = this.getNumberFromCell("B1");
        let registered: number = this.getNumberFromCell("B2");
        
        if(!registered || !unRegistered) {
            this._message.create("error", "Result in cells should only contain numbers")
            return;
        }
        this.visitorsForm.controls.totalMonthlyVisitors.setValue(registered)
        this.visitorsForm.controls.totalMonthlyCrowd.setValue(unRegistered)
        this.visitorsForm.markAsTouched();
        this.isCustomerCalcVisible = false;
    }

    advancedCustomerCalculationHandleCancel(): void {
      this.isCustomerCalcVisible = false;
      this.spreadsheet.setData(this.spreadsheetData);
    }

    private getNumberFromCell(cellName: string){
        return parseFloat(this.spreadsheet.getValue(cellName, true).toString())
    }

}

