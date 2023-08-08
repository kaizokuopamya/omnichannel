import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonOtpEmailPopupComponent } from './common-otp-email-popup.component';

describe('CommonOtpEmailPopupComponent', () => {
  let component: CommonOtpEmailPopupComponent;
  let fixture: ComponentFixture<CommonOtpEmailPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommonOtpEmailPopupComponent]
    });
    fixture = TestBed.createComponent(CommonOtpEmailPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
