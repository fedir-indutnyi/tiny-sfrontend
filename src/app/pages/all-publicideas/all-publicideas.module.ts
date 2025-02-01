import { NgModule } from '@angular/core';
import { AllPublicideasComponent } from './all-publicideas.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { routing } from './all-publicideas.routing';
import {PostItemModule} from '../../shared/post-item/post-item.module';
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {FormsModule} from "@angular/forms";
import {UpButtonModule} from "../../shared/up-button/up-button.module";
import {TranslateModule} from "@ngx-translate/core";
import {InfiniteScrollModule} from "ngx-infinite-scroll";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    routing,
    PostItemModule,
    NzTabsModule,
    FormsModule,
    UpButtonModule,
    TranslateModule,
    InfiniteScrollModule,
  ],
  declarations: [AllPublicideasComponent]
})
export class AllPublicideasModule {}
