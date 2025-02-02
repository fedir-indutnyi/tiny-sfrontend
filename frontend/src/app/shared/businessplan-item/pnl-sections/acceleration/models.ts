import { Type } from "@angular/core";
import { Observable } from "rxjs";

export interface AccelerationTrend {
  applyChanges: () => void;
  onApply: Observable<any>;
  monthSales: number[];
  growthSales: number[];
}

export interface AccelerateTrendHandler {
  setData(settings: AccelerationSettings): void;

  calculateTrend(): { x: number[]; y: number[]; }
}

export interface AccelerationTrendRecord<C> {
  type: string;
  component: Type<any>;
  service: AccelerateTrendHandler;
}

export interface AccelerationSettings {
  monthsSales: number[],
  expectedGrowthSalesAtMonth: number[],
  periodDuration: number[]
}

export type AccelerateTrendData = Omit<AccelerationSettings, 'periodDuration'>;
