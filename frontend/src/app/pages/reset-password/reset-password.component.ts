import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserControllerService } from '../../shared/sdk';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements AfterViewInit {
  isResetPassword: boolean;
  isEmailSent: boolean;
  accessToken: string;
  emailForm: UntypedFormGroup;
  resetForm: UntypedFormGroup;
  errors: Array<{ name: string, status: string, message: string }>;
  @ViewChild('email', { static: false }) email: ElementRef;
  @ViewChild('password', { static: false }) password: ElementRef;

  constructor(
    private router: Router,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private profile: UserControllerService
  ) {

    this.emailForm = this.fb.group({
      'email': ['', Validators.compose([ Validators.required, Validators.email ])],
    });
    this.resetForm = this.fb.group({
      'password': ['', Validators.required]
    });

    this.route.queryParams.subscribe(params => {
      if (params['access_token']) {
        this.accessToken = params['access_token'];
        this.isResetPassword = true;
      }
    });
  }

  ngAfterViewInit() {
    if (this.isResetPassword) {
      this.password.nativeElement.focus();
    } else {
      this.email.nativeElement.focus();
    }
  }

  async onEmailSubmit() {
    try {
      this.errors = [];
      await this.profile.userControllerResetPassword({ email: this.emailForm.value.email }).toPromise();
      this.isEmailSent = true;
    } catch (e) {
      this.errors = [];
      this.errors.push(e);
    }
  }

  async onResetSubmit() {
    try {
      this.errors = [];
      const token = this.accessToken;
      const newPassword = this.resetForm.value.password;
      await this.profile.userControllerResetPasswordConfirm({token, newPassword}).toPromise();
      this.router.navigateByUrl('/login');
    } catch (e) {
      this.errors = [];
      this.errors.push(e);
    }
  }

}
