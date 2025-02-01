import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PostItemComponent} from './post-item.component';
import {NgZorroModule} from '../ng-zorro/ng-zorro.module';

@NgModule({
  declarations: [ PostItemComponent ],
  imports: [
    CommonModule,
    NgZorroModule
  ],
  exports: [ PostItemComponent ],
})
export class PostItemModule {
}
