import { Routes, RouterModule } from '@angular/router';

import {NotificationsComponent} from "./notifications.component";

const childRoutes: Routes = [
  {
    path: '',
    component: NotificationsComponent
  }
];

export const routing = RouterModule.forChild(childRoutes);
