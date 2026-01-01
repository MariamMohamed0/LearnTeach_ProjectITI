import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YouProfileComponent } from './you-profile-component';

describe('YouProfileComponent', () => {
  let component: YouProfileComponent;
  let fixture: ComponentFixture<YouProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YouProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YouProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
