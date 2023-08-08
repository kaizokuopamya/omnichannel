import { TestBed } from '@angular/core/testing';

import { UpaidBillInfosService } from './upaid-bill-infos.service';

describe('UpaidBillInfosService', () => {
  let service: UpaidBillInfosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpaidBillInfosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
