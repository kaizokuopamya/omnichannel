import { TestBed } from '@angular/core/testing';

import { RegistrationUsernameService } from './registration-username.service';

describe('RegistrationUsernameService', () => {
  let service: RegistrationUsernameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrationUsernameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
