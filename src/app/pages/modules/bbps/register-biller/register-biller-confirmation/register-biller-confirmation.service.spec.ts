import { TestBed } from '@angular/core/testing';

import { RegisterBillerConfirmationService } from './register-biller-confirmation.service';

describe('RegisterBillerConfirmationService', () => {
  let service: RegisterBillerConfirmationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterBillerConfirmationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
