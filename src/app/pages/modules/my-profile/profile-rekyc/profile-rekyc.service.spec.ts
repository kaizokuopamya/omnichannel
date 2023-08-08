import { TestBed } from '@angular/core/testing';

import { ProfileRekycService } from './profile-rekyc.service';

describe('ProfileUpdateService', () => {
  let service: ProfileRekycService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileRekycService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
