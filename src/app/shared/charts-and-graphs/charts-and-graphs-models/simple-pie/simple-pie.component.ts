import {ChangeDetectionStrategy, Component, Input, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ApexChart, ApexNonAxisChartSeries, ApexResponsive, ChartComponent, NgApexchartsModule} from "ng-apexcharts";

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
};


@Component({
    selector: 'app-simple-pie',
    standalone: true,
    imports: [CommonModule, NgApexchartsModule],
    templateUrl: './simple-pie.component.html',
    styleUrls: ['./simple-pie.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimplePieComponent {
    @ViewChild("chart") chart: ChartComponent;
    @Input() title: string;
    @Input() chartOptions: Partial<any>;

    constructor() {

    }
}
