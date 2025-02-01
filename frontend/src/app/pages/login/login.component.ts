import {Component, OnDestroy, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Subscription, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {environment} from "../../../environments/environment";
import {AccountService} from '@shared/account/account.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {EnvSettings} from '@app/utils/env-settings';
import {EnvConfiguration, EnvService} from "@shared/services/env.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
    errorMessage: string[] = [];
    envInfo = new EnvSettings();
    protected displayBadge: boolean;
    protected badgeText: string;

    loginForm = new UntypedFormGroup({
        login: new UntypedFormControl('', [
            Validators.email,
            Validators.required
        ]),
        password: new UntypedFormControl('', [
            Validators.required,
            Validators.minLength(8),
        ])
    });

    get emailErrorMessage() {
        if (this.loginForm.controls.login.errors?.email) {
            return 'Please enter a valid email';
        }
        if (this.loginForm.controls.login.errors?.required) {
            return 'Required field';
        }
        return null;
    }

    get passwordErrorMessage() {
        if (this.loginForm.controls.password.errors?.required) {
            return 'Required field';
        }
        if (this.loginForm.controls.password.errors?.minlength) {
            return 'Minimum password length 8 characters';
        }
        return null;
    }

    private _subscription = new Subscription();
    private _redirectUrl: string;

    constructor(private _accountService: AccountService,
                private message: NzMessageService,
                private _router: Router,
                private envService: EnvService,
    ) {
    }

    private loginparameters = {testuser: false, username: 'john@doe.com', password: 'opensesame'};

    ngOnInit() {
        this.envService.configurationPromise.then((config: EnvConfiguration) => {
            this.displayBadge = config?.environmentBadgeDisplay;
            this.badgeText = config?.environmentBadgeLabel;
        })
        .catch(() => {
            this.displayBadge = environment.environmentBadgeDisplay;
            this.badgeText = environment.environmentBadgeLabel;
        })        
        this._redirectUrl = '/all-publicideas';
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    loginAsTestUser() {
        this.loginparameters.testuser = true;
        this.login(this.loginparameters);
    }


    login(parameters) {
        this.errorMessage = [];
        //set parameters to deafult:
        if (parameters == null) {
            parameters = {testuser: false};
        }

        //check form for errors:
        if (!parameters.testuser) {
            if (this.emailErrorMessage || this.passwordErrorMessage) {
                return this.errorMessage.push('Required fields are not filled');
            }
        }

        let credentials = {
            u: this.loginForm.controls.login.value,
            p: this.loginForm.controls.password.value
        }

        if (parameters.testuser) {
            credentials.u = parameters.username;
            credentials.p = parameters.password;
        }

        this._subscription.add(this._accountService.login(credentials.u, credentials.p)
            .pipe(catchError(res => {
                const errorDetails = res.error?.error?.details;
                if (errorDetails?.length) {
                    return errorDetails.forEach(el => {
                        this.errorMessage.push(el.message);
                    });
                }
                this.message.create(
                    'error',
                    res.error.error.message
                );
                return throwError(res);
            }))
            .subscribe((res: Promise<any>) => {
                res.then(() => {
                    this._router.navigate([this._redirectUrl]);
                })
            }));
    };
}


