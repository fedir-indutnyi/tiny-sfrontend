import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { routing } from "./pages.routing";

import { LayoutModule } from "@shared/layout.module";
import { SharedModule } from "@shared/shared.module";

/* components */
import { PagesComponent } from "./pages.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { AddIdeaUnregisteredComponent } from "./add-ideaunregistered/add-ideaunregistered.component";
import { LoginComponent } from "./login";
import { ResetPasswordComponent } from "./reset-password";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatLegacyCardModule as MatCardModule } from "@angular/material/legacy-card";
import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatLegacySnackBarModule as MatSnackBarModule } from "@angular/material/legacy-snack-bar";
import { MatLegacyCheckboxModule as MatCheckboxModule } from "@angular/material/legacy-checkbox";
import { MatIconModule } from "@angular/material/icon";
import { NgZorroModule } from "@shared/ng-zorro/ng-zorro.module";
import { TermsComponent } from "./sign-up/terms/terms.component";
import { ContactModalComponent } from "./contact-modal/contact-modal.component";
import { ExpensesModalComponent } from "./expenses-modal/expenses-modal.component";
import { MatLegacyTabsModule as MatTabsModule } from "@angular/material/legacy-tabs";
import { MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";
import { MatLegacySelectModule as MatSelectModule } from "@angular/material/legacy-select";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { ExpensesLabelModalComponent } from "./expenses-label-modal/expenses-label-modal.component";
import { DeleteExpensesComponent } from "./delete-expenses/delete-expenses.component";
import { ImportExpensesComponent } from "./import-expenses/import-expenses.component";
import { NotFoundPageComponent } from "./not-found-page/not-found-page.component";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import {
  NGX_MAT_DATE_FORMATS,
  NgxMatDateFormats,
  NgxMatDatetimePickerModule,
} from "@angular-material-components/datetime-picker";
import { TranslateModule } from "@ngx-translate/core";
import { NzNotificationService } from "ng-zorro-antd/notification";

const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: "l, LTS",
  },
  display: {
    dateInput: "l, LTS",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    routing,
    MatTabsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatIconModule,
    NgZorroModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatDatetimePickerModule,
    NzSelectModule,
    NzLayoutModule,
    TranslateModule,
  ],
  declarations: [
    PagesComponent,
    LoginComponent,
    SignUpComponent,
    AddIdeaUnregisteredComponent,
    ResetPasswordComponent,
    TermsComponent,
    ContactModalComponent,
    ExpensesModalComponent,
    ExpensesLabelModalComponent,
    DeleteExpensesComponent,
    ImportExpensesComponent,
    NotFoundPageComponent,
  ],
  providers: [
    { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    NzNotificationService
  ],
})
export class PagesModule {
}
