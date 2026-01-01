

// import { Injectable } from '@angular/core';
// import { getDatabase, ref, push, onValue, off, Database } from 'firebase/database';
// import { Observable } from 'rxjs';
// import { getApp } from 'firebase/app';

// export interface Message {
//   senderId: string;
//   text: string;
//   timestamp: number;
// }

// const USER_1_ID = '10010';
// const USER_2_ID = '10012';
// const DEFAULT_CHAT_ID = 'chat_A_B';

// @Injectable({
//   providedIn: 'root'
// })
// export class ChatService {
//   private db: Database;

//   constructor() {
//     const app = getApp();
//     this.db = getDatabase(app);
//   }

//   getCurrentUserId(): string {
//     return USER_1_ID;
//   }

//   getOtherUserId(): string {
//     return USER_2_ID;
//   }

//   getDefaultChatId(): string {
//     return DEFAULT_CHAT_ID;
//   }

//   sendMessage(text: string, senderId: string, chatId: string = DEFAULT_CHAT_ID): Promise<void> {
//     const messagesRef = ref(this.db, `chats/${chatId}/messages`);

//     const message: Message = {
//       senderId,
//       text,
//       timestamp: Date.now()
//     };

//     return push(messagesRef, message).then(() => {
//       console.log("✔ Message saved to Firebase:", message);
//     });
//   }

//   getChatMessages(chatId: string = DEFAULT_CHAT_ID): Observable<Message[]> {
//     return new Observable(observer => {
//       const messagesRef = ref(this.db, `chats/${chatId}/messages`);

//       const listener = onValue(messagesRef, snapshot => {
//         const msgs: Message[] = [];

//         snapshot.forEach(child => {
//           msgs.push(child.val() as Message);
//         });

//         msgs.sort((a, b) => a.timestamp - b.timestamp);

//         observer.next(msgs);
//       });

//       return () => off(messagesRef, 'value', listener);
//     });
//   }
// }

// chat-service.ts
import { Injectable } from '@angular/core';
import { getDatabase, ref, push, onValue, off, Database, Unsubscribe, set, child, get } from 'firebase/database';
import { Observable, of, throwError } from 'rxjs';
import { getApp } from 'firebase/app';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

export interface Message {
  senderId: string;
  text: string;
  timestamp: number;
}

const DEFAULT_CHAT_ID = 'chat_A_B';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private db: Database;

  constructor(private http: HttpClient) {
    const app = getApp();
    this.db = getDatabase(app);
  }

  // تجيب الـ current user id من الباك
  getCurrentUserId(): Observable<string> {
    return this.http.get<string>('/api/chat/GetUserId');
  }

  // لو عندك طريقة لاختيار الـ other user (مثلا param أو ثابت)
  getOtherUserId(): Observable<string> {
    // هنا ممكن تستخدم user2 من ال create chat أو endpoint تاني
    return this.http.get<string>('/api/chat/GetOtherUserId'); // لو هتعمل endpoint
  }

  getDefaultChatId(): string {
    return DEFAULT_CHAT_ID;
  }

  sendMessage(text: string, senderId: string, chatId: string = DEFAULT_CHAT_ID): Promise<void> {
    const messagesRef = ref(this.db, `chats/${chatId}/messages`);

    const message: Message = {
      senderId: senderId.toString(),
      text,
      timestamp: Date.now()
    };

    return push(messagesRef, message).then(() => {
      console.log("✔ Message saved to Firebase:", message);
    });
  }

  getChatMessages(chatId: string = DEFAULT_CHAT_ID): Observable<Message[]> {
    return new Observable(observer => {
      const messagesRef = ref(this.db, `chats/${chatId}/messages`);

      const listener: Unsubscribe = onValue(messagesRef, snapshot => {
        const msgs: Message[] = [];
        snapshot.forEach(child => {
          msgs.push(child.val() as Message);
        });
        msgs.sort((a, b) => a.timestamp - b.timestamp);
        observer.next(msgs);
      });

      // التصحيح هنا - إرجاع دالة cleanup بدون قيمة مرتجعة
      return () => {
        off(messagesRef, 'value', listener);
      };
    });
  }
 /**
   * Create deterministic chatId for two users:
   * - sort the ids alphabetically so order doesn't matter
   * - join with '_' and a prefix to avoid collisions
   */
  private makeChatIdForUsers(userA: string, userB: string): string {
    const a = (userA ?? '').toString();
    const b = (userB ?? '').toString();

    // prevent same user twice (optional: allow self-chat if you want)
    if (!a || !b) throw new Error('Both user ids must be provided.');

    if (a === b) {
      // if you want to allow self chats, remove this error and continue
      throw new Error('Cannot create a chat for the same user id twice.');
    }

    const parts = [a, b].sort(); // alphabetical stable order
    return `chat_${parts[0]}_${parts[1]}`;
  }

  /**
   * Create a chat between two users if not exists, otherwise return existing chatId.
   * Returns the chatId (string).
   */
  async createOrGetChat(userA: string, userB: string): Promise<string> {
    const chatId = this.makeChatIdForUsers(userA, userB);
    const chatRef = ref(this.db, `chats/${chatId}`);

    // check existence
    const snap = await get(chatRef);
    if (snap.exists()) {
      // chat exists -> return existing chatId
      return chatId;
    }

    // chat does not exist -> create minimal metadata
    const meta = {
      participants: {
        [userA]: true,
        [userB]: true
      },
      createdAt: Date.now()
    };

    // write metadata under chats/{chatId}/meta (and create a messages node optional)
    await set(child(chatRef, 'meta'), meta);
    // ensure messages node exists (optional)
    await set(child(chatRef, 'messages'), {}); // empty object

    return chatId;
  }


  /** helper: deterministic chat id from two user ids */
  private deterministicChatId(a: string, b: string): string {
    return `chat_${a}_${b}`;
  }

}