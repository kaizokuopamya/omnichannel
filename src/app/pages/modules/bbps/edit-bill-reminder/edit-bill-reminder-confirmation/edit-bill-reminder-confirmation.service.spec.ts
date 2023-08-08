import { TestBed } from '@angular/core/testing';

import { EditBillReminderConfirmationService } from './edit-bill-reminder-confirmation.service';

describe('EditBillReminderConfirmationService', () => {
  let service: EditBillReminderConfirmationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditBillReminderConfirmationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
