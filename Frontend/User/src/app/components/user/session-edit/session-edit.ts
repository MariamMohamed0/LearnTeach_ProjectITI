import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Session, Skill, User } from '../../../models/session';
import { SessionService } from '../../../services/api/sessionService';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/api/authService';
import { CommonModule } from '@angular/common';
import { UserHeader } from '../../shared/user-header/user-header';
import { Sidestudent } from '../../shared/sidestudent/sidestudent';
import { TranslationService } from '../../../services/translation';

@Component({
  selector: 'app-session-edit',
  imports: [FormsModule, CommonModule, ReactiveFormsModule,UserHeader,Sidestudent],
  standalone: true,
  templateUrl: './session-edit.html',
  styleUrls: ['./session-edit.css'],
})
export class SessionEdit implements OnInit {
  form: FormGroup;
  learners: User[] = [];
  skills: Skill[] = [];
  sessionId!: number;
  sessionData!: Session;
   minDateTime: string = new Date().toISOString().slice(0,16);
  isSidebarOpen = true;
  isDarkMode = false;
  screenWidth: number = window.innerWidth;
  conflictMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService,
    private route: ActivatedRoute,
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
    this.sessionId = Number(this.route.snapshot.paramMap.get('id'));

    this.sessionService.getAllUsers().subscribe((u) => (this.learners = u));
    this.sessionService.getAllSkills().subscribe((s) => (this.skills = s));

    // this.sessionService.getMySessions('teacher').subscribe((sessions) => {
    //   const session = sessions.find((s) => s.sessionId === this.sessionId);
    this.sessionService.getMySessions('teacher').subscribe((res) => {
  const session = res.sessions.find((s) => s.sessionId === this.sessionId);

      if (!session) {
        alert('Session not found!');
        this.router.navigate(['/sessions']);
        return;
      }
      this.sessionData = session;
      this.prefillForm();
    });
  }

  prefillForm() {
    this.form.patchValue({
      sessionTitle: this.sessionData.sessionTitle,
      learnerId: this.sessionData.learner?.userId ?? null,
      skillId: this.sessionData.skill?.skillId ?? null,
      scheduleStart: this.toLocalDatetime(this.sessionData.scheduleStartEgypt),
      scheduleEnd: this.toLocalDatetime(this.sessionData.scheduleEndEgypt),
    });
  }

  toLocalDatetime(dateStr: string): string {
    const d = new Date(dateStr);
    const tzOffset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
  }

  // Validation getters
  get isStartInPast(): boolean {
    const start = this.form.value.scheduleStart;
    return start ? new Date(start) < new Date() : false;
  }

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
        scheduleStart: new Date(this.form.value.scheduleStart).toISOString(),
        scheduleEnd: new Date(this.form.value.scheduleEnd).toISOString(),
      };
    
     this.sessionService.updateSession(this.sessionId, dto).subscribe({
      next: () => {
       alert('Session updated!');
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
