import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NationalIdService, UserNationalId } from '../../../services/api/national-id-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-national-id',
  templateUrl: './national-id.html',
  styleUrls: ['./national-id.css'],
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule]
})
export class NationalIdComponent implements OnInit {
  nationalId: UserNationalId | null = null;
  form: FormGroup;
  preview = {
    frontPic: null as string | null,
    backPic: null as string | null,
    selfieWithId: null as string | null,
    verificationStatus: null,
  };

  constructor(
    private fb: FormBuilder,
    private nationalIdService: NationalIdService,
    private router: Router
  ) {
    this.form = this.fb.group({
      frontPic: [null, Validators.required],
      backPic: [null, Validators.required],
      selfieWithId: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadNationalId();
  }

  loadNationalId() {
    this.nationalIdService.getMyNationalId().subscribe({
      next: res => this.nationalId = res,
      error: err => console.error('Load error:', err)
    });
  }

  onFileChange(event: any, field: 'frontPic' | 'backPic' | 'selfieWithId') {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.preview[field] = reader.result as string;
      this.form.patchValue({ [field]: file });
    };
    reader.readAsDataURL(file);
  }

  // submit() {
  //   if (!this.form.get('frontPic')?.value ||
  //     !this.form.get('backPic')?.value ||
  //     !this.form.get('selfieWithId')?.value) {
  //     alert('Please upload all files before submitting.');
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('frontPic', this.form.get('frontPic')?.value);
  //   formData.append('backPic', this.form.get('backPic')?.value);
  //   formData.append('selfieWithId', this.form.get('selfieWithId')?.value);

  //   this.nationalIdService.create(formData).subscribe({
  //     next: res => {
  //       this.nationalId = res;
  //       alert('Submitted successfully!');
  //     },
  //     error: err => console.error('Submit error:', err)
  //   });
  // }

  submit() {
  if (!this.form.get('frontPic')?.value ||
      !this.form.get('backPic')?.value ||
      !this.form.get('selfieWithId')?.value) {
    alert('Please upload all files before submitting.');
    return;
  }

  const formData = new FormData();
  formData.append('frontPic', this.form.get('frontPic')?.value);
  formData.append('backPic', this.form.get('backPic')?.value);
  formData.append('selfieWithId', this.form.get('selfieWithId')?.value);

  this.nationalIdService.create(formData).subscribe({
    next: res => {
      this.nationalId = res;
      this.nationalId.verificationStatus = 'Pending'; // <-- تحديث الحالة بعد Submit
      alert('Submitted successfully!');
    },
    error: err => console.error('Submit error:', err)
  });
}


  edit(type: string) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.onchange = () => {
      const file = fileInput.files![0];
      if (!file) return;

      const formData = new FormData();
      if (type === 'front') formData.append('frontPic', file);
      else if (type === 'back') formData.append('backPic', file);
      else formData.append('selfieWithId', file);

      if (this.nationalId) formData.append('userId', this.nationalId.userId.toString());

      this.nationalIdService.update(formData).subscribe({
        next: res => {
          this.nationalId = res;
          alert('Updated successfully!');
        },
        error: err => console.error('Update error:', err)
      });
    };
    fileInput.click();
  }

  // goNext() {
  //   this.router.navigate(['/myprofile']);
  // }
  goNext() {
  if (this.isVerified()) {
    this.router.navigate(['/DashboardComponent']);
  } else {
    alert('Your National ID is not approved yet!');
  }
}

  goBack() {
    this.router.navigate(['/user-certificates']);
  }

  isVerified(): boolean {
    return this.nationalId?.verificationStatus === 'Approved';
  }


 skip() {
  this.router.navigate(['/DashboardComponent']); 
 }

}