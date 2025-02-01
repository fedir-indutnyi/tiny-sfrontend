import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
// import {PriceItemModel} from '../../../shared/businessplan-item/shared/price/price-item.model';
// import {Modal} from 'ngx-modal';


@Component({
  selector: 'acceleration-form',
  templateUrl: './acceleration-form.component.html',
  styleUrls: ['./acceleration-form.component.scss']
})

export class AccelerationFormComponent implements OnInit {

    @Output() showModal = new EventEmitter();
    @Output() clearData = new EventEmitter();
    @Input() data: any;
    @Input() isEditPage: any;
    // @ViewChild('accelerationCurveModal', { static: false }) public accelerationCurveModal: Modal;

    lastCurve: number;
    firstCurve: number;

    public ngOnInit(): void {
    }

    showAccelerationCurve() {
      this.showModal.emit();
    }

    closeAcceleration() {
        this.clearData.emit();
    }

    closeAccelerationCurveModal(): void {
        // this.accelerationCurveModal.close();
    }
}
