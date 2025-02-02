import {Injectable} from '@angular/core';
import {delay, Observable, of, switchMap} from 'rxjs';

import {IdeastartuplistControllerService, IdeastartuplistWithRelations} from '../sdk';
import {IBusinessplanRootObject} from "@businessplan-item/typings";

@Injectable()
export class BusinessplanService {

    constructor(private ideasService: IdeastartuplistControllerService) {
    };

    getAllDataByPostId(id: number): Observable<IdeastartuplistWithRelations> {
        return this.ideasService.ideastartuplistControllerFindById(id);
    };

    getDraft(id: number, localDraft?: IBusinessplanRootObject): Observable<IBusinessplanRootObject> {
        return localDraft
            ? this.ideasService.ideastartuplistControllerFindById(id, {fields: {id: true}}).pipe(
                switchMap(() => {
                    return of(localDraft);
                })
            )
            : this.ideasService.ideastartuplistControllerFindById(id).pipe(
                switchMap(value => {
                    const draft: IBusinessplanRootObject = JSON.parse(value.ideabusinessplansetup_draft);
                    return of(draft);
                })
            );
    };

    saveData(postId: number, ideaData: IBusinessplanRootObject) {
        let data = JSON.stringify(ideaData);
        return this.ideasService.ideastartuplistControllerUpdateById(
            postId,
            {
                ideabusinessplansetup_draft: data
            }
        );
    };

    localSaveData(postId: number, ideaData: any): Observable<string> {
        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
        const time = new Date().getTime();

        const draft = (currentUser.draft || []).filter(item => item.postId !== postId);
        draft.push({...ideaData, postId, lastmodified: time});

        const data = JSON.stringify({
            ...currentUser,
            draft
        });
        localStorage.setItem('currentUser', data);
        return of(data).pipe(delay(1000));
    };

    localRemoveData(postId: number): void {
        const userAndDraft = JSON.parse(localStorage.getItem('currentUser'));
        if (userAndDraft && userAndDraft.draft) {
            userAndDraft.draft = userAndDraft.draft.filter((item) => item.postId !== postId);
            localStorage.setItem('currentUser', JSON.stringify(userAndDraft));
        }
    };

    getLocalDraftById(postId: number): IBusinessplanRootObject | null {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.draft && currentUser.draft.length > 0) {
            return currentUser.draft.find(item => item.postId === postId);
        } else return null
    };
}
