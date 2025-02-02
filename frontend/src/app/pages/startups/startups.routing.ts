import { Routes, RouterModule } from '@angular/router';
import { StartupsComponent } from './startups.component';

const childRoutes: Routes = [
    {
        path: '',
        component: StartupsComponent
    }
];

export const routing = RouterModule.forChild(childRoutes);
