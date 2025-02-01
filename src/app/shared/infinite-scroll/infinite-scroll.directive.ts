import {Directive, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';

import {TriggerActionService} from "../services";

export type InfiniteScrollContext = 'self' | 'document';

@Directive({
  selector: '[appInfiniteScroll]',
})

export class InfiniteScrollDirective {
  @Input() infiniteScrollContext: InfiniteScrollContext = 'self';
  @Input() offset: number = 300;
  @Output() onScroll: EventEmitter<any> = new EventEmitter();
  el: any;

  constructor(private element: ElementRef,
              private triggerActionService: TriggerActionService) {
    this.el = element.nativeElement;
  };

  @HostListener('scroll', ['$event']) onElementScroll() {
    if (this.elementEndReachedInSelfScrollbarContext() && this.triggerActionService.canTriggerAction) {
      this.triggerAction();
    }
  };

  triggerAction() {
    this.triggerActionService.canTriggerAction = false;
    this.onScroll.emit(null);
  };

  elementEndReachedInSelfScrollbarContext(): boolean {
    return this.el.scrollTop + this.el.clientHeight >= (this.el.scrollHeight - this.offset);
  };
}
