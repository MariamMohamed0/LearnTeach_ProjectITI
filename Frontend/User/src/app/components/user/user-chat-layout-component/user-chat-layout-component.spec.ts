import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserChatLayoutComponent } from './user-chat-layout-component';

describe('UserChatLayoutComponent', () => {
  let component: UserChatLayoutComponent;
  let fixture: ComponentFixture<UserChatLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserChatLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserChatLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
