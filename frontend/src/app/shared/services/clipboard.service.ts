import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClipboardService {

  put(value: string): Promise<void> {
    return navigator.clipboard.writeText(value);
  }

  get(): Promise<string> {
    return navigator.clipboard.readText();
  }
}
