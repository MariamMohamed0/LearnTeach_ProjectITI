import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiamondDashboardComponent } from './diamond-dashboard-component';

describe('DiamondDashboardComponent', () => {
  let component: DiamondDashboardComponent;
  let fixture: ComponentFixture<DiamondDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiamondDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiamondDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
