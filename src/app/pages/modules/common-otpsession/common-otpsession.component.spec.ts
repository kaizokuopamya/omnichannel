import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonOtpsessionComponent } from './common-otpsession.component';

describe('CommonOtpsessionComponent', () => {
  let component: CommonOtpsessionComponent;
  let fixture: ComponentFixture<CommonOtpsessionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommonOtpsessionComponent]
    });
    fixture = TestBed.createComponent(CommonOtpsessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
