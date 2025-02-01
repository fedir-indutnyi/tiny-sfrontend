import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-acceleration-trend',
  templateUrl: './acceleration-trend.component.html',
  styleUrls: ['./acceleration-trend.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccelerationTrendComponent implements OnInit, OnChanges {


  @Input() periods: number[] = [];
  @Input() values: number[] = [];
  @Input() trendType: string = '';

  tableWidth: number = 0;

  trackByFn(index: number): number {
    return index;
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.periods && changes.periods.currentValue){
      this.tableWidth = changes.periods.currentValue.length * 60;
    }
  }

}
