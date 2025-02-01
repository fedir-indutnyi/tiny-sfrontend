import {NzModalService} from 'ng-zorro-antd/modal';
import {Component, OnInit} from '@angular/core';
import {NzMessageService} from "ng-zorro-antd/message";

import {AccountService} from '@shared/account/account.service';
import {
    Ideastartuplist,
    IdeastartuplistControllerService,
    IdeastartuplistWithRelations,
    UserteamrelationControllerService,
    UserteamrelationWithRelations
} from '@shared/sdk';
import {convertPlaceholderPathToUrl} from '@app/utils/dynamic-path';
import {IPostCheckboxOptions} from "@app/interfaces";
import {TriggerActionService} from "@shared/services";

@Component({
    selector: 'my-items',
    templateUrl: 'my-items.component.html',
    styleUrls: ['my-items.component.scss'],
})
export class MyItemsComponent implements OnInit {
    postList: IdeastartuplistWithRelations[];
    teams: UserteamrelationWithRelations[];
    isSharedVisible: boolean = false;
    selectedTab: number = 0;
    teamCheckedId: number;
    listId: number;
    teamId: number;
    limit: number = 100; //for setting pagination
    skip: number = 0;
    skipScroll: boolean = false;

    tabs: IPostCheckboxOptions[] = [
        {label: 'myItems.allPosts', value: ['startup', 'idea', 'dream']},
        {label: 'myItems.startup', value: ['startup']},
        {label: 'myItems.ideas', value: ['idea', 'dream']},
        // {label: 'myItems.businessplan', value: ['businessplan']}
    ];

    constructor(
        private postService: IdeastartuplistControllerService,
        private teamService: UserteamrelationControllerService,
        private account: AccountService,
        private modal: NzModalService,
        private messagesService: NzMessageService,
        private serviceIdea: IdeastartuplistControllerService,
        private triggerActionService: TriggerActionService,
    ) {
        this.account = account;
    };

    ngOnInit(): void {
        this.getData(this.tabs[this.selectedTab].value);
    };

    getData(checkboxValue: Array<string>, tabIndex?: number): void {
        if (tabIndex) this.selectedTab = tabIndex
        this.teamService.userteamrelationControllerFind(
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
                    and: [{"userId": this.account.currentUserValue.id}]
                },
            }) as any
        ).subscribe(resp => {
            this.teams = resp
            const sharedTeams: Array<object> = [{sharedteams: -1}]; //here we need to put initial value (impossible value) for shared teams even if current user dont have teams, because othervice shared teams will be equal to undefined, and query will fail
            this.teams.map(value => sharedTeams.push({sharedteams: value.teamId}))
            this.postService.ideastartuplistControllerFind(
                JSON.stringify({
                    include: ['createdByProfile'],
                    order: 'id DESC',
                    limit: this.limit,
                    skip: this.skip,
                    where: {
                        and: [
                            {
                                or: [{isdeleted: 0}, {isdeleted: null}],
                            },
                            {
                                or: this.recordTypeMap(checkboxValue)
                            },
                            {
                                or: [
                                    {createdbyid: this.account.currentUserValue.id},
                                    {or: sharedTeams}
                                ]
                            }
                        ]
                    }
                }) as any
            ).subscribe({
                next: (resp) => {
                    this.skipScroll = resp.length < this.limit;
                    if (!this.skipScroll) {
                        this.skip += this.limit;
                    }
                    const posts = resp.map(item => {
                        return {
                            ...item,
                            image: convertPlaceholderPathToUrl(item.image),
                            ideadescription: convertPlaceholderPathToUrl(item.ideadescription)
                        };
                    });
                    this.postList = (this.postList === undefined || tabIndex) ? posts : this.postList.concat(posts);
                    this.triggerActionService.canTriggerAction = true;
                }, error: (e) => console.log(e)
            });
        });
    };

    recordTypeMap(checkboxValue: Array<string | number>): Array<object> {
        const newArr = [];
        checkboxValue.map(value => newArr.push({recordtype: value}));
        return newArr;
    };

    showShareModal(list: Ideastartuplist): void {
        this.teamId = list.sharedteams;
        this.teamCheckedId = this.teamId;
        this.listId = list.id;
        this.isSharedVisible = true;
    };

    handleOk(): void {
        this.serviceIdea.ideastartuplistControllerUpdateById(
            this.listId,
            {
                sharedteams: this.teamCheckedId
            }
        ).subscribe({
            next: () => {
                this.messagesService.success(`Team changed`);
                this.isSharedVisible = false;
                this.getData(this.tabs[this.selectedTab].value);
            }, error: (e) => {
                this.messagesService.error(e.error.error.message)
            }
        });
    };

    deletePost(index: number): void {
        this.modal.warning({
            nzTitle: '<b>Do you really want to delete this post?</b>',
            nzContent: 'After removing this post you will not be able to recover it back.',
            nzOkText: 'Yes',
            nzCancelText: 'No',
            nzOkType: 'primary',
            nzOnOk: () => {
                const item = this.postList[index];
                this.postService.ideastartuplistControllerUpdateById(item.id, {isdeleted: 1}).subscribe({
                    next: () => {
                        this.postList.splice(index, 1);
                        this.messagesService.success(`Post deleted`);
                    }, error: e => {
                        this.messagesService.error(e.error.error.message);
                        console.log(e);
                    }
                });
            }
        });
    };

    clickTab(recordType: Array<string>, i: number): void {
        this.skip = 0;
        this.getData(recordType, i);
    };

    getDataIfNotEnd(value: Array<string>): void {
        if (!this.skipScroll) {
            this.getData(value);
        }
    };
}
