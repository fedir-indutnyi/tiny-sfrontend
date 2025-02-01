import {Component, OnInit} from '@angular/core';
import {NzModalService} from "ng-zorro-antd/modal";
import {Router} from "@angular/router";
import {lastValueFrom} from "rxjs";

import {UserTeamsControllerService, UserteamsWithRelations} from '@shared/sdk';
import {AccountService} from '@shared/account/account.service';
import {convertPlaceholderPathToUrl} from '@app/utils/dynamic-path';

@Component({
  selector: 'my-teams',
  templateUrl: 'my-teams.component.html',
  styleUrls: ["./my-teams.component.scss"],
})
export class MyTeamsComponent implements OnInit {
  list: UserteamsWithRelations[] = [];
  selectable: boolean = true;
  removable: boolean = true;
  userId: number


  constructor(
    private teamService: UserTeamsControllerService,
    private router: Router,
    private account: AccountService,
    private modal: NzModalService
  ) {
    this.userId = account.currentUserValue.id;
  };

  ngOnInit(): void {
    this.loadTeams().then(value => console.log(value));
  };

  async loadTeams(): Promise<void> {
    const convert = convertPlaceholderPathToUrl;
    const filter = {
      order: 'id DESC',
      //limit: 100,
      skip: 0,
      include: [
        {relation: 'teamOwner'},
        {
          relation: 'members',
          scope: {
            include: [
              {relation: 'user'},
              {relation: 'contact'}
            ]
          }
        },
      ]
    };
    const filterStr = JSON.stringify(filter) as any;
    this.teamService.userTeamsControllerFind(this.userId, filterStr).subscribe({
      next: value => {
        this.list = value.map(item => ({...item, picture: convert(item.picture)}))
      },
      error: (e) => console.log(e)
    });
  };

  async deleteTeam(index: number): Promise<void> {
    await this.modal.warning({
      nzTitle: '<b>Do you realy want to delete this team?</b>',
      nzContent: 'After removing this post you will not be able to recover it back.',
      nzOkText: 'Yes',
      nzCancelText: 'No',
      nzOkType: 'primary',
      nzOnOk: (): void => {
        const item = this.list[index];
        const where = {id: item.id};
        const whereStr = JSON.stringify(where) as any
        lastValueFrom(this.teamService.userTeamsControllerDelete(this.userId, whereStr));
        this.list.splice(index, 1);
        this.router.navigate(['/my-teams']);
      }
    });
  };

  redirectToTeam(id: number): void {
    this.router.navigateByUrl(`/edit-team/${id}`);
  };

  getBackgroundColor(item): string {
    return item ? 'green' : 'gray';
  };

  getPointersEvents(item): string {
    return item ? 'auto' : 'none';
  };

  protected readonly convertPlaceholderPathToUrl = convertPlaceholderPathToUrl;
}
