import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'

if (environment.production) {
  enableProdMode();
}

//per default firebase will be initialized after angular is initialized
//here we manually initialize firebase before angular so that the auth status can be accessed from the second the page loads
firebase.initializeApp(environment.firebase);

let appInit = false;

//when firebase has been initialied angular is initialized, if it has not been initialized (appInit) before
firebase.auth().onAuthStateChanged(() => {
    if(!appInit){
      platformBrowserDynamic().bootstrapModule(AppModule)
      .catch(err => console.error(err))
    }
    appInit = true;
  }
);


