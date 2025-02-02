import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import * as XLSX from "xlsx";
import { Subject } from "rxjs";
import { convertCSVToArray } from "convert-csv-to-array";
import { AccountService } from "../../shared/account/account.service";

import { PnldataControllerService } from "../../shared/sdk";
import { Router } from "@angular/router";
import { MatLegacyDialogRef as MatDialogRef } from "@angular/material/legacy-dialog";
@Component({
  selector: "app-import-expenses",
  templateUrl: "./import-expenses.component.html",
  styleUrls: ["./import-expenses.component.scss"],
})
export class ImportExpensesComponent implements OnInit {
  keys = [];
  data=[]
  dataSheet = new Subject();
  @ViewChild("inputFile") inputFile: ElementRef;
  worksheet: any;
  inputTSV: string;
  showLabel: boolean = false;

  constructor(
    private serviceExpense: PnldataControllerService,
    private router: Router,
    private account: AccountService,
    private matDialogRef:MatDialogRef<ImportExpensesComponent>
  ) {}

  ngOnInit(): void {}



  onChangeTextArea(evt) {

    this.data = convertCSVToArray(this.inputTSV, {
      separator: '\t', // use the separator you use in your csv (e.g. '\t', ',', ';' ...)
      header:false,
    });

    //here we need to fix datatypes
    const fixedArray = new Array;
    this.data.forEach(item=>{
      // here we need to fix types
      item.ideaid = Number(item.ideaid);
      item.teamId = Number(item.teamId);
      item.approved = Boolean(item.approved);
      item.debtreturned = Boolean(item.debtreturned);
      item.valueofmoney = Number(item.valueofmoney);
      item.isdonation = Boolean(item.isdonation);
      item.quantity = Number(item.quantity);

      //item.createdbyid = this.account.currentUserValue.id;
      fixedArray.push(item);
    });
    this.data = fixedArray;
    // console.log( this.data);
  }


  onChangeFile(evt) {
    let data;
    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length > 1) {
      this.inputFile.nativeElement.value = "";
    }
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      // this.showProgess = true;
      // /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      data = XLSX.utils.sheet_to_json(ws);
    };



    reader.readAsBinaryString(target.files[0]);

    reader.onloadend = (e) => {
      this.keys = Object.keys(data[0]);
      this.dataSheet.next(data);
      // this.showProgess =false;
    };
    let obj: any;
    this.dataSheet.subscribe((res:any) => {
      obj = res;
      // console.log(res);
      this.data=res;
    });
  }

  closeDialog(){
    this.matDialogRef.close();
  }

  uploadSheet(){

    const fixedArray = new Array;
    this.data.forEach(item=>{

    // here we need to replace createdbyid value to this user
    item.createdbyid = this.account.currentUserValue.id;
    fixedArray.push(item);
    });



      this.serviceExpense.pnldataControllerCreateAll(fixedArray).subscribe(
        (res) => {
          this.matDialogRef.close();
          this.router.navigate(["/my-expenses"]);
        },
        (err) => {
          console.log(err);
        }
      );

  }
}
