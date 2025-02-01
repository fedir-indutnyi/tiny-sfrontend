import { Routes, RouterModule } from '@angular/router';
import { EditCreateTeamComponent } from './edit-create-team.component';

const childRoutes: Routes = [
  {
    path: '',
    component: EditCreateTeamComponent
  }
];

export const routing = RouterModule.forChild(childRoutes);
