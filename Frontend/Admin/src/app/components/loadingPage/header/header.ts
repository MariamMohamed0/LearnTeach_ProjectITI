import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { TranslationService } from '../../../services/translation';
@Component({
  selector: 'app-header',
  imports: [RouterLink,CommonModule,RouterModule,Navbar],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header  {
    constructor(public t: TranslationService) {}

  tr(key: string) {
    return this.t.translate(key);
  }
}