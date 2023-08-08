import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobBillerListComponent } from './mob-biller-list.component';

describe('MobBillerListComponent', () => {
  let component: MobBillerListComponent;
  let fixture: ComponentFixture<MobBillerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobBillerListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobBillerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
