import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserChatWindowComponent } from './user-chat-window-component';

describe('UserChatWindowComponent', () => {
  let component: UserChatWindowComponent;
  let fixture: ComponentFixture<UserChatWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserChatWindowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserChatWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
