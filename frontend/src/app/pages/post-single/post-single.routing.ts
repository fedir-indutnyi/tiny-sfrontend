import { Routes, RouterModule } from '@angular/router';
import { PostSingleComponent } from './post-single.component';

const childRoutes: Routes = [
    {
        path: '',
        component: PostSingleComponent
    }
];

export const routing = RouterModule.forChild(childRoutes);
