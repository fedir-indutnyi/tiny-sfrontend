import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NzInputModule } from 'ng-zorro-antd/input';
import { BaseDynamicControl, dynamicControlProvider, sharedDynamicControlDeps } from '../base-dynamic-control';

@Component({
  selector: 'app-dynamic-text-input',
  standalone: true,
  imports: [...sharedDynamicControlDeps, NzInputModule],
  viewProviders: [dynamicControlProvider],
  templateUrl: './dynamic-text-input.component.html',
  styleUrls: ['./dynamic-text-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicTextInputComponent extends BaseDynamicControl {

}
