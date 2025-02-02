import { Component, Inject, OnInit } from "@angular/core";
import {
  MatLegacyDialog as MatDialog,
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from "@angular/material/legacy-dialog";

@Component({
  selector: "app-contact-modal",
  templateUrl: "./contact-modal.component.html",
  styleUrls: ["./contact-modal.component.scss"],
})
export class ContactModalComponent implements OnInit {
  userName: string;
  email: string;
  displayas: string;
  constructor(
    private dialogRef: MatDialogRef<ContactModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    if(this.data){
    this.userName = this.data.username,
      this.email = this.data.email,
      this.displayas = this.data.displayas;
  }
}

  closeDialog() {
    this.dialogRef.close();
  }
  submit() {
    let id: any;  
    if (this.data) {
      id = this.data.userid;
    } else {
      id = "";
    }
    const obj = {
      userid: id,
      username: this.userName,
      displayas: this.displayas,
      email: this.email,
    };

    this.dialogRef.close(obj);
  }
}
