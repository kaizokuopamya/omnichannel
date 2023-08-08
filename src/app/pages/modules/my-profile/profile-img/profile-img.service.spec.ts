import { TestBed } from '@angular/core/testing';

import { ProfileImgService } from './profile-img.service';

describe('ProfileImgService', () => {
  let service: ProfileImgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileImgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
