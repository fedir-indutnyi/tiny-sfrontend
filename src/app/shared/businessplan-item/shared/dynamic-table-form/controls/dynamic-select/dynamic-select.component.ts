import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { BaseDynamicControl, dynamicControlProvider, sharedDynamicControlDeps } from '../base-dynamic-control';

@Component({
  selector: 'app-dynamic-select',
  standalone: true,
  imports: [...sharedDynamicControlDeps, NzSelectModule],
  viewProviders: [dynamicControlProvider],
  templateUrl: './dynamic-select.component.html',
  styleUrls: ['./dynamic-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicSelectComponent extends BaseDynamicControl {

}
