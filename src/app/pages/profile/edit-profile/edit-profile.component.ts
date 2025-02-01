import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/shared/account/account.service';

export interface IEditProfileForm {
  userName: string;
  email: string;
  location: string;
  phone: string;
  commentMemo: string;
}

type IProfileFormT<Type>  =  {
  [Property in keyof Type ]: FormControl<Type[Property]>
};

type IProfileForm = IProfileFormT<IEditProfileForm>;

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  @Input() data: User;
  @Output() onSaveEvent = new EventEmitter();
  @Output() onCancelEvent = new EventEmitter();
  @Output() onDeleteEvent = new EventEmitter();

  profileFB: FormGroup<IProfileForm>;

  constructor(private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.initForm();
  }

  submitForm(form: FormGroup<IProfileForm>): void {
    this.onSaveEvent.emit(form.value);

  }

  deleteProfile(): void {
    this.onDeleteEvent.emit();
  }

  cancelEditing(): void {
    this.onCancelEvent.emit()
    this.profileFB.reset();
  }

  private initForm() {
    this.profileFB = this.fb.group({
      userName: this.fb.nonNullable.control(this.data.username, [Validators.required]),
      email: this.fb.nonNullable.control(this.data.email, [Validators.required, Validators.email]),
      location: this.fb.nonNullable.control(this.data.location),
      phone: [this.data.phone, [Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(12)]],
      commentMemo: this.data.commentmemo
    });
  }



}
