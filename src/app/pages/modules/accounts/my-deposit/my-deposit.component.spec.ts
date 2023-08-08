import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDepositComponent } from './my-deposit.component';

describe('MyDepositComponent', () => {
  let component: MyDepositComponent;
  let fixture: ComponentFixture<MyDepositComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyDepositComponent]
    });
    fixture = TestBed.createComponent(MyDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
