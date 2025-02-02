import {
    ChangeDetectionStrategy,
    Component, EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    ChartComponent,
    ApexAxisChartSeries,
    ApexChart,
    ApexFill,
    ApexYAxis,
    ApexTooltip,
    ApexTitleSubtitle,
    NgApexchartsModule,
    ApexDataLabels,
    ApexPlotOptions,
    ApexLegend,
    ApexStates,
    ApexGrid,
} from "ng-apexcharts";
import {NzSwitchModule} from "ng-zorro-antd/switch";
import {FormsModule} from "@angular/forms";
import * as events from "node:events";

type ApexXAxis = {
    type?: "category" | "datetime" | "numeric";
    categories?: any;
    labels?: {
        style?: {
            colors?: string | string[];
            fontSize?: string;
        };
    };
};

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis | ApexYAxis[];
    title: ApexTitleSubtitle;
    labels: string[];
    stroke: any; // ApexStroke;
    dataLabels: any; // ApexDataLabels;
    fill: ApexFill;
    tooltip: ApexTooltip;


};

@Component({
    selector: 'app-column-with-data-labels',
    standalone: true,
    imports: [CommonModule, NgApexchartsModule, NzSwitchModule, FormsModule],
    templateUrl: './column-with-data-labels.component.html',
    styleUrls: ['./column-with-data-labels.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColumnWithDataLabelsComponent {
    @ViewChild("chart") chart: ChartComponent;
    @Input() title: string;
    @Input() chartOptions: Partial<any>;
    @Output() switchEmitter = new EventEmitter();
    isMonthly: boolean = false;


    constructor() {

    }

    // ngOnChanges(changes: SimpleChanges): void {
    // //     console.log(11111111,changes)
    // //    if( changes.chartOptions.currentValue)  {
    // //        this.chartOptionsData = changes.chartOptions.currentValue as Partial<any>
    // //        // Object.assign(this.chartOptionsData, changes.chartOptions.currentValue);
    // //     console.log(222222,this.chartOptionsData.series)
    // // }
    //
    // }
    protected readonly onclick = onclick;

    onClick(event:events) {
        console.log(event)
    }

    protected readonly event = event;
}
