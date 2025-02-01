import { CommonModule, KeyValue } from "@angular/common";
import { Directive, HostBinding, inject, OnInit, StaticProvider } from "@angular/core";
import { AbstractControl, ControlContainer, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { iDynamicControl } from "../models";
import { CONTROL_DATA } from "../control-data.token";

export const comparatorFn = (
  a: KeyValue<string, iDynamicControl>,
  b: KeyValue<string, iDynamicControl>
): number => a.value.order - b.value.order;

export const sharedDynamicControlDeps = [CommonModule, ReactiveFormsModule];

export const dynamicControlProvider: StaticProvider = {
  provide: ControlContainer,
  useFactory: () => inject(ControlContainer, { skipSelf: true })
}

@Directive()
export class BaseDynamicControl implements OnInit {
  @HostBinding('class') hostClass = 'form-field';

  control = inject(CONTROL_DATA);

  formControl: AbstractControl = new FormControl(
    this.control.controlValue || this.control.config.value,
    this.resolveValidators(this.control.config),
  )


  private parentGroupDir = inject(ControlContainer);

  ngOnInit() {
    if (!this.parentGroupDir.control) return;

    (this.parentGroupDir.control as FormGroup).addControl(
      this.control.controlKey,
      this.formControl,
    )

    this.formControl.valueChanges.subscribe(v => {
      if (!this.control.config.propagateValueTo) return;

      if(this.control.config.options) {
        v = this.control.config.options.find(option => option.value === v).label;
      }

      let {controlName, value} = this.control.config.propagateValueTo?.(v);
      (this.parentGroupDir.control as FormGroup).controls[controlName]?.patchValue(value, { emitEvent: false });
    });

  }


  private resolveValidators({ validators = {} }: iDynamicControl) {
    return (Object.keys(validators) as Array<keyof typeof validators>).map(validatorKey => {
      const validatorValue = validators[validatorKey];
      if (validatorKey === 'required') {
        return Validators.required;
      }
      if (validatorKey === 'email') {
        return Validators.email;
      }

      if (validatorKey === 'minLength' && typeof validatorValue === 'number') {
        return Validators.minLength(validatorValue);
      }
      return Validators.nullValidator;
    })
  }
}
