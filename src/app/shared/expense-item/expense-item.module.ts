import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ExpenseItemComponent} from './expense-item.component';
import {NgZorroModule} from '../ng-zorro/ng-zorro.module';

@NgModule({
  declarations: [ ExpenseItemComponent ],
  imports: [
    CommonModule,
    NgZorroModule
  ],
  exports: [ ExpenseItemComponent ],
})
export class ExpenseItemModule {
}
