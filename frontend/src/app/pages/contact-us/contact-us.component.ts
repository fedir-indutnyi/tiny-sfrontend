import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '@app/shared/account/account.service';
import { UserControllerService } from '@app/shared/sdk/api/userController.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact-us',
  templateUrl: 'contact-us.component.html',
  styleUrls: ['contact-us.component.scss']
})
export class ContactUsComponent implements OnInit, OnDestroy {

  private readonly STORAGE_KEY = 'CONTACT_FORM';

  form: FormGroup;
  formToStorageSync: Subscription;

  constructor(
    private account: AccountService,
    private profile: UserControllerService,
    private messagesService: NzMessageService
  ) {}

  ngOnInit() {
    this.initForm();
    this.restoreFormData();
    this.startKeepingFormData();
  }

  ngOnDestroy() {
    this.stopKeepingFormData();
  }

  submit() {
    const request = {
      userId: this.account.currentUserValue.id,
      userName: this.account.currentUserValue.username,
      ...this.form.value,
    };
    this.profile.userControllerCreateTicket(request)
      .subscribe({
        next: () => {
          this.messagesService.success(`Your request has been sent`);
          this.form.reset();
          localStorage.removeItem(this.STORAGE_KEY);
        }, 
        error: (e) => {
          this.messagesService.error(e.error.error.message);
        }
      });
  }

  private initForm() {
    this.form = new FormGroup({
      category: new FormControl('question'),
      email: new FormControl(this.account.currentUserValue.email, [Validators.required, Validators.email]),
      message: new FormControl('', [Validators.required]),
    });
  }

  private restoreFormData() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if(data) {
      this.form.patchValue(JSON.parse(data));
      this.form.markAllAsTouched();
    }
  }

  private startKeepingFormData() {
    this.formToStorageSync = this.form.valueChanges
      .subscribe(() => {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.form.value));
      });
  }

  private stopKeepingFormData() {
    this.formToStorageSync.unsubscribe();
  }
}

