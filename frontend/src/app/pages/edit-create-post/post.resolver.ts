import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { IdeastartuplistControllerService, IdeastartuplistWithRelations } from 'src/app/shared/sdk';

export const postResolver: ResolveFn<Observable<IdeastartuplistWithRelations> | boolean> = (route, state) => {
  let postId = route.params['id'] || null;
  if (postId === null) return false;
  return inject(IdeastartuplistControllerService).ideastartuplistControllerFindById(postId);
};
