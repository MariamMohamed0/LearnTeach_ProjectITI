import { Component } from '@angular/core';
import { TranslationService } from '../../../services/translation';

@Component({
  selector: 'app-sections',
  imports: [],
  templateUrl: './sections.html',
  styleUrl: './sections.css',
})
export class Sections {
 constructor(public t: TranslationService) {}

  tr(key: string) {
    return this.t.translate(key);
  }
}
