import { TestBed } from '@angular/core/testing';

import { RegistrationTpinService } from './registration-tpin.service';

describe('RegistrationTpinService', () => {
  let service: RegistrationTpinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrationTpinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
