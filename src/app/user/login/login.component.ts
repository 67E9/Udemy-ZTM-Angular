import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: '',
  };
  alertColor = 'blue';
  alertMessage = 'Please wait while we are logging you in!';
  showAlert = false;
  duringLogin = false;



  constructor(private auth: AngularFireAuth) { }

  ngOnInit(): void {
  }

  async login(){
    
    try{
      this.duringLogin = true
      this.alertColor = 'blue';
      this.alertMessage = 'Please wait while we are logging you in!';
      this.showAlert = true;
      await this.auth.signInWithEmailAndPassword(this.credentials.email, this.credentials.password)
      this.alertColor = 'green';
      this.alertMessage = 'You have been signed in successfully.';
      this.showAlert = true;
    } catch (e) {
      this.alertColor = 'red';
      this.alertMessage = 'Unexpected error. Please try again: ' + e;
      this.showAlert = true;
      this.duringLogin = false;
      console.log(e);
    }

  }
}
