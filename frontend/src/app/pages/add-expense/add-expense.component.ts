import {Component, ElementRef, ViewChild} from '@angular/core';
import {AccountService} from '../../shared/account/account.service';
import {PnldataControllerService} from '../../shared/sdk';
import {FilesControllerService} from '../../shared/sdk';
import {Observable} from 'rxjs';
// TODO: refactor code to be used without help of jquery
import * as $ from 'jquery';
import {UntypedFormControl} from '@angular/forms';
import {IdeastartuplistControllerService} from '../../shared/sdk';
import {startWith, map} from 'rxjs/operators';
import {MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig} from '@angular/material/legacy-dialog';
import {ExpensesModalComponent} from '../expenses-modal/expenses-modal.component';
import {Router} from '@angular/router';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatLegacyAutocomplete as MatAutocomplete} from '@angular/material/legacy-autocomplete';

@Component({
  selector: 'add-expense',
  templateUrl: 'add-expense.component.html',
  styleUrls: ['add-expense.component.scss'],
})

export class AddExpenseComponent {
  @ViewChild('teamInput') teamInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  initialUser: any;
  expensetitle: string;
  description: string;
  description_string: string;
  editorOptions = [];
  teams: any;
  selectable = true;
  removable = true;
  date: any = new Date();
  myControl: UntypedFormControl = new UntypedFormControl();
  teamMembers: any = [];
  list = [];
  startupId: any;
  contactId: any;
  pnlRow: any;
  editor: any;
  title: string;
  obj: any = {};
  row = [
    'Gross Sales',
    'Discount',
    'Net Sales',
    'Cost of Goods',
    'Cost of Services',
    'Advertising',
    'Promotion',
    'Opex',
    'Sundry',
  ];
  filteredOptions: Observable<any>;
  sponsorid: 0;
  sponsorname: any;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private service: IdeastartuplistControllerService,
    private serviceExpense: PnldataControllerService,
    private account: AccountService,
    private uploadService: FilesControllerService,
    private dialog: MatDialog,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.service
      .ideastartuplistControllerFind(
        JSON.stringify({
          // include: ['userprofile'],
          order: 'id DESC',
          limit: 1000,
          skip: 0,
          where: {
            and: [
              {
                or: [
                  {createdbyid: this.account.currentUserValue.id},
                  {
                    sharedteams: {
                      like: '%|' + this.account.currentUserValue.id + '|%',
                    },
                  },
                ],
              },
            ],
          },
        }) as any
      )
      .subscribe((resp) => {
        // console.log(resp);
        this.list = resp;
      });
    $.getJSON(
      'https://api.ipdata.co?api-key=936da9b290951b86b73241dd1384c085fd89562269ffe301e50b0a39&fields=city,country_name',
      function (data) {
        // console.log(data);
        $('#locationInput').val(data['country_name'] + ', ' + data['city']);
      }
    );
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
      const obj = {
        userid: user.id,
        username: user.username,
        displayas: user.username,
        email: user.username,
      };
      this.teams = obj;
      this.teamMembers.push(obj);
      this.sponsorid = obj.userid;
      this.sponsorname = obj.username;
      const newUser = JSON.parse(user.personalcontacts);
      newUser.forEach((element) => {
        const obj = {
          userid: element.userid,
          username: element.username,
          displayas: element.displayas,
          email: element.email,
        };
        this.teamMembers.push(obj);
      });
    } else {
      this.teamMembers = [];
    }
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((val) => this._filter(val))
    );
  }

  onChange(title) {
    this.title = title;
  }

  dateChange(event) {
    this.date = event.value;
  }

  onRemove() {
    this.teams = {};
  }

  onReset(event) {
    if (this.teams) {
      this.teams = {};
      this.teams = event.option.value;
    } else {
      this.teams = event.option.value;
    }
    if (this.teams.userid == '') {
      this.sponsorid = 0;
    } else {
      this.sponsorid = this.teams.userid;
    }
    this.sponsorname = this.teams.username;
    this.teamInput.nativeElement.value = '';
  }

  add(event) {
    if (this.teams) {
      this.teams = {};
      const obj = {
        userid: '',
        username: event.value,
        displayas: event.value,
        email: event.value,
      };
      this.teams = obj;
      this.sponsorname = this.teams.username;
      this.sponsorid = 0;
      this.teamInput.nativeElement.value = '';
    }
  }

  private _filter(value: string): any {
    return (
      this.teamMembers &&
      this.teamMembers.filter(
        (option) => option.username.toLowerCase().indexOf(value) === 0
      )
    );
  }

  onStartupSelect(event) {
    this.startupId = event.value;
  }

  onContactSelect(event) {
    this.contactId = event.value;
    // console.log(this.contactId);
  }

  onRowChange(event) {
    this.pnlRow = event.value;
  }

  onEditorCreated(quill) {
    const toolbar = quill.getModule('toolbar');
    toolbar.addHandler('image', this.imageHandler.bind(this));
    this.editor = quill;
  }

  imageHandler() {
    const Imageinput = document.createElement('input');
    Imageinput.setAttribute('type', 'file');
    Imageinput.setAttribute(
      'accept',
      'image/png, image/gif, image/jpeg, image/bmp, image/x-icon'
    );
    Imageinput.classList.add('ql-image');
    Imageinput.addEventListener('change', async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files[0]) return;
      const data = await this.uploadService
        .filesControllerUpload(files[0])
        .toPromise();
      this.pushImageToEditor(data.path);
    });
    Imageinput.click();
  }

  pushImageToEditor(imageURL: string) {
    const {index} = this.editor.getSelection(true);
    this.editor.insertEmbed(index, 'image', imageURL);
    this.editor.setSelection(index + 1);
  }

  createExpense() {
    let id = 0;
    if (this.contactId) {
      id = this.contactId;
    } else {
      id = 0;
    }

    //here is temporary inserting multiple rows as example for data import - later we need to fix this to insert just one expense
    const obj = {
      itemname: this.title,
      ideaid: this.startupId,
      itemtovalue: JSON.stringify(this.obj),
      sponsorname: this.sponsorname,
      sponsorid: this.sponsorid,
      datehappened: this.date,
      pnlrow: this.pnlRow,
      typeofdata: 'fact',
      factdate: this.date,
      createdbyid: this.account.currentUserValue.id,
    };

    // console.log('This is array to be inserted:');
    // console.log(obj);

    this.serviceExpense.pnldataControllerCreate(obj).subscribe(
      (res) => {
        this.router.navigate(['/my-expenses']);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  openModal() {
    const dialogRef = this.dialog.open(ExpensesModalComponent, {
      maxWidth: '100%',
      width: '800px',
      data: this.obj,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.obj = res;
      }
    });
  }
}
