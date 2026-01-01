import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface LikeUpdate {
  postId: number;
  likedByUser: boolean;
  totalLiked: number;
}

@Injectable({
  providedIn: 'root'
})
export class SharedPostService {
  private postLikesSource = new BehaviorSubject<LikeUpdate | null>(null);
  postLikes$ = this.postLikesSource.asObservable();

  updateLike(update: LikeUpdate) {
    this.postLikesSource.next(update);
  }
}
