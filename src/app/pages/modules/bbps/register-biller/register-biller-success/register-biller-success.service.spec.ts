import { TestBed } from '@angular/core/testing';

import { RegisterBillerSuccessService } from './register-biller-success.service';

describe('RegisterBillerSuccessService', () => {
  let service: RegisterBillerSuccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterBillerSuccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
