import { Injectable } from '@angular/core';

import { AccelerateTrendHandler, AccelerationSettings } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class LogarithmicTrendService implements AccelerateTrendHandler {
  private settings: AccelerationSettings
  constructor() { }

  setData(setting: AccelerationSettings): void {
    this.settings = setting;
  }

  calculateTrend(): { x: number[]; y: number[]; } {
    return this.calculateLogarithmicTrend();
  }

  private calculateLogarithmicTrend(): { x: number[]; y: number[]; } {
    let trend = LogarithmicTrendService.generateLogarithmicTrend({
      monthsSales: this.settings.monthsSales,
      expectedGrowthSalesAtMonth: this.settings.expectedGrowthSalesAtMonth,
      periodDuration: this.settings.periodDuration,
    })
    console.log(trend);
    return {
      x: trend.xValues,
      y: trend.yValues
    };
  }


  private static generateLogarithmicTrend({ monthsSales, expectedGrowthSalesAtMonth, periodDuration }: AccelerationSettings): { xValues: number[]; yValues: number[]; } {
    let xValues = [];
    let yValues = [];

    let prevMonthSales = 0;
    let nextMonthSales = prevMonthSales + 1;
    let prevMonthGrowth = monthsSales[prevMonthSales] ;
    let nextMonthGrowth = monthsSales[nextMonthSales] ;

    periodDuration.forEach((periodIndex) => {

      let x = periodIndex;
      let y = 0;
      let growthFactor = 0;

      if (periodIndex < prevMonthGrowth && prevMonthSales === 0) {
        yValues.push(0);
        xValues.push(x);
        return;
      }

      const prevExpectedGrowthSales = expectedGrowthSalesAtMonth[prevMonthSales];
      const nextExpectedGrowthSales = expectedGrowthSalesAtMonth[nextMonthSales];

      growthFactor = Math.pow(nextMonthGrowth, (1 / (nextExpectedGrowthSales - prevExpectedGrowthSales)));
      growthFactor = Number(growthFactor.toFixed(4));

      y = Math.log(periodIndex + 1 - prevMonthGrowth) / Math.log(growthFactor) + prevExpectedGrowthSales;
      y = Number(y.toFixed(3));
      yValues.push(y);
      xValues.push(x);


      if (periodIndex >= nextMonthGrowth) {
        prevMonthSales++;
        nextMonthSales++;
        prevMonthGrowth = monthsSales[prevMonthSales] ;
        nextMonthGrowth = monthsSales[nextMonthSales] ;
        if (!monthsSales[nextMonthSales]) {
          --prevMonthSales;
          --nextMonthSales;
          prevMonthGrowth = monthsSales[prevMonthSales] ;
          nextMonthGrowth = monthsSales[nextMonthSales] ;
        }
      }

    });

    return {
      xValues: xValues,
      yValues: yValues
    };
  }
}
