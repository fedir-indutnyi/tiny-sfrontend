import { NgModule } from '@angular/core';
import { EditExpenseComponent } from './edit-expense.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { routing } from './edit-expense.routing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import { QuillEditorModule } from 'ngx-quill-editor';
// import { FileUploadService } from '../../shared/services/upload.service';
import { QuillModule } from 'ngx-quill';
import {NzSelectModule} from "ng-zorro-antd/select";
import {MatLegacyChipsModule as MatChipsModule} from "@angular/material/legacy-chips";
import {MatLegacyAutocompleteModule as MatAutocompleteModule} from "@angular/material/legacy-autocomplete";
import {MatLegacyFormFieldModule as MatFormFieldModule} from "@angular/material/legacy-form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {MatIconModule} from "@angular/material/icon";


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    routing,
    FormsModule,
    // QuillEditorModule
    QuillModule.forRoot(),
    NzSelectModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule
  ],
  declarations: [EditExpenseComponent],
  providers: [/* FileUploadService */]
})
export class EditExpenseModule {}
