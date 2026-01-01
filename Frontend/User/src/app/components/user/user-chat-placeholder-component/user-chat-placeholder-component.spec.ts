import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserChatPlaceholderComponent } from './user-chat-placeholder-component';

describe('UserChatPlaceholderComponent', () => {
  let component: UserChatPlaceholderComponent;
  let fixture: ComponentFixture<UserChatPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserChatPlaceholderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserChatPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
