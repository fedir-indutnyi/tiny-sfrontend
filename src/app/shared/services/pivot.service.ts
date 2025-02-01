import { Injectable } from "@angular/core";
@Injectable()
export class PivotService {

  static normalizePivot(pivotData) {

    const pivotClone = pivotData.flat(3);

    const rowHeaders = pivotData.rowHeaders.flat(2);
    const columnHeaders = pivotData.columnHeaders
                                   .flat(2)
                                   .map((dateString: string) => {
                                     return new Date(dateString).toLocaleDateString();
                                   });

    pivotClone.rowHeaders = rowHeaders;
    pivotClone.columnHeaders = columnHeaders;

    return pivotClone;
  }

  static getFieldsWithBasicOptions(normalizedPivotData) {
    const basicRowOptions = { field: 'pnlrow', sort: 'asc', showAll: true, agregateType: 'distinct' };
    const basicColumnOptions = { field: 'datehappened', sort: 'asc', showAll: true, agregateType: 'distinct' };

    const fields = {};

    normalizedPivotData.rowHeaders
                       .forEach((rowHeader: string) => {
                         fields[rowHeader] = basicRowOptions;
                       });

    normalizedPivotData.columnHeaders
                       .forEach((columnHeader: string) => {
                         fields[columnHeader] = basicColumnOptions;
                       });

    return fields;
  }
}
