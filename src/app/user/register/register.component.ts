import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import IUser from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterValidator } from '../validators/register-validator';
import { EmailTaken } from '../validators/email-taken';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  email = new FormControl('', [Validators.required, Validators.email], [this.emailTaken.validate]);
  age = new FormControl<number|null>(null, [Validators.required, Validators.min(18), Validators.max(120)]);
  password = new FormControl('', [Validators.required, Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$')]);
  confirmPassword = new FormControl('', [Validators.required]);
  phoneNumber = new FormControl('', [Validators.maxLength(13)]);
  //the form controls are passed into the form group as as attributes of the class,
  //because form group converts their class to abstractControl, which confuses the
  //child inputComponent as it expects an instance of form control
  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirmPassword: this.confirmPassword,
    phoneNumber: this.phoneNumber,
  }, [RegisterValidator.match('password','confirmPassword')]); //validator on FormGroup Level
  showAlert = false;
  alertColor = "blue";
  alertMessage = "Your account is being prepared. Kindly wait a few seconds"
  inSubmission =false;

  constructor( 
    private auth: AuthService,
    private emailTaken: EmailTaken //async validator is not static and must therefore be injected
    ){ }

  ngOnInit(): void {
  }

  async register(){
    this.alertColor = "blue";
    this.alertMessage = "Your account is being prepared. Kindly wait a few seconds";
    this.showAlert = true;
    this.inSubmission = true;

    //as firebse returns a promise, we use async await syntax
    try{ 
     this.auth.createUser(this.registerForm.value as IUser);
    }catch(e){
      console.error(e);
      this.alertMessage = "An error has ocurred: "+ e;
      this.alertColor = "red";
      this.inSubmission = false;
      return;
    }
    this.alertMessage = "Registered successfully"
    this.alertColor = "green"
  }

}
