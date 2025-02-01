import {ChangeDetectionStrategy, Component, Input, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';

import {
    ApexAxisChartSeries,
    ApexChart,
    ApexDataLabels,
    ApexGrid,
    ApexLegend,
    ApexMarkers,
    ApexStroke,
    ApexTitleSubtitle,
    ApexXAxis,
    ApexYAxis,
    ChartComponent,
    NgApexchartsModule
} from "ng-apexcharts";

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    stroke: ApexStroke;
    dataLabels: ApexDataLabels;
    markers: ApexMarkers;
    colors: string[];
    yaxis: ApexYAxis;
    grid: ApexGrid;
    legend: ApexLegend;
    title: ApexTitleSubtitle;
};

@Component({
    selector: 'app-line-with-data-labels',
    standalone: true,
    imports: [CommonModule, NgApexchartsModule],
    templateUrl: './line-with-data-labels.component.html',
    styleUrls: ['./line-with-data-labels.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineWithDataLabelsComponent {
    @ViewChild("chart") chart: ChartComponent;
    @Input() chartOptions: Partial<any>;
    @Input() title: string;

    constructor() {

    }
}
