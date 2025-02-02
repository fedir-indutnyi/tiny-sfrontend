import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {NzMessageService} from "ng-zorro-antd/message";

import {GlobalService, LangLocalStorageService} from '../../services';
import {AccountService, User} from '../../account/account.service';
import {convertPlaceholderPathToUrl} from '@app/utils/dynamic-path';
import {ILanguageList} from "@app/interfaces";
import {NotificationsControllerService, UserControllerService} from "../../sdk";
import {environment} from "../../../../environments/environment";
import {EnvConfiguration, EnvService} from "@shared/services/env.service";

@Component({
    selector: 'pages-top',
    templateUrl: './pages-top.component.html',
    styleUrls: ['./pages-top.component.scss'],
})
export class PagesTopComponent implements OnInit {
    @Input() showLogo: boolean = false;

    currentUser: User;
    sidebarToggle: boolean = true;
    selectedLang: string;
    originUserStr: string | null;
    isLoginAsVisible: boolean = false;
    unreadNotifications: number;
    languageList: ILanguageList[] = [
        {code: 'en', label: 'English'},
        {code: 'uk', label: 'Українська'},
        {code: 'pl', label: 'Polski'},
    ];
    protected displayBadge: boolean;
    protected badgeText: string;

    constructor(private _globalService: GlobalService,
                private accountService: AccountService,
                private translate: TranslateService,
                private storageService: LangLocalStorageService,
                private userService: UserControllerService,
                private messagesService: NzMessageService,
                private account: AccountService,
                private notificationsService: NotificationsControllerService,
                private envService: EnvService,
    ) {
    };

    ngOnInit(): void {
        this.envService.configurationPromise.then((configuration: EnvConfiguration) => {
            this.displayBadge = configuration?.environmentBadgeDisplay ;
            this.badgeText = configuration?.environmentBadgeLabel;
        }).catch(() => {
            this.displayBadge = environment.environmentBadgeDisplay;
            this.badgeText = environment.environmentBadgeLabel;
        })
        this.accountService.currentUser.subscribe({
            next: (user) => {
                this.currentUser = user;
                if (user) {
                    this.currentUser.picture = convertPlaceholderPathToUrl(this.currentUser.picture);
                }
            }, error: (e) => console.log('Error: ' + e)
        });

        this.getNotifications();

        if (!this.currentUser) {
            this.storageService.startLanguage();
            this.selectedLang = this.storageService.getLanguageCode();
        } else {
            const userLang = JSON.parse(localStorage.getItem('currentUser')).language_locale
            if (!userLang) {
                this.changeLang('en')
            } else {
                this.translate.use(userLang);
                this.selectedLang = userLang
            }
        }
        this.originUserStr = localStorage.getItem('originUser') || null;
        if (this.originUserStr) {
            this.isLoginAsVisible = true;
        }
    };

    public _sidebarToggle(): void {
        this._globalService.data$.subscribe({
            next: (data) => {
                if (data.ev === 'sidebarToggle') {
                    this.sidebarToggle = data.value;
                }
            }, error: (e) => {
                console.log('Error: ' + e);
            }
        });
        this._globalService.dataBusChanged('sidebarToggle', !this.sidebarToggle);
    };

    singOut(): void {
        this.accountService.logout();
        location.reload();
    };

    changeLang(lang: string): void {
        this.selectedLang = lang;
        this.translate.use(lang);
        if (!this.currentUser) {
            this.storageService.setLanguage(lang);
        } else if (this.currentUser) {
            this.userService.userControllerUpdateById(this.currentUser.id, {
                language_locale: lang
            })
                .subscribe({
                    next: (_) => {
                        this.messagesService.success("Language saved");
                        // Update LocalStorage
                        this.account.updateCurrentUser({
                            ...this.currentUser,
                            language_locale: lang
                        });
                        this.currentUser = this.account.currentUserValue;
                    },
                    error: (e) => {
                        console.error(e)
                        this.messagesService.error(e.error.error.message)
                    }
                });
        }
    };

    getNotifications(): void {
        this.notificationsService.notificationsControllerFind(
            JSON.stringify({
                order: 'id DESC',
                limit: 1000,
                skip: 0,
                where: {
                    userprofileId: this.currentUser.id
                }
            }) as any
        ).subscribe({
            next: (resp) => {
                this.unreadNotifications = resp.filter((data) => !data.isRead).length;
            }, error: err => console.log(err)
        });
    };

    singOutAs(): void {
        this.isLoginAsVisible = false;
        localStorage.setItem('currentUser', this.originUserStr);
        localStorage.removeItem('originUser');
        location.reload();
    };

    protected readonly JSON = JSON;

    getInitials(name: string, surname?: string): string {
        if (!name) return "";

        let initials = name[0].toUpperCase();

        if (surname) {
            initials += surname[0].toUpperCase();
        }
        return initials;
    };

    getBackgroundColor(letter: string): string {
        const colors = ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e',
            '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50',
            '#f1c40f', '#e67e22', '#e74c3c', '#ecf0f1', '#95a5a6',
            '#f39c12', '#d35400', '#c0392b', '#bdc3c7', '#7f8c8d'];

        if (!letter) return colors[0];

        const index = letter.toLowerCase().charCodeAt(0) - 97;
        if (index >= 0 && index < colors.length) {
            return colors[index];
        }

        return colors[0];
    };
}
