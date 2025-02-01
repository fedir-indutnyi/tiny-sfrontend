import {Injectable} from '@angular/core';
import {map} from "rxjs/operators";
import {Observable, of, switchMap} from 'rxjs';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import {AccountService} from "@shared/account/account.service";
import {
    IdeastartuplistControllerService,
    IdeastartuplistWithRelations,
    UserteamrelationControllerService,
    UserteamrelationWithRelations
} from "@shared/sdk";
import {convertPlaceholderPathToUrl} from "@app/utils/dynamic-path";

@Injectable({
    providedIn: 'root'
})
export class PostSingleResolver {
    userId: number;
    postId: string | null;
    teams: UserteamrelationWithRelations[] | null;
    post: IdeastartuplistWithRelations;
    businessPlans: IdeastartuplistWithRelations[] | null;
    isAccess: boolean = false;

    constructor(private account: AccountService,
                private teamService: UserteamrelationControllerService,
                private postService: IdeastartuplistControllerService,
    ) {
    };

    getUserTeams(route: ActivatedRouteSnapshot): Observable<void> {
        this.getCurrentUser();
        this.postId = null;
        this.postId = route.paramMap.get('businessPlanId') || route.paramMap.get('postId');
        return this.teamService.userteamrelationControllerFind(
            JSON.stringify({
                include: [{
                    relation: "team",
                    scope: {
                        fields: ["teamname"]
                    }
                }],
                order: 'id DESC',
                limit: 10000,
                skip: 0,
                offset: 0,
                where: {
                    and: [{"userId": this.userId}]
                },
            }) as any
        ).pipe(
            map((resp) => {
                this.teams = resp;
            })
        );

    };

    getCurrentUser(): void {
        this.userId = this.account.currentUserValue.id;
        // this.userService.userControllerWhoAmI().subscribe(value => {
        //   this.userId = value
        // })
    };

    loadPost(route: ActivatedRouteSnapshot): Observable<void> {
        return this.postService.ideastartuplistControllerFindById(+this.postId, JSON.stringify({
            include: ['createdByProfile'],
        }) as any).pipe(
            switchMap(value => {
                this.post = {
                    ...value,
                    image: convertPlaceholderPathToUrl(value.image),
                    ideadescription: convertPlaceholderPathToUrl(value.ideadescription)
                };
                this.isAccess = false;
                if (+value.createdbyid === +this.userId) {
                    this.isAccess = true;
                    return of(null); // Використовуємо of(null), щоб повернути Observable, який одразу завершується
                }
                if (!route.paramMap.has('businessPlanId')) {
                    this.teams.forEach(value => {
                        if (value.teamId === this.post.sharedteams) {
                            this.isAccess = true;
                        }
                    });
                    return of(null);
                }
                if (route.paramMap.has('businessPlanId')) {
                    return this.postService.ideastartuplistControllerFindById(this.post.parentcode).pipe(
                        map(parent => {
                            const sharedTeams = parent.sharedteams;
                            this.teams.forEach(team => {
                                if (team.teamId === sharedTeams) {
                                    this.isAccess = true;
                                }
                            });
                            return;
                        })
                    );
                }
                return of(null);
            })
        );
    };


    getBusinessPlan(): Observable<void> {
        if (this.post.recordtype !== 'businessplan') {
            return this.postService.ideastartuplistControllerFind(
                JSON.stringify({
                    include: ['createdByProfile'],
                    order: 'id DESC',
                    limit: 100,
                    skip: 0,
                    where: {
                        and: [
                            {
                                or: [{isdeleted: 0}, {isdeleted: null}],
                            },
                            {
                                or: [{parentcode: this.post.id}]
                            },
                        ]
                    }
                }) as any
            ).pipe(
                map(
                    (resp) => {
                        this.businessPlans = null;
                        if (resp.length > 0) this.businessPlans = resp;
                    }
                )
            );
        } else {
            return of(this.businessPlans = null);
        }
    };

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.getUserTeams(route).pipe(
            switchMap(() => this.loadPost(route)),
            switchMap(() => this.getBusinessPlan()),
            map(() => ({
                post: this.post,
                businessPlans: this.businessPlans,
                isAccess: this.isAccess,
                currentUserId: this.userId,
            }))
        );
    };
}
