import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NzInputModule } from 'ng-zorro-antd/input';
import { BaseDynamicControl, dynamicControlProvider, sharedDynamicControlDeps } from '../base-dynamic-control';

@Component({
  selector: 'app-dynamic-percent-input',
  standalone: true,
  imports: [...sharedDynamicControlDeps, NzInputModule ],
  viewProviders: [dynamicControlProvider],
  templateUrl: './dynamic-percent-input.component.html',
  styleUrls: ['./dynamic-percent-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicPercentInputComponent  extends BaseDynamicControl {

}
