import { inject, Injector, Pipe, PipeTransform } from '@angular/core';
import { CONTROL_DATA } from './control-data.token';
import { iDynamicControl } from './models';

@Pipe({
  name: 'controlInjector',
  standalone: true
})
export class ControlInjectorPipe implements PipeTransform {

  injector = inject(Injector);

  transform(controlKey: string, config: iDynamicControl, controlValue: {[key: string]: string | number  | null} ): Injector {
    return Injector.create({
      parent: this.injector,
      providers: [
        {
          provide: CONTROL_DATA,
          useValue: { controlKey, config, controlValue: controlValue ? controlValue[controlKey] : null }
        }
      ]
    });
  }

}
