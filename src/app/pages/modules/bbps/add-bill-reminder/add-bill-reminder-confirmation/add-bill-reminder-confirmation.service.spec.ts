import { TestBed } from '@angular/core/testing';

import { AddBillReminderConfirmationService } from './add-bill-reminder-confirmation.service';

describe('AddBillReminderConfirmationService', () => {
  let service: AddBillReminderConfirmationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddBillReminderConfirmationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
