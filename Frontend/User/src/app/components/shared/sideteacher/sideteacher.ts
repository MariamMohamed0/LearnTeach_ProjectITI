import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-sideteacher',
    standalone: true,
  imports: [CommonModule, RouterLink, FontAwesomeModule],
  templateUrl: './sideteacher.html',
  styleUrl: './sideteacher.css',
})
export class Sideteacher {
  @Input() collapsed: boolean = false; 

}
