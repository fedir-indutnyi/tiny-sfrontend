import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzEmptyModule } from 'ng-zorro-antd/empty';


import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';

import { NZ_ICONS, NzIconModule } from 'ng-zorro-antd/icon';

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};

const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => {
  return antDesignIcons[key];
});

@NgModule({
  imports: [
    CommonModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzButtonModule,
    NzTypographyModule,
    NzMessageModule,
    NzCheckboxModule,
    NzPageHeaderModule,
    NzCardModule,
    NzIconModule,
    NzBreadCrumbModule,
    NzModalModule,
    NzTableModule,
    NzSelectModule,
    NzPopoverModule,
    NzDividerModule,
    NzPopconfirmModule,
    NzBadgeModule,
    NzToolTipModule,
    NzGridModule,
    NzSpaceModule,
    NzDatePickerModule,
    NzListModule,
    NzEmptyModule
  ],
  exports: [
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzButtonModule,
    NzTypographyModule,
    NzMessageModule,
    NzCheckboxModule,
    NzPageHeaderModule,
    NzCardModule,
    NzIconModule,
    NzBreadCrumbModule,
    NzModalModule,
    NzTableModule,
    NzSelectModule,
    NzPopoverModule,
    NzDividerModule,
    NzPopconfirmModule,
    NzBadgeModule,
    NzToolTipModule,
    NzGridModule,
    NzSpaceModule,
    NzDatePickerModule,
    NzListModule,
    NzEmptyModule
  ],
  providers: [
    {
      provide: NZ_ICONS,
      useValue: icons
    }
  ]
})
export class NgZorroModule {
}
