import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {QuillModule} from 'ngx-quill'

import {EditCreatePostComponent} from './edit-create-post.component';
import {routing} from "./edit-create-post.routing";
import {SharedModule} from '@shared/shared.module';
import {BusinessplanItemModule} from "@businessplan-item/businessplan-item.module";
import {ModalHandlerWindowModule} from "@shared/modal-handler-window/modal-handler-window.module";
import {TranslateModule} from "@ngx-translate/core";
import {MatLegacyChipsModule} from "@angular/material/legacy-chips";
import {PnlDataPostComponent} from "@shared/pnl-data-post/pnl-data.post.component";

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        routing,
        FormsModule,
        ReactiveFormsModule,
        QuillModule.forRoot(),
        BusinessplanItemModule,
        ModalHandlerWindowModule,
        TranslateModule,
        MatLegacyChipsModule,
        PnlDataPostComponent,
    ],
  declarations: [EditCreatePostComponent],
  exports: [
    EditCreatePostComponent
  ],
  providers: [/* FileUploadService */]
})
export class EditCreatePostModule {
}

