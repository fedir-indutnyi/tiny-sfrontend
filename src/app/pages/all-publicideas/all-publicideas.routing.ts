import {RouterModule, Routes} from '@angular/router';
import {AllPublicideasComponent} from './all-publicideas.component';

const childRoutes: Routes = [
  {
    path: '',
    component: AllPublicideasComponent
  }
]

export const routing = RouterModule.forChild(childRoutes);
