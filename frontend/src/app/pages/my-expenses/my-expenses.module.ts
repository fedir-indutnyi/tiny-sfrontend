import { NgModule } from '@angular/core';
import { MyExpensesComponent } from './my-expenses.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { routing } from './my-expenses.routing';
import { MatIconModule } from '@angular/material/icon';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field'
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input'
@NgModule({
  imports: [CommonModule,MatIconModule, SharedModule,MatFormFieldModule,MatInputModule, routing],
  declarations: [MyExpensesComponent]
})
export class MyExpensesModule {}
