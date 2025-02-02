import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { AccelerationActions, Selectors } from "@businessplan-item/store/index";
import { reset as SectionStatusAcceleration } from "./section-status.actions";
import { map, switchMap } from "rxjs";

@Injectable()
export class SectionsStatusEffects {

  constructor(private actions$: Actions, private store: Store) { }

  onAccelerationReset$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(...[AccelerationActions.reset]),
      // concatLatestFrom(() => [
      //     this.store.select(Selectors.selectAccelerationState),
      // ]),
      map((action) => {
        return SectionStatusAcceleration()
      })
    )
  })
}
