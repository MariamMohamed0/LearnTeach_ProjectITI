import { Component } from '@angular/core';
import { TranslationService } from '../../../services/translation';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
    constructor(public t: TranslationService) {}

  tr(key: string) {
    return this.t.translate(key);
  }

}


