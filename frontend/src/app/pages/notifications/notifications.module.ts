import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";

import {routing} from './notifications.routing';
import {NotificationsComponent} from "./notifications.component";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzNotificationService} from "ng-zorro-antd/notification";

@NgModule({
  imports: [routing, NzTableModule, CommonModule, NzButtonModule, NzIconModule, TranslateModule],
  providers: [NzNotificationService],
  declarations: [NotificationsComponent]
})

export class NotificationsModule {
}
