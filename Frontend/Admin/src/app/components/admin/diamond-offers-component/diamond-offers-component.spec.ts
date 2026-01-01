import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiamondOffersComponent } from './diamond-offers-component';

describe('DiamondOffersComponent', () => {
  let component: DiamondOffersComponent;
  let fixture: ComponentFixture<DiamondOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiamondOffersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiamondOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
