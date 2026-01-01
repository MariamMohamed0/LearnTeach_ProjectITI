import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDiamondComponent } from './edit-diamond-component';

describe('EditDiamondComponent', () => {
  let component: EditDiamondComponent;
  let fixture: ComponentFixture<EditDiamondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDiamondComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDiamondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
