import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactSearchBbpsComponent } from './contact-search-bbps.component';

describe('ContactSearchBbpsComponent', () => {
  let component: ContactSearchBbpsComponent;
  let fixture: ComponentFixture<ContactSearchBbpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactSearchBbpsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactSearchBbpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
