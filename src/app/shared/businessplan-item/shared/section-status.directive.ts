import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ExecutionStatusCode } from '../store/models';

const statusColor = {
  [ExecutionStatusCode.INITIAL]: '#00000080',
  [ExecutionStatusCode.IN_PROGRESS]: '#fdad34',
  [ExecutionStatusCode.COMPLETE]: '#1890ff',
}
@Directive({
  selector: '[appSectionStatus]',
  standalone: true
})
export class SectionStatusDirective implements OnInit, OnChanges {
  @Input() appSectionStatus: ExecutionStatusCode;

  constructor(private el: ElementRef) { }


  ngOnInit(): void {
    // this.el.nativeElement.firstChild.style.color = statusColor[this.appSectionStatus] || statusColor[ExecutionStatusCode.INITIAL];
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.el.nativeElement.firstChild.style.color = statusColor[this.appSectionStatus] || statusColor[ExecutionStatusCode.INITIAL];
  }
}
