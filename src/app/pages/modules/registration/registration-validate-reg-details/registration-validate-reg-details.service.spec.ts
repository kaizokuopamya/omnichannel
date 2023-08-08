import { TestBed } from '@angular/core/testing';

import { RegistrationValidateRegDetailsService } from './registration-validate-reg-details.service';

describe('RegistrationValidateRegDetailsService', () => {
  let service: RegistrationValidateRegDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrationValidateRegDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
