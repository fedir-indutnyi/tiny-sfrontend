import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { TargetedAudiencePivot } from '@businessplan-item/store/reducers/aggregated-sales-data.reducer';
import { WebdatarocksComponent, WebdatarocksPivotModule } from '@webdatarocks/ngx-webdatarocks';

@Component({
  selector: 'app-aggregated-pivot-table',
  templateUrl: './aggregated-pivot-table.component.html',
  styleUrls: ['./aggregated-pivot-table.component.scss'],
  standalone: true,
  imports: [WebdatarocksPivotModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AggregatedPivotTableComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  @Input() dataSource: TargetedAudiencePivot[];
  @Input() aggregationType: string = 'max';
  @ViewChild('pivot') pivotCmp: WebdatarocksComponent;


  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.pivotCmp.webDataRocks.setReport(this.initPivotTable());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.pivotCmp) return;
    this.pivotCmp.webDataRocks.updateData({ data: this.setDataSource() });
  }

  ngOnDestroy(): void {
  }

  private setDataSource = () => {
    return [
      this.pivotTableConfig,
      ...this.dataSource
    ]
  }

  private pivotTableConfig = {
    "date": {
      type: "string"
    },
    "title": {
      type: "string"
    },
    "year": {
      type: "number"
    },
    "amount": {
      type: "number"
    },
  }

  private initPivotTable(): WebDataRocks.Report {
    return {
      dataSource: {
        data: this.setDataSource(),
      },
      slice: {
        rows: [
          {
            uniqueName: "title",
            caption: "Title"
          },
        ],
        columns: [
          {
            uniqueName: "year",
            caption: "Periods per Year"
          },
          {
            uniqueName: "date",
            caption: "Periods per Month"
          },
          {
            uniqueName: "Measures",
          },

        ],
        measures: [
          {
            uniqueName: "amount",
            aggregation: this.aggregationType
          }
        ]
      },
      options: {
        grid: {
          showTotals: "on",
          showGrandTotals: "columns",
          showHeaders: false,
          showFilter: false,
          showReportFiltersArea: false,
          showHierarchies: false,


        },
        configuratorButton: true,
        configuratorActive: false,
        editing: false,
        drillThrough: false,
        showDefaultSlice: false,
        showCalculatedValuesButton: false,
        defaultHierarchySortName: 'unsorted',
        datePattern: "MM/yyyy",
      },
      formats: [
        {
          name: "",
          thousandsSeparator: " ",
          decimalSeparator: ".",
          decimalPlaces: 2,
          currencySymbol: "",
          currencySymbolAlign: "left",
          nullValue: "",
          textAlign: "right",
          isPercent: false
        }
      ]
    }
  }

}
