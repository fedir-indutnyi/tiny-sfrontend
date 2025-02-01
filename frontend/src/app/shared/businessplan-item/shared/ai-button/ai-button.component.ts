import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { Store } from '@ngrx/store';
import { Selectors } from '../../store';
import { Subject, takeUntil } from 'rxjs';
import { BusinessplanSetting } from '../../typings';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { FormsModule } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-ai-button',
  standalone: true,
  imports: [CommonModule,
    NzModalModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzTypographyModule,
    FormsModule,
    NzToolTipModule
  ],
  templateUrl: './ai-button.component.html',
  styleUrls: ['./ai-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiButtonComponent implements OnInit, OnDestroy {
  private readonly unsubscribe$: Subject<void> = new Subject();
  @Input() AIPromtWithInputs: string;
  @Input() initialData: any;
  @Output() saveData: EventEmitter<any> = new EventEmitter();
  AIPromptText: string;
  public AIAnswer: string;
  isModalVisible = false;
  private businessPlanSettings: BusinessplanSetting;


  constructor(
    private _store: Store,
    private _message: NzMessageService 
  ) { }

  ngOnInit(): void {
    this._store.select(Selectors.selectBusinessPlanSettingsState)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((businessPlanSettings) => {
        this.businessPlanSettings = businessPlanSettings.businessplanSettings

        this.AIPromptText = this.AIPromtWithInputs;
        var inputs = this.AIPromptText.match(/##(.*?)##/g);
        inputs.forEach((input) => {
          var inputText = input.slice(2, -2);
          this.AIPromptText = this.AIPromptText.replace(input, this.businessPlanSettings[inputText]);
        })
      });

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  applyAnswer(): void {
    try {
      let givenData = this.AIAnswer.substring(this.AIAnswer.indexOf('['), this.AIAnswer.indexOf(']') + 1);
      var givenObjects = JSON.parse(givenData) as any[]; 
      givenObjects = givenObjects.map((object, index) => {
        object = {...this.initialData, ...object, id: index};
        if (typeof this.initialData != typeof object) throw new Error("Incorrect data sent");
        return object;
      })
      this.saveData.emit(givenObjects);
      this._message.success('Answer was sucessfully applied');
      this.toggleModal();
    }catch(error){
      this._message.error(error, {
        nzDuration: 6000
      });
    }
  }

  toggleModal(): void {
    this.isModalVisible = !this.isModalVisible
  }

}
