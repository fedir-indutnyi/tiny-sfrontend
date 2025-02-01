import { Routes, RouterModule } from '@angular/router';
import { MyItemsComponent } from './my-items.component';

const childRoutes: Routes = [
  {
    path: '',
    component: MyItemsComponent
  }
];

export const routing = RouterModule.forChild(childRoutes);
