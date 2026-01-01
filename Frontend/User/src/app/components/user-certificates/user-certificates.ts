import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { certificateService } from '../../services/api/certificateService';
import { Certificate } from '../../models/certificate';
import { AuthService } from '../../services/api/authService';
import { TranslationService } from '../../services/translation'; 

@Component({
  selector: 'app-user-certificates',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-certificates.html',
  styleUrls: ['./user-certificates.css'],
})
export class CertificatesComponent implements OnInit {

  certificates: Certificate[] = [];
  selectedFiles: Map<Certificate, File> = new Map();

  userId!: number;

  constructor(private auth: AuthService, private router: Router,public translation: TranslationService) { }

  ngOnInit(): void {
    // الحصول على userId من AuthService
    const id = this.auth.getCurrentUserId();
    if (id) this.userId = id;

    // إضافة شهادة فارغة كبداية
this.certificates.push({ Cername: '', InstatutionName: '', Cerpic: '', userId: this.userId });


    // لاحقًا يمكن استدعاء loadCertificates() لتحميل الشهادات من الباك
  }

  addCertificate() {
    this.certificates.push({ Cername: '', InstatutionName: '', Cerpic: '', userId: this.userId });
  }

  removeCertificate(cert: Certificate) {
    if (!cert.Cerid) {
      this.certificates = this.certificates.filter(c => c !== cert);
      this.selectedFiles.delete(cert);
      return;
    }
    if (confirm('Are you sure you want to delete this certificate?')) {
      certificateService.delete(cert.Cerid).then(() => {
        this.certificates = this.certificates.filter(c => c !== cert);
        this.selectedFiles.delete(cert);
      });
    }
  }

  onFileSelected(event: any, cert: Certificate) {
    const file = event.target.files[0];
    if (!file) return;
    this.selectedFiles.set(cert, file);

    const reader = new FileReader();
    reader.onload = e => { cert.Cerpic = e.target?.result as string; };
    reader.readAsDataURL(file);
  }

  async saveCertificate(cert: Certificate) {
    const formData = new FormData();
    formData.append('UserId', this.userId.toString());
    formData.append('Cername', cert.Cername);
    formData.append('InstatutionName', cert.InstatutionName);
    if (cert.EarnedYear) formData.append('EarnedYear', cert.EarnedYear.toString());
    const file = this.selectedFiles.get(cert);
    if (file) formData.append('Cerpic', file, file.name);

    try {
      if (cert.Cerid) await certificateService.update(cert.Cerid, formData);
      else await certificateService.create(formData);
      alert('Saved successfully!');
    } catch (err) {
      console.error(err);
    }
  }

  // دوال لتجنب أخطاء الـ HTML
saveAllAndNext() {
  // حفظ كل الشهادات
  this.certificates.forEach(cert => this.saveCertificate(cert));

  // بعد الحفظ، الانتقال إلى صفحة حسب userId
  this.router.navigate([`/national-id`]); // غيري 'next-page' حسب الـ route اللي عندك
}


skipCertificates() {

  this.router.navigate([`/national-id`]); 
}

}
