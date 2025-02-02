import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzCommentModule} from "ng-zorro-antd/comment";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import { SharedModule } from '@shared/shared.module';
import { PostSingleComponent } from './post-single.component';
import { routing } from './post-single.routing';
import {PostItemModule} from "@shared/post-item/post-item.module";
import {TranslateModule} from "@ngx-translate/core";
import {MatButtonModule} from "@angular/material/button";
import {BusinessplanItemModule} from "@businessplan-item/businessplan-item.module";
import {PnlDataPostComponent} from "@shared/pnl-data-post/pnl-data.post.component";
import {PnlDataGetComponent} from "@shared/pnl-data-get/pnl-data-get.component";
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import {ChartsAndGraphsComponent} from "@shared/charts-and-graphs/charts-and-graphs.component";

@NgModule({
    imports: [CommonModule,
      SharedModule,
      routing,
      ReactiveFormsModule,
      FormsModule,
      PostItemModule,
      NzCommentModule,
      NzAvatarModule,
      TranslateModule,
      MatButtonModule,
      BusinessplanItemModule,
      PnlDataPostComponent,
      PnlDataGetComponent,
      NzTableModule,
      NzUploadModule,
      NzMessageModule,
      NzDropDownModule,
        ChartsAndGraphsComponent,
    ],
  declarations: [PostSingleComponent]
})
export class PostSingleModule {}
