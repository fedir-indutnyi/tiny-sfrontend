import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TsvConverterService {

  toTsv<T>(data: T[]): string {

    const headings = Object.keys(data[0]).join('\t');
    const rows = data.reduce((acc, c) => {
      return acc.concat([Object.values(c).join('\t')]);
    }, []).join('\n');

    return `${headings}\n${rows}`;
  }

  fromTsv<T>(data: string, requiredFields?: string[]): T[] {

    const lines = data.split("\n");
    const result = [];
    const headers = lines[0].split("\t");
    const hasProperFormat = (obj, reqKeys) => !reqKeys || reqKeys.every(key => key in obj);

    for(let i = 1; i < lines.length-1; i++) {
        const obj = {};
        const currentline = lines[i].split("\t");
        for(let j = 0; j < headers.length; j++) {
          if(headers[j].length) {
            const key = headers[j].replace(/\r/g, '');
            const value = currentline[j].replace(/\r/g, '');
            obj[key] = convertToProperType(value);
          }
        }
        if(hasProperFormat(obj, requiredFields)) {
          result.push(obj);
        }
    }

    return result;
  }
}

const convertToProperType = (value: string) => {
  if (!isNaN(Number(value))) return Number(value);
  else if (value.toLowerCase() == 'true' || value.toLowerCase() == 'false') 
    return value.toLowerCase() == 'true' ;
  else return value;
}
