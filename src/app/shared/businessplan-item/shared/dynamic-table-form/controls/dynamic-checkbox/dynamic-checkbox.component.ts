import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { BaseDynamicControl, dynamicControlProvider, sharedDynamicControlDeps } from '../base-dynamic-control';

@Component({
  selector: 'app-dynamic-checkbox',
  standalone: true,
  imports: [...sharedDynamicControlDeps, NzCheckboxModule ],
  viewProviders: [dynamicControlProvider],
  templateUrl: './dynamic-checkbox.component.html',
  styleUrls: ['./dynamic-checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicCheckboxComponent  extends BaseDynamicControl{

}
