import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TriggerActionService {
    canTriggerAction: boolean = false;
    isInflationSettings = new BehaviorSubject(false);

    constructor() {
    }

    switchInflationSettings(toggle: boolean): void {
        this.isInflationSettings.next(toggle)
    }
}
