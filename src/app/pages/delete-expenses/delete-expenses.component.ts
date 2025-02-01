import { Component, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-delete-expenses',
  templateUrl: './delete-expenses.component.html',
  styleUrls: ['./delete-expenses.component.scss']
})
export class DeleteExpensesComponent implements OnInit {
  label:any;
  constructor(
    private dialogRef:MatDialogRef<DeleteExpensesComponent>
  ) { }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close();
  }
  submit(){
    this.dialogRef.close(this.label)
  }


}
