import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {addDays, isAfter} from 'date-fns';

const PERIOD_IN_DAYS = 30;

@Injectable()
export class GlobalService {
    private dataSource = new Subject<DataSourceClass>();
    isDonationMessage = new BehaviorSubject(false);

    checkDonateExpAt(): void {
        const dmExpAtStr = localStorage.getItem("dmExpAt");
        const dmExpAt = dmExpAtStr && JSON.parse(dmExpAtStr);
        if (!dmExpAt || isAfter(new Date().getTime(), dmExpAt)) {
            const currentTimeStr = !dmExpAt && new Date().getTime().toString();
            !dmExpAt && localStorage.setItem("dmExpAt", currentTimeStr);
            this.isDonationMessage.next(true)
        }
    };

    renewDateToDonateExpAt(): void {
        const expTime = addDays(new Date(), PERIOD_IN_DAYS).getTime().toString()
        localStorage.setItem("dmExpAt", expTime);
    };

    onCloseDonate(): void {
        this.renewDateToDonateExpAt()
        this.isDonationMessage.next(false)
    }

    public dataBusChanged(ev, value) {
        this.dataSource.next({
            ev: ev,
            value: value
        });
    };

    data$ = this.dataSource.asObservable();
}

export class DataSourceClass {
    ev: string;
    value: any;
}
