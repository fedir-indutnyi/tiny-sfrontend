import { Injectable } from '@angular/core';
import { AccelerateTrendHandler, AccelerationSettings } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class LinealTrendService implements AccelerateTrendHandler {
  private settings: AccelerationSettings

  constructor() {

  }

  setData(settings: AccelerationSettings): void {
    this.settings = settings;
  }

  calculateTrend(): { x: number[]; y: number[]; } {
    return this.calculateLinearTrend();
  }

  private calculateLinearTrend(): { x: number[]; y: number[]; } {
    let trend = LinealTrendService.generateLinearTrend({
      monthsSales: this.settings.monthsSales,
      expectedGrowthSalesAtMonth: this.settings.expectedGrowthSalesAtMonth,
      periodDuration: this.settings.periodDuration,
    })
    return {
      x: trend.xValues,
      y: trend.yValues
    };
  }


  private static generateLinearTrend({ monthsSales, expectedGrowthSalesAtMonth, periodDuration }: AccelerationSettings): { xValues: number[]; yValues: number[]; } {
    let xValues = [];
    let yValues = [];

    let shiftedMonthsSales: number = monthsSales.slice(0)[0];
    let prevMonthSales = 0;
    let nextMonthSales = prevMonthSales + 1;
    let prevMonthGrowth = monthsSales[prevMonthSales];
    let nextMonthGrowth = monthsSales[nextMonthSales] + shiftedMonthsSales - 1;


    periodDuration.forEach((periodIndex) => {

      let x = periodIndex;
      let y = 0;
      let growthFactor = 0;

      const prevExpectedGrowthSales = expectedGrowthSalesAtMonth[prevMonthSales];
      const nextExpectedGrowthSales = expectedGrowthSalesAtMonth[nextMonthSales];
      growthFactor = (nextExpectedGrowthSales - prevExpectedGrowthSales) / (nextMonthGrowth - prevMonthGrowth);
      growthFactor = Number(growthFactor.toFixed(4));

      if (periodIndex < prevMonthGrowth && prevMonthSales === 0) {
        yValues.push(0);
        xValues.push(x);
        return;
      }

      if (periodIndex === prevMonthGrowth) {
        growthFactor = prevExpectedGrowthSales;
        y = (x - prevMonthGrowth) * growthFactor + prevExpectedGrowthSales;
        y = Number(y.toFixed(3));
        yValues.push(y);
        xValues.push(x);
        return;
      }

      y = (x - prevMonthGrowth) * growthFactor + prevExpectedGrowthSales;
      y = Number(y.toFixed(3));
      yValues.push(y);
      xValues.push(x);


      if (periodIndex >= nextMonthGrowth) {
        prevMonthSales++;
        nextMonthSales++;
        prevMonthGrowth = monthsSales[prevMonthSales] + shiftedMonthsSales - 1;
        nextMonthGrowth = monthsSales[nextMonthSales] + shiftedMonthsSales - 1;
        if (!monthsSales[nextMonthSales]) {
          --prevMonthSales;
          --nextMonthSales;
          prevMonthGrowth = monthsSales[prevMonthSales] + shiftedMonthsSales - 1;
          nextMonthGrowth = monthsSales[nextMonthSales] + shiftedMonthsSales - 1;
        }
      }

    });


    return {
      xValues: xValues,
      yValues: yValues
    };
  }

}
