import {Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Subscription, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {MatLegacySnackBar as MatSnackBar} from '@angular/material/legacy-snack-bar';
import {NzModalService} from 'ng-zorro-antd/modal';

import {environment} from "../../../environments/environment";
import {AccountService} from '@shared/account/account.service';
import {validateConfirmPassword} from './validators/password.validators';
import {FilesControllerService} from '@shared/sdk';
import {TermsComponent} from './terms/terms.component';
import {convertPlaceholderPathToUrl, convertUrlToPlaceholderPath} from '@app/utils/dynamic-path';
import {LangLocalStorageService} from '@shared/services';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {EnvConfiguration, EnvService} from "@shared/services/env.service";

@Component({
    selector: 'app-sign-up',
    templateUrl: 'sign-up.component.html',
    styleUrls: ['sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {

    profileAvatar = '';
    errorMessages: string[] = [];
    currentLang: string;
    registrationForm!: UntypedFormGroup;
    protected displayBadge: boolean;
    protected badgeText: string;

    get fullNameErrorMessage(): string | null {
        if (this.registrationForm.controls.fullName.errors?.required) {
            return 'Required field';
        }
        return null;
    };

    get emailErrorMessage(): string | null {
        if (this.registrationForm.controls.email.errors?.email) {
            return 'Please enter a valid email';
        }
        if (this.registrationForm.controls.email.errors?.required) {
            return 'Required field';
        }
        return null;
    };

    get passwordErrorMessage(): string | null {
        if (this.registrationForm.controls.password.errors?.required) {
            return 'Required field';
        }
        if (this.registrationForm.controls.password.errors?.minlength) {
            return 'Minimum password length 8 characters';
        }
        return null;
    };

    get confirmPasswordErrorMessage(): string | null {
        if (this.registrationForm.controls.confirmPassword.value !== this.registrationForm.controls.password.value) {
            return 'Password mismatch';
        }
        if (this.registrationForm.controls.confirmPassword.errors?.required) {
            return 'Required field';
        }
        return null;
    };

    get termsCheckerValue() {
        return !!this.registrationForm.controls.termsChecker.value;
    };

    private _subscription: Subscription = new Subscription();
    private _redirectUrl: string = '/all-publicideas';

    constructor(
        private _accountService: AccountService,
        private _router: Router,
        private _snackBar: MatSnackBar,
        private uploadService: FilesControllerService,
        private modal: NzModalService,
        private viewContainerRef: ViewContainerRef,
        private fb: UntypedFormBuilder,
        private storageService: LangLocalStorageService,
        private notification: NzNotificationService,
        private envService: EnvService,
    ) {
    };

    ngOnInit(): void {
        this.envService.configurationPromise.then((configuration: EnvConfiguration) => {
            this.displayBadge = configuration?.environmentBadgeDisplay;
            this.badgeText = configuration?.environmentBadgeLabel;
        }).catch(() => {
            this.displayBadge = environment.environmentBadgeDisplay;
            this.badgeText = environment.environmentBadgeLabel;
        }) 
        this.registrationForm = this.fb.group({
            fullName: [null, [
                Validators.required,
            ]],
            email: [null, [
                Validators.required,
                Validators.email,
            ]],
            password: [null, [
                Validators.required,
                Validators.minLength(8),
            ]],
            confirmPassword: [null, [
                Validators.required,
                validateConfirmPassword('password')
            ]],
            termsChecker: [null, [
                Validators.required,
            ]]
        });
        this.storageService.startLanguage();
        this.currentLang = this.storageService.getLanguageCode()
    };

    ngOnDestroy() {
        this._subscription.unsubscribe();
    };

    async onFileChange(e: Event) {
        const input: HTMLInputElement = e.target as HTMLInputElement;
        const file: File = (input.files as FileList)[0];
        const data = await this.uploadService.filesControllerUpload(file).toPromise();
        this.profileAvatar = convertPlaceholderPathToUrl(data.path);
    };

    createComponentModal(): void {
        this.modal.create({
            nzTitle: 'Title',
            nzContent: TermsComponent,
            nzViewContainerRef: this.viewContainerRef
        });
    };

    signUp(): void {
        for (const i in this.registrationForm.controls) {
            this.registrationForm.controls[i].markAsDirty();
            this.registrationForm.controls[i].updateValueAndValidity();
        }
        this.errorMessages = [];

        if (this.registrationForm.valid) {
            this._subscription.add(
                this._accountService.register(
                    this.registrationForm.controls.email.value,
                    this.registrationForm.controls.password.value,
                    this.registrationForm.controls.fullName.value, // Include full name in registration
                    '',
                    convertUrlToPlaceholderPath(this.profileAvatar),
                    this.currentLang
                )
                    .pipe(catchError(err => {
                        const errorDetails = err.error?.error?.details;
                        if (errorDetails?.length) {
                            return errorDetails.forEach(el => {
                                this.errorMessages.push(el.message);
                            });
                        }
                        const singleError = err.error?.error;
                        if (singleError?.message) {
                            this.notification.error(
                                'Error',
                                singleError?.message
                            );
                        }
                        return throwError(err);
                    }))
                    .subscribe(res => {
                        this._subscription
                            .add(this._accountService.login(this.registrationForm.controls.email.value, this.registrationForm.controls.password.value)
                                .pipe(catchError(err => {
                                    this._snackBar.open(err.error.error.message, 'OK', {
                                        duration: 3000,
                                    });
                                    return throwError(err);
                                }))
                                .subscribe(res => {
                                    res.then(() => {
                                        this._router.navigate([this._redirectUrl]);
                                    });
                                })
                            );
                    })
            );
        }
    };
}
