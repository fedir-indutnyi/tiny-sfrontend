import {Component, OnInit} from '@angular/core';

import {GlobalService, MenuService} from '../../services';
import {UserControllerService} from "../../sdk";
import {ISideBarInfo} from "../../../interfaces";

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [MenuService]
})
export class SidebarComponent implements OnInit {
  public menuInfo: Array<ISideBarInfo> = [];
  public sidebarToggle:boolean = true;
  userRole: string;

  constructor(private _menuService: MenuService,
              public _globalService: GlobalService,
              private userService: UserControllerService) {
  }

  ngOnInit():void {
    this.getActiveUser();
    this.menuInfo = this._menuService.putSidebarJson();
    this._sidebarToggle();
    this._menuService.selectItem(this.menuInfo);
    this._isSelectItem(this.menuInfo);
  }

  public _sidebarToggle() {
    this._globalService.data$.subscribe(data => {
      if (data.ev === 'sidebarToggle') {
        this.sidebarToggle = data.value;
      }
    }, error => {
      console.log('Error: ' + error);
    });

  }

  _isSelectItem(item) {
    for (const i in item) {
      if (item[i].children) {
        for (const index in item[i].children) {
          if (item[i].children[index].isActive || item[i].children[index].toggle === 'on') {
            item[i].toggle = 'on';
            break;
          } else {
            this._isSelectItem(item[i].children);
          }
        }
      }
    }
  }
  getActiveUser():void{
    this.userService.userControllerWhoAmI().subscribe((value) => {
      this.userService.userControllerFindById(+value)
        .subscribe(value => this.userRole = value.userrole)
    });
  };
}
