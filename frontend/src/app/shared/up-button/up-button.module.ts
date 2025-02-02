import {NgModule} from '@angular/core';
import {NgIf} from "@angular/common";

import {UpButtonComponent} from "./up-button.component";
import {SharedModule} from "../shared.module";

@NgModule({
  declarations: [UpButtonComponent],
  imports: [
    SharedModule,
    NgIf
  ],
  exports: [
    UpButtonComponent
  ]
})
export class UpButtonModule {
}
