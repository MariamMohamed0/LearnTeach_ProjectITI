import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumOffersComponent } from './premium-offers-component';

describe('PremiumOffersComponent', () => {
  let component: PremiumOffersComponent;
  let fixture: ComponentFixture<PremiumOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PremiumOffersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PremiumOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
