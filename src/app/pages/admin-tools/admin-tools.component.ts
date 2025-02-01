import {Component, OnInit} from '@angular/core';

import {UserControllerService, UserWithRelations} from "../../shared/sdk";

@Component({
  selector: 'app-admin-tools',
  templateUrl: './admin-tools.component.html',
  styleUrls: ['./admin-tools.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminToolsComponent implements OnInit {
  selectedTabIndex: 0;
  searchValue: string = '';
  visible: boolean = false;
  listOfData: UserWithRelations[] = [];
  listOfDisplayData: UserWithRelations[];
  originId: number | null = null;
  loginAsId: number | null = null;
  whoAmIId: number;
  listOfColumn = [
    {
      title: 'User Name',
      compare: (a: UserWithRelations, b: UserWithRelations) => a.username.localeCompare(b.username),
      priority: 4
    },
    {
      title: 'User ID',
      compare: (a: UserWithRelations, b: UserWithRelations) => a.id - b.id,
      priority: 3
    },
    {
      title: 'Email',
      compare: (a: UserWithRelations, b: UserWithRelations) => a.email.localeCompare(b.email),
      priority: 2
    },
    {
      title: 'Created',
      compare: (a: UserWithRelations, b: UserWithRelations) => a?.createdAt?.split('T')[0].localeCompare(b?.createdAt?.split('T')[0]),
      priority: 1
    },
    {
      title: 'Action',
    }
  ];

  constructor(private userService: UserControllerService) {
  };

  ngOnInit(): void {
    this.originId = JSON.parse(localStorage.getItem('originUser'))?.id || null;
    if (this.originId) {
      this.loginAsId = JSON.parse(localStorage.getItem('currentUser'))?.id;
    }
    this.getUsers();
    this.userService.userControllerWhoAmI().subscribe(value => this.whoAmIId = +value)
  };

  getUsers(): void {
    this.userService.userControllerFind().subscribe({
      next: (value) => {
        this.listOfData = this.listOfDisplayData = value;
      }, error: (e) => console.log(e)
    })
  };

  reset(): void {
    this.searchValue = '';
    this.search();
  };

  search(): void {
    this.listOfDisplayData = this.listOfData.filter((item) => item.username.toLowerCase().indexOf(this.searchValue.toLowerCase()) !== -1);
  };

  loginAs(user: UserWithRelations): void {
    this.loginAsId = user.id;
    const currentUser = localStorage.getItem('currentUser');
    const currentUserObj = JSON.parse(currentUser);
    const ninja = {...user, token: currentUserObj.token};
    localStorage.setItem('originUser', currentUser);
    localStorage.setItem('currentUser', JSON.stringify(ninja));
    location.reload();
  };

  logoutAs(): void {
    this.loginAsId = null;
    this.originId = null;
    const originUser = localStorage.getItem('originUser');
    localStorage.setItem('currentUser', originUser);
    localStorage.removeItem('originUser');
    location.reload();
  };
}
