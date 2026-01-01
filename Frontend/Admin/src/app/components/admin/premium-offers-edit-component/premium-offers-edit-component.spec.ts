import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumOffersEditComponent } from './premium-offers-edit-component';

describe('PremiumOffersEditComponent', () => {
  let component: PremiumOffersEditComponent;
  let fixture: ComponentFixture<PremiumOffersEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PremiumOffersEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PremiumOffersEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
