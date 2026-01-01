import { Component } from '@angular/core';
import { TranslationService } from '../../../services/translation';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  imports: [CommonModule ],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
    constructor(public t: TranslationService) {}

  tr(key: string) {
    return this.t.translate(key);
  }
}
