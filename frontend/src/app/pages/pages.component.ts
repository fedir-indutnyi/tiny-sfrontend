import {Component, OnInit} from "@angular/core";

import {GlobalService} from "@shared/services";

@Component({
    selector: "app-pages",
    templateUrl: "./pages.component.html",
    styleUrls: ["./pages.component.scss"],
})

export class PagesComponent implements OnInit {
    isCollapsed: boolean = false;
    isDonationMessage: boolean;
    routeTitle: string;

    constructor(private globalService: GlobalService
    ) {
        this.getRouteTitle();
    };

    ngOnInit(): void {
        this.globalService.isDonationMessage.subscribe((res) => {
            this.isDonationMessage = res;
        });
    };


    private getRouteTitle(): void {
        /* this._globalService.isActived$.subscribe(isActived => {
          this.routeTitle = isActived.title;
        }, error => {
          console.log('Error: ' + error);
        }); */

        this.globalService.data$.subscribe(data => {
            if (data.ev === 'isActived') {
                this.routeTitle = data.value.title;
            }
        }, error => {
            console.log('Error: ' + error);
        });
    };

    returnHome(): void {
        //    this._globalService._isActived({ title: 'Dashboard' });
        this.globalService.dataBusChanged('isActived', {title: 'Dashboard'});
    };
}
