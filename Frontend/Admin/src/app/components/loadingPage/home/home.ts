import { Component } from '@angular/core';
import { About } from '../about/about';
import { Sections } from '../sections/sections';
import { Contact } from '../contact/contact';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { Navbar } from '../../shared/navbar/navbar';
import { Login } from '../../login/login';
import { Register } from '../../register/register';

@Component({
  selector: 'app-home',
  imports: [Header,About,Sections,Contact,Footer,Navbar,Login],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
