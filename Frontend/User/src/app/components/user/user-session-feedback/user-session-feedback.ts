import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserSessionFeedbackDto, UserSessionFeedbackService } from '../../../services/api/user-session-feedback-service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../../services/api/authService';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../../services/translation';

@Component({
  selector: 'app-user-session-feedback',
  templateUrl: './user-session-feedback.html',
  styleUrls: ['./user-session-feedback.css'],
  imports: [MatIconModule, ReactiveFormsModule, FormsModule, CommonModule, RouterModule]
})
export class UserSessionFeedback implements OnInit {
  sessionId: number;
  feedbacks: UserSessionFeedbackDto[] = [];
  showForm = false;
  editingFeedback?: UserSessionFeedbackDto;
  form: FormGroup;
  currentUserId: number | null = null;
  userFeedback?: UserSessionFeedbackDto; // feedback الخاص بالمستخدم الحالي

  constructor(
    private feedbackService: UserSessionFeedbackService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserSessionFeedback>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
        public t: TranslationService
  ) {
    this.sessionId = data.sessionId;
    this.currentUserId = this.authService.getCurrentUserId();
    this.form = this.fb.group({
      ratingValue: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks() {
    this.feedbackService.getSessionFeedbacks(this.sessionId).subscribe(
      fbs => {
        this.feedbacks = fbs;
        this.userFeedback = this.feedbacks.find(fb => fb.ratedByUserId === this.currentUserId);
      },
      err => console.error('Load Feedbacks Error:', err)
    );
  }

  startAdd() {
    this.showForm = true;
    this.editingFeedback = undefined;
    this.form.reset();
  }

  startEdit(feedback: UserSessionFeedbackDto) {
    this.showForm = true;
    this.editingFeedback = feedback;
    this.form.patchValue({
      ratingValue: feedback.ratingValue,
      comment: feedback.comment
    });
  }

  cancel() {
    this.showForm = false;
    this.editingFeedback = undefined;
    this.form.reset();
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;

    if (!this.currentUserId) {
      console.error('Current user ID not found!');
      return;
    }

    const payload = {
      sessionId: this.sessionId,
      ratingValue: Number(value.ratingValue),
      comment: value.comment?.trim() || ''
    };

    if (this.editingFeedback) {
      // تعديل feedback موجود
      this.feedbackService.updateFeedback(this.editingFeedback.feedbackId, payload)
        .subscribe({
          next: () => {
            this.loadFeedbacks();
            this.cancel();
          },
          error: err => console.error('Update Error:', err)
        });
    } else {
      // إضافة feedback جديد
      this.feedbackService.createFeedback(payload)
        .subscribe({
          next: (newFeedback) => {
            this.feedbacks.push(newFeedback);
            this.userFeedback = newFeedback;
            this.cancel();
          },
          error: err => console.error('Create Error:', err)
        });
    }
  }

  delete(feedbackId: number) {
    if (confirm('Are you sure you want to delete this feedback?')) {
      this.feedbackService.deleteFeedback(feedbackId)
        .subscribe(() => {
          this.loadFeedbacks();
        });
    }
  }

  close() {
    this.dialogRef.close();
  }
   tr(key: string) {
    return this.t.translate(key);
  }
}
