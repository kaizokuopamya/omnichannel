import { TestBed } from '@angular/core/testing';

import { SecurityUpdateService } from './security-update.service';

describe('SecurityUpdateService', () => {
  let service: SecurityUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecurityUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
