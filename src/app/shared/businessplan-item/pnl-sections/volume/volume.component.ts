import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Selectors, VolumeActions } from '../../store';
import { TargetedAudiencePivot } from '../../store/reducers/aggregated-sales-data.reducer';
import { iVolumePivot } from '../../store/reducers/volume.reducer';

declare function $(obj: any): any;

@Component({
  selector: 'app-volume',
  templateUrl: './volume.component.html',
  styleUrls: ['./volume.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VolumeComponent implements OnInit, OnDestroy {
  volumePivotData$: Observable<iVolumePivot[]>;

  constructor(private _store: Store) { }

  ngOnInit(): void {

    this._store.dispatch(VolumeActions.init());

    this.volumePivotData$ = this._store.select(Selectors.selectVolumePivotState)
  }

  ngOnDestroy() {
    this._store.dispatch(VolumeActions.init());
  }

}
