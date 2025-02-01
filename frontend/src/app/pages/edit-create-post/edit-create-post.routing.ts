import { Routes, RouterModule } from '@angular/router';

import { EditCreatePostComponent } from './edit-create-post.component';
import { postResolver } from './post.resolver';

const childRoutes: Routes = [
  {
    path: '',
    component: EditCreatePostComponent,
    resolve: { postData: postResolver }
  }
];

export const routing = RouterModule.forChild(childRoutes);
