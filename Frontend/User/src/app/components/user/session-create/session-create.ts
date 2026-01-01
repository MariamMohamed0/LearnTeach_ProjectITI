import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Skill, User } from '../../../models/session';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from '../../../services/api/sessionService';
import { AuthService } from '../../../services/api/authService';
import { CommonModule } from '@angular/common';
import { UserHeader } from '../../shared/user-header/user-header';
  import { Sidestudent } from './../../shared/sidestudent/sidestudent';
import { TranslationService } from '../../../services/translation';
@Component({
  selector: 'app-session-create',
  imports: [ReactiveFormsModule, FormsModule,CommonModule,RouterModule,UserHeader,Sidestudent],
  standalone: true,
  templateUrl: './session-create.html',
  styleUrls: ['./session-create.css'],
})
export class SessionCreate implements OnInit {
  form: FormGroup;
  learners: User[] = [];
  skills: Skill[] = [];
  minDateTime: string = new Date().toISOString().slice(0,16);
  isSidebarOpen = true;
  isDarkMode = false;
  screenWidth: number = window.innerWidth;
  conflictMessage: string | null = null;
  

  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService,
    private router: Router,
    private authService: AuthService,
    public t: TranslationService
  ) {
    this.form = this.fb.group({
      sessionTitle: ['', Validators.required],
      learnerId: [null, Validators.required],
      skillId: [null, Validators.required],
      scheduleStart: ['', Validators.required],
      scheduleEnd: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.sessionService.getAllUsers().subscribe((u) => (this.learners = u));
    this.sessionService.getAllSkills().subscribe((s) => (this.skills = s));
  }

  // Checks if start time is in the past
  get isStartInPast(): boolean {
    const start = this.form.value.scheduleStart;
    return start ? new Date(start) < new Date() : false;
  }

  // Checks if end time is before start time
  get isEndBeforeStart(): boolean {
    const start = this.form.value.scheduleStart;
    const end = this.form.value.scheduleEnd;
    return start && end ? new Date(end) < new Date(start) : false;
  }
 
  submit() {
    this.conflictMessage = null;
    if (this.form.valid && !this.isStartInPast && !this.isEndBeforeStart) {
      const dto = {
        ...this.form.value,
        teacherId: this.authService.getCurrentUserId(),
        role: 'Teacher',
        scheduleStart: new Date(this.form.value.scheduleStart).toISOString(),
        scheduleEnd: new Date(this.form.value.scheduleEnd).toISOString(),
      };
      this.sessionService.createSession(dto).subscribe({
      next: () => {
        alert('Session created!');
        this.router.navigate(['/sessions']);
      },
      error: (err) => {
       console.error(err);
        this.conflictMessage = err.error?.message || "You or Learner have session in these time";
      }
    });
  } else {
    this.form.markAllAsTouched();
  }
  }
 
 toggleSidebar() { this.isSidebarOpen = !this.isSidebarOpen; }
  toggleDarkMode() { this.isDarkMode = !this.isDarkMode; if (this.isDarkMode) document.body.classList.add('dark'); else document.body.classList.remove('dark'); }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) { this.screenWidth = event.target.innerWidth; if (this.screenWidth >= 1024) this.isSidebarOpen = true; }

  isMobile(): boolean { return this.screenWidth < 1024; }

  cancel() {
    this.router.navigate(['/sessions']);
  }
    tr(key: string) {
    return this.t.translate(key);
  }
}
