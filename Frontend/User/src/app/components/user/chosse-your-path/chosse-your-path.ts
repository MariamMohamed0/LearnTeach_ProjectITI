import { Component } from '@angular/core';
import { Navbar } from '../../shared/navbar/navbar';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chosse-your-path',
  imports: [RouterLink,CommonModule,RouterModule,RouterLinkActive,Navbar],
  templateUrl: './chosse-your-path.html',
  styleUrl: './chosse-your-path.css',
})
export class ChosseYourPath {

}
