import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NzInputModule } from 'ng-zorro-antd/input';
import { BaseDynamicControl, dynamicControlProvider, sharedDynamicControlDeps } from '../base-dynamic-control';

@Component({
  selector: 'app-dynamic-textarea',
  standalone: true,
  imports: [...sharedDynamicControlDeps, NzInputModule ],
  viewProviders: [dynamicControlProvider],
  templateUrl: './dynamic-textarea.component.html',
  styleUrls: ['./dynamic-textarea.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicTextareaComponent extends BaseDynamicControl {

}
