import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  IdeastartuplistControllerService,
  Pnldata,
  PnldataControllerService,
  PnldataWithRelations
} from '../../shared/sdk';
import {FilesControllerService} from '../../shared/sdk';
import {MatLegacyAutocomplete as MatAutocomplete} from '@angular/material/legacy-autocomplete';
import {UntypedFormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {AccountService} from '../../shared/account/account.service';
import {MatLegacyDialog as MatDialog} from '@angular/material/legacy-dialog';
import {map, startWith} from 'rxjs/operators';
import {ExpensesModalComponent} from '../expenses-modal/expenses-modal.component';

@Component({
  selector: 'edit-expense',
  templateUrl: 'edit-expense.component.html',
  styleUrls: ['edit-expense.component.scss'],
})
export class EditExpenseComponent implements OnInit {

  expense: any;
  editor: any;

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
  sponsorid: number;
  sponsorname: any;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private expenses: PnldataControllerService,
    private route: ActivatedRoute,
    private service: IdeastartuplistControllerService,
    private serviceExpense: PnldataControllerService,
    private account: AccountService,
    private uploadService: FilesControllerService,
    private dialog: MatDialog,
    private router: Router
  ) {
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
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
    this.expenses.pnldataControllerFindById(+id).subscribe(res => {
      this.expense = res;
      // console.log(res);

      if (res.factdate) {
        this.date = res.factdate;
      }

      if (res.itemtovalue) {
        this.obj = JSON.parse(res.itemtovalue);
      }

      if (res.pnlrow) {
        this.pnlRow = res.pnlrow;
      }

      if (res.ideaid) {
        this.startupId = res.ideaid;
      }

      if (res.itemname) {
        this.title = res.itemname;
      }

      if (res.sponsorid) {
        this.sponsorid = res.sponsorid;
      }

      if (res.sponsorname) {
        this.sponsorname = res.sponsorname;
      }

      // console.log(this.startupId);

    }, err => {
      console.log(err);
    });

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

  saveexpense() {
    this.expenses.pnldataControllerUpdateById(
      this.expense.id,
      {
        //expensetitle: this.expense.expensetitle,
        //expensedescription: this.expense.expensedescription,
      }
    ).toPromise();
    // console.log(this.expense);
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
    if (this.teams.userid === '') {
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
      ...this.obj,
      sponsorname: this.sponsorname,
      sponsorid: this.sponsorid,
      datehappened: this.date,
      pnlrow: this.pnlRow,
      typeofdata: 'fact',
      factdate: this.date,
      createdbyid: this.account.currentUserValue.id,
    };

    console.log('This is array to be inserted:');
    console.log(obj);

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
