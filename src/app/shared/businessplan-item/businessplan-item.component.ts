import {ChangeDetectionStrategy, Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID} from "@angular/core";
import {ViewportScroller} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {first, Observable, Subject} from "rxjs";
import {Store} from "@ngrx/store";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";

import {IBusinessplanRootObject, ProductsService} from "src/app/interfaces";
import {BusinessPlanItemActions} from "./store";
import {TitlesDescription} from "./businessplan-item-models";
import {getSectionsStatuses} from "@businessplan-item/store/section-status/sections-status.selectors";
import * as SectionStatus from '@businessplan-item/store/section-status/section-status.reducer';
import {BusinessplanService} from "@businessplan-item/businessplan.service";
import {IdeastartuplistControllerService} from "@shared/sdk";
import {TriggerActionService} from "@shared/services";

@Component({
    selector: "businessplan-item",
    templateUrl: "businessplan-item.component.html",
    styleUrls: ["businessplan-item.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class BusinessplanItemComponent implements OnInit, OnDestroy {
    sectionsDescription = TitlesDescription;
    portfolioProducts: ProductsService[] = null;
    private readonly unsubscribe$: Subject<void> = new Subject();
    private _postId: number;
    isActiveAll: boolean;
    isFixed: boolean = false;
    activeTabName: string;
    protected sectionsStatuses$: Observable<SectionStatus.State>;
    localDraft: object | null;
    confirmModal: NzModalRef;
    trigger: TriggerActionService;

    constructor(
        private _route: ActivatedRoute,
        private _store: Store,
        private viewportScroller: ViewportScroller,
        private businessplanService: BusinessplanService,
        private postService: IdeastartuplistControllerService,
        private modal: NzModalService,
        private triggerActionService: TriggerActionService,
        @Inject(PLATFORM_ID) private platformId: string) {
    };

    ngOnInit(): void {
        this.sectionsStatuses$ = this._store.select(getSectionsStatuses);
        this._postId = +this._route.snapshot.params['id'] || +this._route.snapshot.params['businessPlanId'];
        this.localDraft = this.businessplanService.getLocalDraftById(this._postId);
        if (!this.localDraft) {
            this.businessplanService.getAllDataByPostId(this._postId).pipe(first()).subscribe((post) => {
                this._store.dispatch(BusinessPlanItemActions.load({
                    payload: {
                        postId: this._postId,
                        postName: post.ideatitle,
                        localDraft: null
                    }

                }));
            })
        } else this.getBusinessPlanData();
        this.trigger = this.triggerActionService;
    };

    profileStatus = 2;
    visitorsStatus = 1;

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
        this._store.dispatch(BusinessPlanItemActions.init());
    };

    onCheckAll(): void {
        this.isActiveAll = !this.isActiveAll;
        this.activeTabName = '';
    };

    scrollToEl(elementId: string): void {
        if (this.platformId === 'browser') {
            this.activeTabName = elementId;
            this.viewportScroller.scrollToAnchor(elementId);
        }
    };

    getBusinessPlanData(): void {
        this.postService.ideastartuplistControllerFindById(this._postId)
            .subscribe(value => {
                const ideabusinessplansetup_draft = JSON.parse(value.ideabusinessplansetup_draft);
                if (ideabusinessplansetup_draft?.lastmodified && (ideabusinessplansetup_draft.lastmodified < this.localDraft['lastmodified'])) {
                    this.isApplyChanges();
                } else {
                    this._store.dispatch(BusinessPlanItemActions.load({
                        payload: {
                            postId: this._postId,
                            localDraft: null
                        }

                    }));
                    this.businessplanService.localRemoveData(this._postId);
                }
            });
    };

    isApplyChanges(): void {
        this.confirmModal = this.modal.confirm({
            nzTitle: 'Want to apply unsaved settings?',
            nzContent: 'The latest changes to the business plan have not been saved',
            nzOnOk: () => {
                this._store.dispatch(BusinessPlanItemActions.load({
                    payload: {
                        postId: this._postId,
                        localDraft: this.localDraft as IBusinessplanRootObject
                    }
                }))
            },

            nzOnCancel: () => {
                this._store.dispatch(BusinessPlanItemActions.load({
                    payload: {
                        postId: this._postId,
                        localDraft: null
                    }
                }))
                this.businessplanService.localRemoveData(this._postId)
            }
        });
    };

    getBoxShadow(color: string): string {
        return `box-shadow: inset 0 0 8px 0 ${color}`;
    }

    @HostListener('window:scroll', ['$event'])
    onScroll(event: Event): void {
        const navBlock = document.getElementById('plan_wrapper')
        this.isFixed = navBlock?.getBoundingClientRect().y < 80;
    };
}
