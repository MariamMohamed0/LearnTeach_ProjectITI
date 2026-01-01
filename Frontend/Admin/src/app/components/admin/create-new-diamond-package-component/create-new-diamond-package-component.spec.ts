import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewDiamondPackageComponent } from './create-new-diamond-package-component';

describe('CreateNewDiamondPackageComponent', () => {
  let component: CreateNewDiamondPackageComponent;
  let fixture: ComponentFixture<CreateNewDiamondPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewDiamondPackageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewDiamondPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
