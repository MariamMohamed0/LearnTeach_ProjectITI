// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
import { App } from './app/app';
// import '@tailwindplus/elements';
// import { initializeApp } from "firebase/app";
// import { firebaseConfig } from './app/firebase.config';


// const app = initializeApp(firebaseConfig);


import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';


import { initializeApp } from "firebase/app";

import { firebaseConfig } from './app/firebase.config';

// تهيئة Firebase
const app = initializeApp(firebaseConfig);


bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));


