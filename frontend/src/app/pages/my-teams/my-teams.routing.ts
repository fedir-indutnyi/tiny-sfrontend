import { Routes, RouterModule } from '@angular/router';
import { MyTeamsComponent } from './my-teams.component';

const childRoutes: Routes = [
  {
    path: '',
    component: MyTeamsComponent
  }
];

export const routing = RouterModule.forChild(childRoutes);
