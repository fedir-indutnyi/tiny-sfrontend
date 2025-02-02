import { Routes, RouterModule } from '@angular/router';
import { ContactUsComponent } from './contact-us.component';

const childRoutes: Routes = [
    {
        path: '',
        component: ContactUsComponent
    }
];

export const routing = RouterModule.forChild(childRoutes);
