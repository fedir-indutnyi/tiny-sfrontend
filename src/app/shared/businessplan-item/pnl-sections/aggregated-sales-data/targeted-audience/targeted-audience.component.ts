import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AggregateSalesDataActions, Selectors } from '@businessplan-item/store/index';
import { TargetedAudiencePivot } from '@businessplan-item/store/reducers/aggregated-sales-data.reducer';

@Component({
  selector: 'app-targeted-audience',
  templateUrl: './targeted-audience.component.html',
  styleUrls: ['./targeted-audience.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TargetedAudienceComponent implements OnInit, OnDestroy {
  targetedAudiencePivotData$: Observable<TargetedAudiencePivot[]>;
  constructor(private _store: Store) { }

  ngOnInit(): void {

    this._store.dispatch(AggregateSalesDataActions.init());

    this.targetedAudiencePivotData$ = this._store.select(Selectors.selectTargetedAudiencePivotState)
  }


  ngOnDestroy() {
    this._store.dispatch(AggregateSalesDataActions.init());
  }

}
