import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { SharedModule } from "./shared.module";
import {FormsModule} from "@angular/forms";

import { GlobalService } from "./services/global.service";
import { NotificationComponent } from "./components/notification/notification.component";
import { LoadingComponent } from "./components/loading/loading.component";
import { MenuComponent } from "./layouts/menu/menu.component";
import { SidebarComponent } from "./layouts/sidebar/sidebar.component";
import { PagesTopComponent } from "./layouts/pages-top/pages-top.component";
import { RightConfigComponent } from "./layouts/right-config/right-config.component";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {TranslateModule} from "@ngx-translate/core";
import {NzAvatarModule} from "ng-zorro-antd/avatar";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    FormsModule,
    NzDropDownModule,
    TranslateModule,
    NzAvatarModule
  ],
  providers: [GlobalService],
  declarations: [
    MenuComponent,
    SidebarComponent,
    PagesTopComponent,
    NotificationComponent,
    RightConfigComponent,
    LoadingComponent,
  ],
  exports: [
    SidebarComponent,
    PagesTopComponent,
    NotificationComponent,
    RightConfigComponent,
    LoadingComponent,
  ],
})
export class LayoutModule {}
