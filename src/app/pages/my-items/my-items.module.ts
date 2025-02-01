import {NgModule} from '@angular/core';
import {MyItemsComponent} from './my-items.component';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {routing} from './my-items.routing';
import {PostItemModule} from '../../shared/post-item/post-item.module';
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {NzModalModule} from 'ng-zorro-antd/modal';
import {UpButtonModule} from "../../shared/up-button/up-button.module";
import {TranslateModule} from "@ngx-translate/core";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {FormsModule} from "@angular/forms";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
    imports: [CommonModule, SharedModule, routing, PostItemModule, NzTabsModule, NzModalModule, UpButtonModule, TranslateModule, NzRadioModule, FormsModule, InfiniteScrollModule, MatButtonModule],
  declarations: [MyItemsComponent]
})
export class MyItemsModule {
}
