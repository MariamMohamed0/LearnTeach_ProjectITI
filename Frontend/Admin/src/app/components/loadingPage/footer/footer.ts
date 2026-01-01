import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslationService } from '../../../services/translation';

@Component({
  selector: 'app-footer',
  imports: [RouterLink,CommonModule,RouterLinkActive],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
    constructor(public t: TranslationService) {}

  tr(key: string) {
    return this.t.translate(key);
  }
}
