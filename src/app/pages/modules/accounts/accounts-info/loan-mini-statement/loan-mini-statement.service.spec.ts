import { TestBed } from '@angular/core/testing';

import { LoanMiniStatementService } from './loan-mini-statement.service';

describe('LoanMiniStatementService', () => {
  let service: LoanMiniStatementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanMiniStatementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
