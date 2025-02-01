import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesLabelModalComponent } from './expenses-label-modal.component';

describe('ExpensesLabelModalComponent', () => {
  let component: ExpensesLabelModalComponent;
  let fixture: ComponentFixture<ExpensesLabelModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpensesLabelModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensesLabelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
