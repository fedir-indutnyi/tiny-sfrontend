import {Component, OnInit} from "@angular/core";
import {lastValueFrom} from 'rxjs';

import {NzModalService} from "ng-zorro-antd/modal";
import {UserControllerService} from "../../shared/sdk";
import {AccountService, User} from "../../shared/account/account.service";
import {NzMessageService} from "ng-zorro-antd/message";
import {CountryEnum} from "../../shared/enum/country.enum";
import {IEditProfileForm} from "./edit-profile/edit-profile.component";
import {convertUrlToPlaceholderPath} from "../../utils/dynamic-path";
import { UserSubscription } from "@app/shared/models/userSubscription.model";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  isEditMode: boolean = false;
  isSubmitting = false;
  currentUser: User;
  userStatus: string; // role - admin or user
  userJoinDate: string;
  userSubscription: UserSubscription;
  errors: Array<{ name: string; status: string; message: string }>;
  countryList = CountryEnum;
  userName: string;
  isShowContacts = false;

  constructor(
    private account: AccountService,
    private modal: NzModalService,
    private profileService: UserControllerService,
    private messagesService: NzMessageService
  ) {
    this.account = account;
    this.currentUser = this.account.currentUserValue;
    this.userSubscription = this.account.currentUserSubscription;
    this.userStatus = this.currentUser.userrole || "Forever Free";
  }

  ngOnInit() {
    // TODO: Reafctored currentDate stub when&if its implementd on backend side
    this.currentUser = this.account.currentUserValue;
    let currentDate = new Date(this.account.currentUserValue.createdAt);

    this.userJoinDate = `${currentDate.toLocaleDateString('default', {month: 'long',})} ${currentDate.getFullYear()}`;
  }

  async onProfilePhotoChange(event) {
    const picture = convertUrlToPlaceholderPath(event.absolutePath)
    await lastValueFrom(this.profileService.userControllerUpdateById(this.currentUser.id, {picture}));
    this.currentUser = {...this.currentUser, picture: convertUrlToPlaceholderPath(event.absolutePath)}
    // Update LocalStorage
    this.account.updateCurrentUser(this.currentUser);
  }

  editProfileData(): void {
    this.isEditMode = !this.isEditMode
  }

  cancelFormEditting(): void {
    this.isEditMode = !this.isEditMode
  }

  updateCurrentUser(data: IEditProfileForm): void {
    this.profileService
      .userControllerUpdateById(this.currentUser.id, {
        id: this.currentUser.id,
        username: data.userName,
        email: data.email,
        phone: data.phone,
        location: data.location,
        commentmemo: data.commentMemo,
      })
      .subscribe({
        next: (_) => {
          console.log(_)
          this.messagesService.success("Profile successfully update");
          // Update LocalStorage
          this.account.updateCurrentUser({
            ...this.currentUser,
            id: this.currentUser.id,
            username: data.userName,
            email: data.email,
            phone: data.phone,
            location: data.location,
            commentmemo: data.commentMemo,
          });

          this.currentUser = this.account.currentUserValue;
        },
        error: (e) => {
          console.error(e)
          this.messagesService.error(e.error.error.message)
        }
      });
  };

  showDeleteConfirm(): void {
    this.modal.confirm({
      nzTitle: "Delete current user profile",
      nzContent: "Are you sure delete this profile?",
      nzOkText: "Yes",
      nzOkType: "primary",
      nzOkDanger: true,
      nzOnOk: () => {
        this.removeCurrentUser();
      },
      nzCancelText: "No",
    });
  };

  private removeCurrentUser(): void {
    this.profileService.userControllerUpdateById(this.currentUser.id, {
      inactive: true,
    }).subscribe({
      next: (_) => {
        this.messagesService.success("Profile successfully deleted");
        this.account.logout();
      },
      error: (error) => {
        this.messagesService.error(error.error);
      },
    });
  };

  onProfilePhotoClick() {
    const fileInput = document.querySelector('.hidden-upload input[type="file"]');
    fileInput?.dispatchEvent(new MouseEvent('click'));
  }

  async removeProfilePhoto() {
    try {
      await lastValueFrom(this.profileService.userControllerUpdateById(this.currentUser.id, { picture: "" }));
      this.currentUser = { ...this.currentUser, picture: null };
      // Update LocalStorage
      this.account.updateCurrentUser(this.currentUser);
      this.messagesService.success("Profile photo removed successfully");
    } catch (error) {
      this.messagesService.error("Failed to remove profile photo");
      console.error(error);
    }
  }
}
