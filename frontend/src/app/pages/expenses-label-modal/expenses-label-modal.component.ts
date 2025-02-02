import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-expenses-label-modal',
  templateUrl: './expenses-label-modal.component.html',
  styleUrls: ['./expenses-label-modal.component.scss']
})
export class ExpensesLabelModalComponent implements OnInit {
  planfact='f';
  labelcontent:any;
  constructor(
    private dialogRef:MatDialogRef<ExpensesLabelModalComponent>
  ) { }

  ngOnInit(): void {
  }

  closeLabelEditDialog() {
    this.dialogRef.close();
  }
  submitLabelEditDialog(){
    const text = this.planfact +":"+ this.labelcontent;
    this.dialogRef.close(text)
  }

}
