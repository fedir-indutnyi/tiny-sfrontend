import {Component, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Subscription} from "rxjs";

import {Ideastartuplist, IdeastartuplistControllerService} from '@shared/sdk';
import {AccountService, User} from '@shared/account/account.service';
import {IPostCheckboxOptions} from "@app/interfaces";
import {convertPlaceholderPathToUrl} from "@app/utils/dynamic-path";

@Component({
  selector: 'all-publicideas',
  templateUrl: 'all-publicideas.component.html',
  styleUrls: ['all-publicideas.component.scss'],
})
export class AllPublicideasComponent implements OnInit, OnDestroy {
  accountService: AccountService;
  currentUser: User;
  flatCheckboxValue: Array<string> = [];
  listStartup: boolean = true;
  listDreams: boolean = true;
  listPlans: boolean = true;
  allChecked: boolean = true;
  indeterminate: boolean = false;
  listCommon: Ideastartuplist[];
  limit: number = 10;
  skip: number = 0;
  skipScroll: boolean = false;

  checkboxOptions: IPostCheckboxOptions[] = [
    {label: 'public.startup', value: ['startup'], checked: true},
    {label: 'public.idea', value: ['idea', 'dream'], checked: true},
  ];

  private langChangeSubscription: Subscription;

  constructor(private service: IdeastartuplistControllerService,
              private translateService: TranslateService) {
  };

  ngOnInit(): void {
    const checkboxValue = this.checkboxOptions.filter(value => value.checked)
      .map(value => value.value)
    // this.flatCheckboxValue = [].concat(...checkboxValue);
    this.flatCheckboxValue = checkboxValue.flat();
    this.loadIdeas(this.flatCheckboxValue);
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

  translateLabels(): void {
    this.checkboxOptions.map(value => value.label = this.translateService.instant(value.label))
  };

  updateAllChecked(): void {
    this.skip = 0;
    this.indeterminate = false;
    if (this.allChecked) {
      this.checkboxOptions = this.checkboxOptions.map(item => ({
        ...item,
        checked: true
      }));
      if (this.flatCheckboxValue.length !== 0) {
        this.loadIdeas(this.flatCheckboxValue, true);
      }
      this.listStartup = this.listDreams = this.listPlans = true;
    } else {
      this.checkboxOptions = this.checkboxOptions.map(item => ({
        ...item,
        checked: false
      }));
      this.listStartup = this.listDreams = this.listPlans = false;
    }
  };

  updateSingleChecked(): void {
    this.skip = 0;
    if (this.checkboxOptions.every(item => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.checkboxOptions.every(item => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
    const checkboxValue = this.checkboxOptions.filter(value => value.checked)
      .map(value => value.value);
    const [startupChecked, dreamsChecked, plansChecked] = this.checkboxOptions
      .map(item => item.checked);

    // const flatCheckboxValue = [].concat(...checkboxValue);
    const flatCheckboxValue = checkboxValue.flat();
    this.flatCheckboxValue = flatCheckboxValue;
    if (flatCheckboxValue.length !== 0) {
      this.loadIdeas(flatCheckboxValue, true)
    }
    this.listStartup = startupChecked;
    this.listDreams = dreamsChecked;
    this.listPlans = plansChecked;
  };

  loadIdeas(checkboxValue: Array<string>, isChecked?: boolean): void {
    this.service.ideastartuplistControllerFind(
      JSON.stringify({
        include: ['createdByProfile'],
        order: 'id DESC',
        limit: this.limit,
        skip: this.skip,
        where: {
          and: [
            {
              or: this.recordtypeMap(checkboxValue)
            },
            {
              or: [{isdeleted: 0}, {isdeleted: null}],
            },
            {
              or: [
                {ispublic: 1},
              ]
            }
          ],
        }
      }) as any
    ).subscribe({
      next: (resp) => {
        this.skipScroll = resp.length < this.limit;
        if (!this.skipScroll) {
          this.skip += this.limit;
        }
        const ideas = resp.map(item => {
          return {
            ...item,
            image: convertPlaceholderPathToUrl(item.image),
            ideadescription: convertPlaceholderPathToUrl(item.ideadescription)
          };
        });
        this.listCommon = (this.listCommon === undefined || isChecked) ? ideas : this.listCommon.concat(ideas);
      }, error: (e) => console.log(e)
    });
  };

  recordtypeMap(checkboxValue: Array<string>): Array<object> {
    const newArr = [];
    checkboxValue.map(value => newArr.push({recordtype: value}));
    return newArr;
  };

  getDataIfNotEnd(value: Array<string>): void {
    if (!this.skipScroll) {
      this.loadIdeas(value);
    }
  };
}


