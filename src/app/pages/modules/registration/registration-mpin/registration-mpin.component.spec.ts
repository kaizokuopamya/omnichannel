import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationMpinComponent } from './registration-mpin.component';

describe('RegistrationMpinComponent', () => {
  let component: RegistrationMpinComponent;
  let fixture: ComponentFixture<RegistrationMpinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationMpinComponent]
    });
    fixture = TestBed.createComponent(RegistrationMpinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
