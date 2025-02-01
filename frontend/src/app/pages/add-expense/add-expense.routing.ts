import { Routes, RouterModule } from '@angular/router';
import { AddExpenseComponent } from './add-expense.component';

const childRoutes: Routes = [
    {
        path: '',
        component: AddExpenseComponent
    }
];


export const routing = RouterModule.forChild(childRoutes);
