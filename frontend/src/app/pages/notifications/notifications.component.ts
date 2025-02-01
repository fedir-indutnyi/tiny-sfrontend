import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {NzNotificationService} from "ng-zorro-antd/notification";
import {TranslateService} from "@ngx-translate/core";
import {Subscription} from "rxjs";

import {NotificationsControllerService, NotificationsWithRelations} from "@shared/sdk";
import {AccountService} from "@shared/account/account.service";
import {convertPlaceholderToNotification, convertPlaceholderToTitle} from "@app/utils/dynamic-notification";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  animations: [
    trigger('fadeAnimation', [
      state('visible', style({opacity: 1})),
      state('hidden', style({opacity: 0, display: 'none'})),
      transition('hidden => visible', animate('300ms ease-in')),
      transition('visible => hidden', animate('300ms ease-out'))
    ])
  ]
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private langChangeSubscription: Subscription;
  protected readonly convertPlaceholderToNotification = convertPlaceholderToNotification;
  protected readonly convertPlaceholderToTitle = convertPlaceholderToTitle;
  currentUserId: number
  checked: boolean = false;
  indeterminate: boolean = false;
  listOfCurrentPageData: readonly NotificationsWithRelations[] = [];
  list: NotificationsWithRelations[] = [];
  setOfCheckedId: Set<number> = new Set<number>();
  isConfirmDelete: boolean = false;
  listOfSelection = [
    {
      text: 'notification.selectAll',
      onSelect: () => {
        this.onAllChecked(true);
      }
    },
    {
      text: 'notification.selectAllUnread',
      onSelect: (): void => {
        this.listOfCurrentPageData.forEach((data) => this.updateCheckedSet(data.id, !data.isRead));
        this.refreshCheckedStatus();
      }
    },
    {
      text: 'notification.selectAllReaded',
      onSelect: (): void => {
        this.listOfCurrentPageData.forEach((data) => this.updateCheckedSet(data.id, data.isRead));
        this.refreshCheckedStatus();
      }
    }
  ];

  constructor(private notificationsService: NotificationsControllerService,
              private account: AccountService,
              private notification: NzNotificationService,
              private translateService: TranslateService,
  ) {
  };

  ngOnInit(): void {
    this.getCurrentUser();
    this.getNotifications();
    this.translateLabels();
    this.langChangeSubscription = this.translateService.onLangChange.subscribe(() => {
      this.translateLabels();
    });
  };

  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  };

  getCurrentUser(): void {
    this.currentUserId = this.account.currentUserValue.id;
    // this.userService.userControllerWhoAmI().subscribe(value => {
    //   this.currentUserId = value
    // })
  };

  getNotifications(): void {
    console.log(this.currentUserId)
    this.notificationsService.notificationsControllerFind(
      JSON.stringify({
        order: 'id DESC',
        limit: 1000,
        skip: 0,
        where: {
          userprofileId: this.currentUserId,
          isDeleted: null, //todo
        }
      }) as any
    ).subscribe({
      next: (resp) => {
        this.list = resp;
        console.log(resp)
      }, error: err => console.log(err)
    });
  };

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  };

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  };

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  };

  onCurrentPageDataChange($event: readonly NotificationsWithRelations[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  };

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  };

  fieldForRead(): Array<object> {
    const arr = []
    this.setOfCheckedId.forEach(value => arr.push({id: value}));
    return arr
  };

  changeField(fieldToChange: string, singleFieldId: number | null = null): void {
    this.notificationsService.notificationsControllerUpdateAll(
      JSON.stringify({
        and: [
          {
            or: singleFieldId ? [{id: singleFieldId}] : this.fieldForRead()
          },
        ],
      }) as any, {[`${fieldToChange}`]: true}
    ).subscribe({
      next: (value) => {
        console.log(value);
        this.setOfCheckedId.clear()
        this.getNotifications();
      },
      error: err => console.log(err)
    })
  };

  showMessage(template: TemplateRef<{}>, data: NotificationsWithRelations): void {
    data.isRead !== true && this.changeField('isRead', data.id);
    this.notification.template(template, {nzData: data});
  };

  translateLabels(): void {
    this.listOfSelection.map(value => value.text = this.translateService.instant(value.text));
  };
}
