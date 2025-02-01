import { NgModule } from '@angular/core';
import { AddExpenseComponent } from './add-expense.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { routing } from './add-expense.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { QuillEditorModule } from 'ngx-quill-editor';
import { QuillModule } from 'ngx-quill'
import {  MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select'
import {MatLegacyAutocompleteModule as MatAutocompleteModule} from '@angular/material/legacy-autocomplete'
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatIconModule } from '@angular/material/icon';
import {NzSelectModule} from "ng-zorro-antd/select";

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        routing,
        MatSelectModule,
        MatFormFieldModule,
        FormsModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatChipsModule,
        // QuillEditorModule,
        QuillModule.forRoot(),
        NzSelectModule,
    ],
  declarations: [AddExpenseComponent],
  providers: [/* FileUploadService */]
})
export class AddExpenseModule { }

