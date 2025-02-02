import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '@shared/shared.module';
import {UpButtonModule} from "@shared/up-button/up-button.module";
import {TranslateModule} from "@ngx-translate/core";

import {MyTeamsComponent} from './my-teams.component';
import {routing} from './my-teams.routing';
import {NzListModule} from "ng-zorro-antd/list";
import {NzBadgeModule} from "ng-zorro-antd/badge";
import {MatButtonModule} from "@angular/material/button";
import {MatChipsModule} from "@angular/material/chips";
import {MatLegacyChipsModule} from "@angular/material/legacy-chips";
import {CdkFixedSizeVirtualScroll, ScrollingModule} from "@angular/cdk/scrolling";
import {NzSkeletonModule} from "ng-zorro-antd/skeleton";

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        routing,
        NzListModule,
        NzBadgeModule,
        TranslateModule,
        UpButtonModule,
        MatButtonModule,
        MatChipsModule,
        MatLegacyChipsModule,
        CdkFixedSizeVirtualScroll,
        NzSkeletonModule,
        ScrollingModule,
    ],
    declarations: [MyTeamsComponent]
})
export class MyTeamsModule {
}
