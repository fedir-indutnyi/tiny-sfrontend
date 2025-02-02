import {Component, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {ActivatedRoute, Router} from "@angular/router";
import {NzCardModule} from "ng-zorro-antd/card";
import * as _ from 'lodash'

import {ChartsAndGraphsComponent} from "@shared/charts-and-graphs/charts-and-graphs.component";
import {
    IdeastartuplistControllerService,
    IdeastartuplistWithRelations,
    Pnldata,
    PnldataControllerService,
    PnldataFilter1
} from "@shared/sdk";

@Component({
    selector: 'app-businessplan-displaying',
    standalone: true,
    imports: [CommonModule, ChartsAndGraphsComponent, NzCardModule, NgOptimizedImage],
    templateUrl: './view-analytics.html',
    styleUrls: ['./view-analytics.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewAnalyticsComponent implements OnInit {
    businessPlanId: string;
    businessPlan: IdeastartuplistWithRelations;

    constructor(private route: ActivatedRoute,
                private postService: IdeastartuplistControllerService,
    ) {
    }


    ngOnInit(): void {
        this.businessPlanId = this.route.snapshot.paramMap.get('businessPlanId');
        this.postService.ideastartuplistControllerFindById(+this.businessPlanId).subscribe(businessPlan => {
            this.businessPlan = businessPlan;
        })
    }


}
