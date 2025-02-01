import { Routes, RouterModule } from '@angular/router';
import { AddIdeaUnregisteredComponent } from './add-ideaunregistered.component';

const childRoutes: Routes = [
    {
        path: '',
        component: AddIdeaUnregisteredComponent
    }
];

export const routing = RouterModule.forChild(childRoutes);
