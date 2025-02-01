import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routing } from './profile.routing';
import { SharedModule } from '../../shared/shared.module';
import { ProfileComponent } from './profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgZorroModule } from '../../shared/ng-zorro/ng-zorro.module';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { TranslateModule } from "@ngx-translate/core";

// Import required ng-zorro modules
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageModule } from 'ng-zorro-antd/message';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    routing,
    TranslateModule,
    // Add ng-zorro modules
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzFormModule,
    NzInputModule,
    NzDividerModule,
    NzGridModule,
    NzDescriptionsModule,
    NzBadgeModule,
    NzToolTipModule,
    NzModalModule,
    NzMessageModule
  ],
  declarations: [
    ProfileComponent,
    EditProfileComponent
  ]
})
export class ProfileModule { }
