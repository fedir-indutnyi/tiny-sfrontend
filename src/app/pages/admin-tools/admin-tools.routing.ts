import {RouterModule, Routes} from '@angular/router';
import {AdminToolsComponent} from "./admin-tools.component";




const childRoutes: Routes = [
  {
    path: 1===1 ? '' : 'err',
    component: AdminToolsComponent
  }
]

export const routing = RouterModule.forChild(childRoutes);
