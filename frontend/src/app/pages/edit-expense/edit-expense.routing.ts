import { Routes, RouterModule } from '@angular/router';
import { EditExpenseComponent } from './edit-expense.component';

const childRoutes: Routes = [
    {
        path: '',
        component: EditExpenseComponent
    }
];

export const routing = RouterModule.forChild(childRoutes);
