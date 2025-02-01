import { Validators } from "@angular/forms";
import { Observable } from "rxjs";

export interface iDynamicOptions {
  label: string;
  value: string;
}

type validatorKeys  = keyof Omit<typeof Validators , 'prototype' | "nullValidator" | "compose" | "composeAsync" | "requiredTrue">
export interface iDynamicControl<T = string> extends iDynamicControlActions, iDynamicTableFormStyle {
  controlType: 'numberInput' | 'textInput' | 'percentInput' | 'select' | 'textarea' | 'checkbox';
  label: string;
  value: T | null;
  type?: string;
  options?: iDynamicOptions[];
  validators?: { [key in validatorKeys]?: unknown },
  order?: number;

}

export interface iDynamicControlActions {
  propagateValueTo?: (value) => {controlName: string, value: any};
}

export interface iDynamicTableFormStyle {
  width?: number;
}


export interface iDynamicTableFormConfig<T = string> {
  controls: {
    [key: string]: iDynamicControl<T>;
  }

}

export interface iDynamicTableDataSource {
  [key: string]: string | number | boolean | null;
}
