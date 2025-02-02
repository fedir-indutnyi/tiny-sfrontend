import { Routes, RouterModule } from '@angular/router';
import { MyExpensesComponent } from './my-expenses.component';

const childRoutes: Routes = [
  {
    path: '',
    component: MyExpensesComponent
  }
];

export const routing = RouterModule.forChild(childRoutes);
