import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routing} from './admin-tools.routing';
import {AdminToolsComponent} from "./admin-tools.component";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {FormsModule} from "@angular/forms";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzButtonModule} from "ng-zorro-antd/button";


@NgModule({
  declarations: [AdminToolsComponent],
  imports: [
    CommonModule,
    routing,
    NzTabsModule,
    NzTableModule,
    NzDividerModule,
    FormsModule,
    NzDropDownModule,
    NzIconModule,
    NzInputModule,
    NzButtonModule,
  ],
})
export class AdminToolsModule { }
