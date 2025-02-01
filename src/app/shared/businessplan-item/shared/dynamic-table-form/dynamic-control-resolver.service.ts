import { Injectable, Type } from '@angular/core';
import { from, of, tap } from 'rxjs';
import { iDynamicControl } from './models';

type iDynamicControlsMap = {
  [T in iDynamicControl['controlType']]: () => Promise<Type<any>>;
};

@Injectable({
  providedIn: 'root'
})
export class DynamicControlResolver {
  private lazyControlComponents: iDynamicControlsMap = {
    numberInput: () => import('./controls/dynamic-number-input/dynamic-number-input.component').then(c => c.DynamicNumberInputComponent),
    select: () => import('./controls/dynamic-select/dynamic-select.component').then(c => c.DynamicSelectComponent),
    percentInput: () => import('./controls/dynamic-percent-input/dynamic-percent-input.component').then(c => c.DynamicPercentInputComponent),
    textarea: () => import('./controls/dynamic-textarea/dynamic-textarea.component').then(c => c.DynamicTextareaComponent),
    textInput: () => import('./controls/dynamic-text-input/dynamic-text-input.component').then(c => c.DynamicTextInputComponent),
    checkbox: () => import('./controls/dynamic-checkbox/dynamic-checkbox.component').then(c => c.DynamicCheckboxComponent)
  }

  private loadedControlComponents = new Map<string, Type<any>>();

  resolve(controlType: keyof iDynamicControlsMap) {
    const loadedComponent = this.loadedControlComponents.get(controlType);
    if (loadedComponent) {
      return of(loadedComponent);
    }
    return from(this.lazyControlComponents[controlType]()).pipe(
      tap(comp => this.loadedControlComponents.set(controlType, comp))
    );
  }
}
