import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillReminderListComponent } from './bill-reminder-list.component';

describe('BillReminderListComponent', () => {
  let component: BillReminderListComponent;
  let fixture: ComponentFixture<BillReminderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillReminderListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillReminderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
