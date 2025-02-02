import { InjectionToken } from "@angular/core";
import { iDynamicControl } from "./models";

export interface ControlData {
  controlKey: string;
  config: iDynamicControl;
  controlRow: number;
  controlValue:  string | number  | null
}

export const CONTROL_DATA = new InjectionToken<ControlData>('Control Data');
