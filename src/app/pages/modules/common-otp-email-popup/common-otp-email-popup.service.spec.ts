import { TestBed } from '@angular/core/testing';

import { CommonOtpEmailPopupService } from './common-otp-email-popup.service';

describe('CommonOtpEmailPopupService', () => {
  let service: CommonOtpEmailPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonOtpEmailPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
