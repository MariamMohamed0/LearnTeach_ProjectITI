import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sidestudent } from './sidestudent';

describe('Sidestudent', () => {
  let component: Sidestudent;
  let fixture: ComponentFixture<Sidestudent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidestudent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sidestudent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
