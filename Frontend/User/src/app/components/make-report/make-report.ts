import { Component, Input, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { reportService } from '../../services/api/reportService';

@Component({
  selector: 'app-make-report',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './make-report.html',
  styleUrl: './make-report.css',
})
export class  MakeReportComponent {

  private fb = inject(FormBuilder);

  @Input() entityType!: 'post' | 'comment' | 'user';
  @Input() entityId!: number;
  @Input() reportedUserId!: number;

  dialogOpen = false;

  form = this.fb.group({
    ReportDescription: ['', Validators.required],
  });

  open(entityType: 'post' | 'comment' | 'user', entityId: number, reportedUserId: number) {
    this.entityType = entityType;
    this.entityId = entityId;
    this.reportedUserId = reportedUserId;
    this.dialogOpen = true;
  }

  close() {
    this.dialogOpen = false;
    this.form.reset();
  }

  submit() {
    if (this.form.invalid) return;

    const payload = {
      ReportDescription: this.form.value.ReportDescription ?? '',
      EntityType: this.entityType,
      EntityId: this.entityId,
      ReportedUserId: this.reportedUserId,
    };

    reportService.create(payload)
      .then(() => this.close())
      .catch(err => console.error(err));
  }
}
