import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { TargetedAudiencePivot } from '@businessplan-item/store/reducers/aggregated-sales-data.reducer';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AggregateSalesDataActions, Selectors } from '@businessplan-item/store/index';

@Component({
  selector: 'app-visitors',
  templateUrl: './visitors.component.html',
  styleUrls: ['./visitors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisitorsComponent implements OnInit, OnDestroy {
  visitorsPivotData$: Observable<TargetedAudiencePivot[]>
  constructor(private _store: Store) { }

    ngOnInit(): void {

    this._store.dispatch(AggregateSalesDataActions.init());

    this.visitorsPivotData$ = this._store.select(Selectors.selectVisitorsPivotState)
    }

    ngOnDestroy() {
      this._store.dispatch(AggregateSalesDataActions.init());
    }

}
