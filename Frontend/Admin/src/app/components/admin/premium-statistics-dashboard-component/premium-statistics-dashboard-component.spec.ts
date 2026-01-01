import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumStatisticsDashboardComponent } from './premium-statistics-dashboard-component';

describe('PremiumStatisticsDashboardComponent', () => {
  let component: PremiumStatisticsDashboardComponent;
  let fixture: ComponentFixture<PremiumStatisticsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PremiumStatisticsDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PremiumStatisticsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
