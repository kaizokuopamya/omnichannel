import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileImgComponent } from './profile-img.component';

describe('ProfileImgComponent', () => {
  let component: ProfileImgComponent;
  let fixture: ComponentFixture<ProfileImgComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileImgComponent]
    });
    fixture = TestBed.createComponent(ProfileImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
