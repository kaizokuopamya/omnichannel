import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonOtpComponent } from './common-otp.component';

describe('CommonOtpComponent', () => {
  let component: CommonOtpComponent;
  let fixture: ComponentFixture<CommonOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonOtpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
