import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {lastValueFrom} from "rxjs";

import {UsercontactControllerService, UserContactsControllerService, UsercontactsWithRelations} from "../../sdk";
import {AccountService} from "../../account/account.service";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-contacts-modal',
  templateUrl: './contacts-modal.component.html',
  styleUrls: ['./contacts-modal.component.scss']
})
export class ContactsModalComponent implements OnInit {

  isVisible: boolean = true;
  contactsLoading: boolean = false;
  addContactLoading: boolean = false;
  tableChecked: boolean = false;
  tableIndeterminate: boolean = false;
  checkedForDeleteId: number | null = null;
  checkedForEditId: number | null = null;
  contacts: UsercontactsWithRelations[] = [];
  listOfCurrentPageData: ReadonlyArray<UsercontactsWithRelations> = [];
  setOfCheckedId: Set<number> = new Set<number>();

  contactName: string;
  contactEmail: string;
  contactPhone: string;

  @Input() setOfDisableId: Set<number> = new Set<number>();
  @Input() showChooseBtn: boolean = true;
  @Output() onUpdateContact: EventEmitter<UsercontactsWithRelations> = new EventEmitter<UsercontactsWithRelations>();
  @Output() onChooseContacts: EventEmitter<UsercontactsWithRelations[]> = new EventEmitter<UsercontactsWithRelations[]>();
  @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private account: AccountService,
    private userContactsService: UserContactsControllerService,
    private contactService: UsercontactControllerService,
    private messagesService: NzMessageService,
  ) {
  };

  ngOnInit(): void {
    this.loadContacts().then();
  };

  async loadContacts(): Promise<void> {
    const userId = this.account.currentUserValue.id;
    this.contactsLoading = true;
    this.contacts = await this.userContactsService.userContactsControllerFind(userId).toPromise();
    this.contactsLoading = false;
  };

  async addContact(): Promise<void> {
    const userId = this.account.currentUserValue.id;
    const contact: UsercontactsWithRelations = {
      name: this.contactName,
      email: this.contactEmail,
      telephone: this.contactPhone,
    };
    this.addContactLoading = true;
    const newContact = await lastValueFrom(this.userContactsService
      .userContactsControllerCreate(userId, contact));
    this.contacts = [...this.contacts, newContact];
    this.addContactLoading = false;
    this.contactName = '';
    this.contactEmail = '';
    this.contactPhone = '';
    this.refreshCheckedStatus();
  };

  updateContact(): void {
    const updatedItems = {
      name: this.contactName || '',
      email: this.contactEmail || '',
      telephone: this.contactPhone || '',
    };
    const updatedItemsStr = JSON.stringify(updatedItems) as any;
    this.contactService.usercontactControllerUpdateById(this.checkedForEditId, updatedItemsStr)
      .subscribe({
        next: () => {
          let selectedContacts = this.contacts.filter(data => this.checkedForEditId === data.id);
          const contact = Object.assign({}, selectedContacts[0], updatedItems);

          this.contacts = this.contacts.map(value => value.id === this.checkedForEditId
            ? Object.assign({}, value, updatedItems) : value
          );
          this.onUpdateContact.emit(contact)
          this.contactName = '';
          this.contactEmail = '';
          this.contactPhone = '';
          this.checkedForEditId = null;
          this.messagesService.success('Done!')
        }, error: (e) => {
          this.messagesService.error(e.error.error.message)
          console.log(e)
        }
      })
  };

  async deleteContact(id: number, e: MouseEvent) {
    e.preventDefault();
    const updatedItems = {belongstouser: 0};
    const updatedItemsStr = JSON.stringify(updatedItems) as any;
    await this.contactService.usercontactControllerUpdateById(id, updatedItemsStr)
      .subscribe({
        next: () => {
          this.setOfCheckedId.delete(id);
          this.contacts = this.contacts.filter(i => i.id !== id);
          this.refreshCheckedStatus();
          this.checkedForDeleteId = null;
        }, error: (e) => console.log(e)
      });
  };

  chooseContacts(): void {
    const selectedContacts = this.contacts.filter(data => this.setOfCheckedId.has(data.id));
    this.setOfCheckedId.clear();
    this.refreshCheckedStatus();
    this.onChooseContacts.emit(selectedContacts);
  };

  handleCancel(): void {
    this.isVisible = false;
    setTimeout(() => this.onCancel.emit(), 100);
  };

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  };

  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData
      .filter(i => !this.setOfDisableId.has(i.id))
      .forEach(({id}) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  };

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  };

  onCurrentPageDataChange(listOfCurrentPageData: ReadonlyArray<UsercontactsWithRelations>): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  };

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfCurrentPageData.filter(i => !this.setOfDisableId.has(i.id));
    this.tableChecked = listOfEnabledData.every(({id}) => this.setOfCheckedId.has(id));
    this.tableIndeterminate = listOfEnabledData
      .some(({id}) => this.setOfCheckedId.has(id)) && !this.tableChecked;
  };

  //todo change member interface
  onEditContact(member: any, e: MouseEvent): void {
    e.preventDefault();
    this.contactName = member.name;
    this.contactEmail = member.email;
    this.contactPhone = member.telephone;
    this.checkedForEditId = member.id;
  };

  cancelEditing(e: MouseEvent) {
    e.preventDefault();
    this.contactName = '';
    this.contactEmail = '';
    this.contactPhone = '';
    this.checkedForEditId = null;
  };
}
