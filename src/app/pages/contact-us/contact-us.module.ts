import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ContactUsComponent } from './contact-us.component';
import { routing } from './contact-us.routing';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule, 
    SharedModule, 
    FormsModule,
    ReactiveFormsModule,
    routing,
    TranslateModule
  ],
  declarations: [ContactUsComponent]
})
export class ContactUsModule {}
