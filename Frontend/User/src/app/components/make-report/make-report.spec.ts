import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeReport } from './make-report';

describe('MakeReport', () => {
  let component: MakeReport;
  let fixture: ComponentFixture<MakeReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MakeReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MakeReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
