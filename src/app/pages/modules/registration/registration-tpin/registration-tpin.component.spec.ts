import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationTpinComponent } from './registration-tpin.component';

describe('RegistrationTpinComponent', () => {
  let component: RegistrationTpinComponent;
  let fixture: ComponentFixture<RegistrationTpinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationTpinComponent]
    });
    fixture = TestBed.createComponent(RegistrationTpinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
