import {Component, HostListener, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-up-button',
  templateUrl: './up-button.component.html',
  styleUrls: ['./up-button.component.scss']
})
export class UpButtonComponent implements OnInit {
  showButton: boolean = false;
  buttonClicked: boolean = false;
  container: HTMLElement;
  @Input() targetId: string;

  ngOnInit(): void {
    if (this.targetId) {
      this.container = document.getElementById(this.targetId);
      this.container?.addEventListener('scroll', this.onScroll.bind(this));
    }
  };

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    let verticalOffset = this.targetId ? this.container?.scrollTop : document.documentElement?.scrollTop;

    if (verticalOffset > 200) {
      setTimeout(() => {
        this.showButton = true;
      }, 500)
    } else {
      this.hideButton();
    }
  };

  hideButton(): void {
    this.buttonClicked = true;
    setTimeout(() => {
      this.buttonClicked = false;
      this.showButton = false;
    }, 500)
  };

  onClick(): void {
    if (this.targetId) {
      const scrollStep = -this.container.scrollTop / 30;
      const scrollInterval = setInterval(() => {
        if (this.container.scrollTop !== 0) {
          this.container.scrollBy(0, scrollStep);
        } else {
          clearInterval(scrollInterval);
        }
      }, 16);
    } else {
      document.documentElement.scrollTop = 0;
    }
  };
}
