import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationUsernameComponent } from './registration-username.component';

describe('RegistrationUsernameComponent', () => {
  let component: RegistrationUsernameComponent;
  let fixture: ComponentFixture<RegistrationUsernameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationUsernameComponent]
    });
    fixture = TestBed.createComponent(RegistrationUsernameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
