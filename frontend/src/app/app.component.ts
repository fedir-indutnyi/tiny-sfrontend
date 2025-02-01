import {Component} from "@angular/core";

import {Timestamp} from "./timestamp/Timestamp";
import {GlobalService} from "@shared/services";


@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
})
export class AppComponent {
    title = "app";
    isDonationMessage: boolean;

    constructor(
        private globalService: GlobalService,
    ) {
        console.log("compiled version timestamp:", Timestamp.stamp);
    }

    ngOnInit() {
        this.globalService.checkDonateExpAt()
        this.globalService.isDonationMessage.subscribe(res => this.isDonationMessage = res);
    }
}
