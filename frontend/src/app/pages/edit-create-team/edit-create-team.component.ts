import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {lastValueFrom, of} from "rxjs";
import {catchError} from "rxjs/operators";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NzMessageService} from "ng-zorro-antd/message";

import {AccountService} from '@shared/account/account.service';
import {convertPlaceholderPathToUrl} from '@app/utils/dynamic-path';
import {
    FilesControllerService,
    UsercontactsWithRelations,
    UserteamControllerService,
    UserTeamMembersControllerService,
    UserteamrelationWithRelations,
    UserteamsWithRelations,
} from '@shared/sdk';

@Component({
    selector: 'edit-team',
    templateUrl: 'edit-create-team.component.html',
    styleUrls: ['edit-create-team.component.scss'],
})
export class EditCreateTeamComponent implements OnInit {
    team: UserteamsWithRelations;
    teamName: string;
    teamLocation: string;
    teamComment: string;
    profileAvatar: string;
    imagePath: string;
    selectable: boolean = true;
    removable: boolean = true;
    contacts: UsercontactsWithRelations[] = [];
    membersToRemove: UserteamrelationWithRelations[] = [];
    membersToAdd: UserteamrelationWithRelations[] = [];
    isShowContacts: boolean = false;
    setOfDisableId: Set<any> = new Set([]);
    err: boolean = false;
    username: string;
    accountId: number;
    form: FormGroup;
    isCancelItem: number | null = null;

    constructor(
        private account: AccountService,
        private route: ActivatedRoute,
        private router: Router,
        private uploadService: FilesControllerService,
        private teamService: UserteamControllerService,
        private teamMembersService: UserTeamMembersControllerService,
        private messagesService: NzMessageService,
    ) {
        this._initForm();
    };

    ngOnInit(): void {
        this.accountId = this.account.currentUserValue.id
        if (this.route.snapshot.paramMap.get('id') !== null) {
            this.loadTeams().then(() => {
                this.team.members.forEach(m => m.contact && this.setOfDisableId.add(m.contactId));
                this.form.setValue({
                    teamname: this.team.teamname,
                    commentmemo: this.team.commentmemo,
                    location: this.team.location
                })
            });
        } else {
            this.username = this.account.currentUserValue.username
        }
    };

    _initForm(): void {
        this.form = new FormGroup({
            teamname: new FormControl('', [Validators.required]),
            commentmemo: new FormControl('', [Validators.required]),
            location: new FormControl('', [Validators.required])
        });
    };

    async loadTeams(): Promise<void> {
        const id = +this.route.snapshot.paramMap.get('id');
        const filter = {
            include: [
                {relation: 'teamOwner'},
                {
                    relation: 'members',
                    scope: {
                        include: [
                            {relation: 'user'},
                            {relation: 'contact'}
                        ]
                    }
                },
            ]
        };
        const filterStr = JSON.stringify(filter) as any;
        await lastValueFrom(this.teamService.userteamControllerFindById(id, filterStr))
            .then(value => {
                this.team = value
            });
        this.profileAvatar = convertPlaceholderPathToUrl(this.team.picture);
    };

    onChooseContacts(contacts: UsercontactsWithRelations[]): void {
        this.isShowContacts = false;
        if (this.team) {
            const newMembers = contacts.map(c => ({contactId: c.id, contact: c}));
            this.team.members = this.team.members.concat(newMembers);
            this.membersToAdd = this.membersToAdd.concat(newMembers.filter(m => {
                const index = this.membersToRemove.findIndex(i => i.contactId === m.contactId);
                if (index !== -1) {
                    this.membersToRemove.splice(index, 1);
                    return false;
                }
                return true;
            }));
            newMembers.forEach(m => this.setOfDisableId.add(m.contactId));
        } else {
            this.contacts = this.contacts.concat(contacts);
            contacts.forEach(c => this.setOfDisableId.add(c.id));
        }
    };

    onRemove(i: number): void {
        if (this.team) {
            const [removed] = this.team.members.splice(i, 1);
            if (removed.contactId) {
                this.setOfDisableId.delete(removed.contactId);
            }
            const index = this.membersToAdd.findIndex(i => i.contactId === removed.contactId);
            if (index !== -1) {
                this.membersToAdd.splice(index, 1);
            } else {
                this.membersToRemove.push(removed);
            }
        } else {
            const [removed] = this.contacts.splice(i, 1);
            this.setOfDisableId.delete(removed.id);
        }
        this.isCancelItem = null;
    };

    async onFileChange(e: Event): Promise<void> {
        const input = e.target as HTMLInputElement;
        const file: File = input.files[0];
        const data = await lastValueFrom(this.uploadService
            .filesControllerUpload(file));
        this.profileAvatar = convertPlaceholderPathToUrl(data.path);
        this.imagePath = data.path;
    };

    async createTeam(): Promise<void> {
        const userId = this.account.currentUserValue.id;
        const team = {
            ...this.form.value,
            username: this.username,
            teamOwnerId: userId,
            picture: this.imagePath,
        };
        const newTeam = await lastValueFrom(this.teamService
            .userteamControllerCreate(team).pipe(catchError(err => {
                this.messagesService.error(err.error.error.message)
                this.err = true
                return of(null)
            })));

        await lastValueFrom(this.teamMembersService
            .userTeamMembersControllerCreateAll(newTeam.id, [{userId}])
            .pipe(catchError(err => {
                this.messagesService.error(err.error.error.message)
                this.err = true
                return of(null)
            })));

        this.contacts.map(i =>
            lastValueFrom(this.teamMembersService
                .userTeamMembersControllerCreateAll(newTeam.id, [{contactId: i.id}])
                .pipe(catchError(err => {
                    this.messagesService.error(err.error.error.message)
                    this.err = true
                    return of(null)
                }))));

        if (!this.err) {
            this.messagesService.success('Success')
            this.router.navigate(['/my-teams']);
        }
    };

    async saveTeam(): Promise<void> {
        const team = {
            ...this.form.value,
            picture: this.imagePath,
        };
        await lastValueFrom(this.teamService.userteamControllerUpdateById(this.team.id, team)
            .pipe(catchError(err => {
                this.messagesService.error(err.error.error.message)
                this.err = true
                return of(null)
            })));

        for (const m of this.membersToRemove) {
            const where = {id: m.id};
            const whereStr = JSON.stringify(where) as any;
            await lastValueFrom(this.teamMembersService.userTeamMembersControllerDelete(this.team.id, whereStr)
                .pipe(catchError(err => {
                    this.messagesService.error(err.error.error.message)
                    this.err = true
                    return of(null)
                })));
        }

        if (this.membersToAdd.length !== 0) {
            this.membersToAdd.map(({contactId}) =>
                lastValueFrom(this.teamMembersService
                    .userTeamMembersControllerCreateAll(this.team.id, [{contactId}])
                    .pipe(catchError(err => {
                        this.messagesService.error(err.error.error.message)
                        this.err = true
                        return of(null)
                    }))
                )
            );
        }
        if (!this.err) {
            this.messagesService.success('Success')
            this.router.navigate(['/my-teams']);
        }
    };

    getBackgroundColor(item: number | null): string {
        return item ? 'green' : 'gray';
    };

    getPointersEvents(item: number | null): string {
        return item ? 'auto' : 'none';
    };

    protected readonly location = location;

    onUpdateContact(contact: UsercontactsWithRelations): void {
        this.team.members = this.team.members
            .map(value => value?.contact?.id === contact.id ? {...value, contact} : value);
    };

    protected readonly convertPlaceholderPathToUrl = convertPlaceholderPathToUrl;
}
