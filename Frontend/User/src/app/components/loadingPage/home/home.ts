import { Component } from '@angular/core';
import { About } from '../about/about';
import { Sections } from '../sections/sections';
import { Contact } from '../contact/contact';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

@Component({
  selector: 'app-home',
  imports: [Header,About,Sections,Contact,Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
