import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationValidateRegDetailsComponent } from './registration-validate-reg-details.component';

describe('RegistrationValidateRegDetailsComponent', () => {
  let component: RegistrationValidateRegDetailsComponent;
  let fixture: ComponentFixture<RegistrationValidateRegDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationValidateRegDetailsComponent]
    });
    fixture = TestBed.createComponent(RegistrationValidateRegDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
