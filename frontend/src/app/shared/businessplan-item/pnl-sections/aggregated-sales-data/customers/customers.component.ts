import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { TargetedAudiencePivot } from '@businessplan-item/store/reducers/aggregated-sales-data.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AggregateSalesDataActions, Selectors } from '@businessplan-item/store/index';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomersComponent implements OnInit, OnDestroy{
  customersPivotData$: Observable<TargetedAudiencePivot[]>;

  constructor(private _store: Store) { }

  ngOnInit(): void {

  this._store.dispatch(AggregateSalesDataActions.init());

  this.customersPivotData$ = this._store.select(Selectors.selectCustomersPivotState)
  }

  ngOnDestroy() {
    this._store.dispatch(AggregateSalesDataActions.init());
  }
}
