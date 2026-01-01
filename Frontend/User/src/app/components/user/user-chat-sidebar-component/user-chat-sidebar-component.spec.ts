import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserChatSidebarComponent } from './user-chat-sidebar-component';

describe('UserChatSidebarComponent', () => {
  let component: UserChatSidebarComponent;
  let fixture: ComponentFixture<UserChatSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserChatSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserChatSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
