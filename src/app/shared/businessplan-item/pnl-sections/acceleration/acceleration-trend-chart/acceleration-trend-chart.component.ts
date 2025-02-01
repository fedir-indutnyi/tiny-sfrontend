import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTitleSubtitle,
  ApexXAxis,
  ChartComponent,
  NgApexchartsModule
} from "ng-apexcharts";



export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
};


@Component({
  selector: 'app-acceleration-trend-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './acceleration-trend-chart.component.html',
  styleUrls: ['./acceleration-trend-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccelerationTrendChartComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() periods: number[] = [];
  @Input() values: number[] = [];
  @Input() trendType: string = null;

  @ViewChild('chart', { static: true }) chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() { }

  ngOnInit(): void {
    this.chartOptions = this._initChart({
      seriesData: this.values,
      xAxisData: this.periods,
      trendType: this.trendType
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.values.length && this.periods.length && this.trendType) {
      this.chartOptions = this._initChart({
        seriesData: this.values,
        xAxisData: this.periods,
        trendType: this.trendType
      });
      this.chart.updateOptions(this.chartOptions)
    }

  }

  ngAfterViewInit(): void {

  }

  private _initChart(settings: {
    seriesData: number[],
    xAxisData: number[],
    trendType: string
  }): Partial<ChartOptions> {
    return {
      series: [
        {
          name: "Values",
          data: settings.seriesData
        }
      ],
      chart: {
        type: "area",
        height: 350,
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },

      title: {
        text: `${settings.trendType} Trend`,
        align: "left"
      },
      xaxis: {
        type: "numeric",
        categories: settings.xAxisData,
        title: {
          text: "Month"
        }
      },
      yaxis: {},
      legend: {
        show: false
      }
    };
  }

}
