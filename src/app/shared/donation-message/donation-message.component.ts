import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";

import {GlobalService} from "../services";

@Component({
    selector: "app-donation-message",
    templateUrl: "./donation-message.component.html",
    styleUrls: ["./donation-message.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonationMessageComponent implements OnInit {
    isDonationMessage: boolean;

    constructor(
        private globalService: GlobalService,
    ) {
    };

    ngOnInit(): void {
        this.globalService.isDonationMessage.subscribe(res => this.isDonationMessage = res);
    }

    close(): void {
        this.globalService.onCloseDonate();
    };
}
