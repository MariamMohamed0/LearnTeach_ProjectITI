import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sideteacher } from './sideteacher';

describe('Sideteacher', () => {
  let component: Sideteacher;
  let fixture: ComponentFixture<Sideteacher>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sideteacher]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sideteacher);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
