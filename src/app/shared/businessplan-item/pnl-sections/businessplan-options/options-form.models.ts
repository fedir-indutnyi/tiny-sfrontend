import { FormArray, FormControl } from "@angular/forms";

interface IRecordTypeDict {
  type: string
  typeTitle: string
}

export const CurrencyDict = ['UAH', 'USD', 'EUR', 'PLN', 'GBP'];

export const RecordTypeDict: IRecordTypeDict[] = [
  {'type': 'idea', 'typeTitle': 'Idea'},
  {'type': 'dream', 'typeTitle': 'Dream'},
  {'type': 'startup', 'typeTitle': 'Startup'},
  {'type': 'businessplan', 'typeTitle': 'Business plan'}];

export const CategoriesDict = ['Online SAAS', 'Retail Shop', 'School', 'Online Courses/Webinars']

export const DEFAULT_YEARLY_INFLATION: number = 0.1;
export const DEFAULT_UOM: string = 'EACH';
export const DEFAULT_YEARLY_PRICE_INCREASE: number = 0.1;
export const DEFAULT_YEARLY_SALARY_INCREASE: number = 0.1;

