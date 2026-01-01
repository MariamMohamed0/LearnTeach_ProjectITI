import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChosseYourPath } from './chosse-your-path';

describe('ChosseYourPath', () => {
  let component: ChosseYourPath;
  let fixture: ComponentFixture<ChosseYourPath>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChosseYourPath]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChosseYourPath);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
