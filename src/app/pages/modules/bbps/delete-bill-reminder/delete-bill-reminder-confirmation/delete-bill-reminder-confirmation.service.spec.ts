import { TestBed } from '@angular/core/testing';

import { DeleteBillReminderConfirmationService } from './delete-bill-reminder-confirmation.service';

describe('DeleteBillReminderConfirmationService', () => {
  let service: DeleteBillReminderConfirmationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteBillReminderConfirmationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
