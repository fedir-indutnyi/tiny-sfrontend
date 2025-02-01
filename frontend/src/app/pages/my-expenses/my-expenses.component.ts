import { Component, OnInit } from "@angular/core";
import { MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";
import { Router } from "@angular/router";
import { PnldataControllerService } from "../../shared/sdk";
import { DeleteExpensesComponent } from "../delete-expenses/delete-expenses.component";
import { ExpensesLabelModalComponent } from "../expenses-label-modal/expenses-label-modal.component";
import { ImportExpensesComponent } from "../import-expenses/import-expenses.component";
import { AccountService } from "../../shared/account/account.service";

@Component({
  selector: "my-expenses",
  templateUrl: "my-expenses.component.html",
  styleUrls: ["./my-expenses.component.scss"],
})
export class MyExpensesComponent implements OnInit {
  list = [];


  constructor(
    private pnldata: PnldataControllerService,
    private router: Router,
    private diaglo:MatDialog,
    private account: AccountService,
  ) {}

  ngOnInit() {
   this.getData();

  }

  getData(){
    this.pnldata
    .pnldataControllerFind(
      JSON.stringify({
        //fields: any;
        //include: any;
        include: ['createdByProfile'], //include: "userprofile",
        order: "datehappened DESC",
        limit: 100000,
        skip: 0,
        //offset?: any;
        where: {
          typeofdata:{inq:["fact"]}, //or: [{ typeofdata: "fact" }],
          createdbyid:this.account.currentUserValue.id,
        },
      }) as any
    )
    .subscribe((resp) => {
      // console.log(resp);
      this.list = resp;
    });

  }
  onDelete(item) {

    if ( item.isdeleted == true) {
      item.isdeleted = false;
    } else {
      item.isdeleted = true;
    }

    const newUpdate = new Object(
     {
      isdeleted: item.isdeleted
    });

    this.pnldata.pnldataControllerUpdateById(item.id, newUpdate).subscribe(
      (res) => {},
      (error) => {
        console.log(error);
      }
    );
  }

  onEdit(id) {
    // console.log(id);
    this.router.navigateByUrl('/edit-expense/'+ id);
  }

  editLabel(id){
   const dialogRef= this.diaglo.open(ExpensesLabelModalComponent);
   dialogRef.afterClosed().subscribe(res=>{
     if(res){
      const newUpdate = {
        datalabel: res
      };
      this.pnldata.pnldataControllerUpdateById(id, newUpdate).subscribe(
        (res) => {
          this.getData()
        },
        (error) => {
          console.log(error);
        }
      );

     }
   });

  }

  deleteLabel(){
    const dialogRef=this.diaglo.open(DeleteExpensesComponent);
    dialogRef.afterClosed().subscribe(res=>{
      if(res){
        this.list.forEach(item=>{
          if(item.datalabel == res){
            item.isdeleted = true;
            const newUpdate = new Object({
              isdeleted: item.isdeleted
            });
            // console.log(item);

            this.pnldata.pnldataControllerUpdateById(item.id, newUpdate).subscribe(
              (res) => {},
              (error) => {
                console.log(error);
              }
            );

          }
        })
      }
    })
  }
  importExpenses(){
    this.diaglo.open(ImportExpensesComponent)
  }
}
