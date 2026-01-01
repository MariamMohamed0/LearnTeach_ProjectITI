import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumAddOfferComponent } from './premium-add-offer-component';

describe('PremiumAddOfferComponent', () => {
  let component: PremiumAddOfferComponent;
  let fixture: ComponentFixture<PremiumAddOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PremiumAddOfferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PremiumAddOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
