import {NgModule} from '@angular/core';

import {ModalHandlerWindowComponent} from "./modal-handler-window.component";
import {SharedModule} from "../shared.module";
// import {routing} from "./modal-handler-window.routing";

@NgModule({
  declarations: [ModalHandlerWindowComponent],
  imports: [
    SharedModule
    // routing
  ],
  exports: [
    ModalHandlerWindowComponent
  ]
})
export class ModalHandlerWindowModule {
}
