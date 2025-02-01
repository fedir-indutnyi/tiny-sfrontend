import { FormControl } from "@angular/forms";
import {Pnldata} from "@shared/sdk";
import { ProductsService } from "./typings";

export function recalculateCostPrice(businessplansettings: any, portfolio: any): any {
  var result = "a"
  //logic:
  //1. loop through columns of cost price, and add/remove columns for time periods, while populating data as per rules in CostPrice
  //2. Mark thise row as "modified"
  return result;
};

export const getTradeMarkup = (primeCost: number, price: number): number | null => {
  if (!primeCost && !price) return null;
  return Number.parseFloat(((-1 + price / primeCost) * 100).toFixed(2));
}

export const getTradeMargin = (primeCost: number, price: number): number | null => {
  if (!primeCost && !price) return null;
  return Number.parseFloat((((price - primeCost) / price) * 100).toFixed(2));
}

export const getMonthlyCustomerConversionFromEachN = (monthlyConversionUserThatBuys: number | null, conversion: number | null = 1, ): number | null => {
  if (!Number.isFinite(conversion) && !Number.isFinite(monthlyConversionUserThatBuys)) return null;
  return (Number.parseFloat(displayInPercentage(conversion / monthlyConversionUserThatBuys).toFixed(4)));
}

export const getEachNUserThatBuys = (monthlyConversionUserThatBuys: number | null, conversion: number | null = 1, ): number | null => {
  if (!Number.isFinite(conversion) && !Number.isFinite(monthlyConversionUserThatBuys)) return null;
  return Number.parseFloat((conversion / monthlyConversionUserThatBuys).toFixed(2)) ;
}

export const getMonthlyCustomerConvertionFromAbsoluterNumber = 
(numberOfCustomersThatBuyes: number , numberOfCustomers: number): number => {
  return Number.parseFloat((numberOfCustomersThatBuyes / numberOfCustomers).toFixed(4)) ;
}

export const getAbsoluteCustomerNumberFromCustomerConversion = 
(customerConverion: number, numberOfCustomers: number): number => {
  return Number.parseFloat((numberOfCustomers * customerConverion).toFixed(2)) ;
}

export const getTotalMonthlyCustomers = (visitors: number | null, conversion: number | null): number | null => {
  if (!Number.isFinite(visitors) && !Number.isFinite(conversion)) return null;
  return Number.parseFloat((visitors * conversion).toFixed(2));
}

export const getTotalActiveMonthlyCustomers = (visitors: number | null, monthlyConversionUserThatBuys: number | null): number | null => {
  if (!Number.isFinite(visitors) && !Number.isFinite(monthlyConversionUserThatBuys)) return null;
  return Number.parseFloat((visitors * monthlyConversionUserThatBuys).toFixed(2));
}

export const getUserThatBuysMonthlyConversion = (conversion: number | null, eachNCustomers: number | null): number | null => {
  if (!Number.isFinite(conversion) && !Number.isFinite(eachNCustomers)) return null;
  return conversion / eachNCustomers;
}

export const getTotalUnits = (ordersPerCustomers: number | null, customers: number | null): number | null => {
  if (!Number.isFinite(ordersPerCustomers) && !Number.isFinite(customers)) return null;
  let totalUnits = (ordersPerCustomers * customers).toFixed(2)
  return Number(totalUnits);
}


export const getTotalAssetValue = (numberOfMonthsForInitialStock: number, cost: number | null, unitsVolume: number): number | null => {
  if (!Number.isFinite(numberOfMonthsForInitialStock) && !Number.isFinite(cost) && !Number.isFinite(unitsVolume)) return null; 
  return numberOfMonthsForInitialStock * cost * unitsVolume;
}

export const validateFromPercentage = (val: number): number => {
  // if (val > 1) return val / 100;
  return Number((val / 100).toFixed(7));
}

export const displayInPercentage = (val: number, fn?: ()=>{}): number => {
  // if (val === 1) return 100;
  // if (val > 1) return val;
  return Number((val * 100).toFixed(2));
}

export const calcYearlyRatesForYears = function(yearlyRate: number, multiplier: number){
  return Number.parseFloat(`${yearlyRate * multiplier}`).toFixed(2);
}

export function initializeInflationMultipliersFormArr(years: number, inflationMultipliers?: number[]): FormControl<number>[]{
  var multiplierControls: FormControl<number>[] = new Array(years);

  if (inflationMultipliers.length){
    for (let index = 0; index < years; index++) {
      if(inflationMultipliers[index]) multiplierControls[index] = new FormControl(inflationMultipliers[index]);
      else multiplierControls[index] = new FormControl(1);
    }
    return multiplierControls;
  }

  for (let index = 0; index < years; index++) {
    multiplierControls[index] = new FormControl(1);
  }
  return multiplierControls;

}

export const mappedDataForPivot = (data: Pnldata[], title: string) => {
  const dataSummedByDate = getDataSummedByMonth(data);
  return {
    [title]: dataSummedByDate
  }
}

export const transformMappedDataForPivot = (objData: { [key: string]: { [key: string]: number } }) => {
  let result = [];
  Object.entries(objData).forEach(([title, item]) => {
    Object.entries(item).forEach(([date, amount]) => {
      result.push({
        title: title,
        date: date.substring(0, 7),
        year: new Date(date).getFullYear(),
        amount: amount
      })
    })
  })
  return result;
}


export const getDataSummedByMonth = (dataSource: Pnldata[]) => {
  let result = {};

  dataSource.forEach((item) => {
    let currentAmount = result[item.factdate]
    result[item.factdate] = result[item.factdate] ? currentAmount + item.factvalue: item.factvalue
  });
  return result;
}

export const convertToDifferentCustomerMetrics = (product: ProductsService, customerCalculationMethod: string = "each", numberOfCustomers: number) => {
  switch (customerCalculationMethod) {
    case 'each':
      product.monthlyConversionUserThatBuys = validateFromPercentage(getMonthlyCustomerConversionFromEachN(product.eachNCustomerBuys))
      product.absoluteCountValues = 
        getAbsoluteCustomerNumberFromCustomerConversion(product.monthlyConversionUserThatBuys, numberOfCustomers)
    break;
    case 'procent':
      product.eachNCustomerBuys = getEachNUserThatBuys(product.monthlyConversionUserThatBuys)
      product.absoluteCountValues = 
        getAbsoluteCustomerNumberFromCustomerConversion(product.monthlyConversionUserThatBuys, numberOfCustomers)
    break;
    case 'absolute':
      product.monthlyConversionUserThatBuys = 
        getMonthlyCustomerConvertionFromAbsoluterNumber(product.absoluteCountValues, numberOfCustomers);
      product.eachNCustomerBuys = getEachNUserThatBuys(product.monthlyConversionUserThatBuys)
    break;
  }
  return product;
}