import { TestBed } from '@angular/core/testing';

import { BillReminderListService } from './bill-reminder-list.service';

describe('BillReminderListService', () => {
  let service: BillReminderListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillReminderListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
