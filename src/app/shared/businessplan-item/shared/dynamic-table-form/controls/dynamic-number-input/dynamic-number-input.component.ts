import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { BaseDynamicControl, dynamicControlProvider, sharedDynamicControlDeps } from '../base-dynamic-control';

@Component({
  selector: 'app-dynamic-number-input',
  standalone: true,
  imports: [...sharedDynamicControlDeps, NzInputNumberModule],
  viewProviders: [dynamicControlProvider],
  templateUrl: './dynamic-number-input.component.html',
  styleUrls: ['./dynamic-number-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicNumberInputComponent extends BaseDynamicControl {

}
