import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotMpinMobComponent } from './forgot-mpin-mob.component';

describe('ForgotMpinMobComponent', () => {
  let component: ForgotMpinMobComponent;
  let fixture: ComponentFixture<ForgotMpinMobComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForgotMpinMobComponent]
    });
    fixture = TestBed.createComponent(ForgotMpinMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
