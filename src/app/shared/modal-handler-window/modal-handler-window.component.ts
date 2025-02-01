import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-modal-handler-window',
  templateUrl: './modal-handler-window.component.html',
  styleUrls: ['./modal-handler-window.component.scss']
})
export class ModalHandlerWindowComponent {
  isVisible:boolean = true;

  @Input()
  message:string;

  constructor(private router:Router) {}

  handleOk(): void {
    this.isVisible = false;
    this.router.navigate([`/my-items`]);
  }
}
