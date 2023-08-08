import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityUpdateComponent } from './security-update.component';

describe('SecurityUpdateComponent', () => {
  let component: SecurityUpdateComponent;
  let fixture: ComponentFixture<SecurityUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SecurityUpdateComponent]
    });
    fixture = TestBed.createComponent(SecurityUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
