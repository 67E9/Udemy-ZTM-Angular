import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  email = new FormControl('', [Validators.required, Validators.email]);
  age = new FormControl('', [Validators.required, Validators.min(18), Validators.max(120)]);
  password = new FormControl('', [Validators.required, Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$')]);
  confirmPassword = new FormControl('', [Validators.required]);
  phoneNumber = new FormControl('', [Validators.maxLength(13)]);
    //the form controls are passed into the form group as as attributes of the class,
  //because form grup converts their class to abstractControl, which confuses the
  //child component inputComponent as it expects an instance of form control
  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirmPassword: this.confirmPassword,
    phoneNumber: this.phoneNumber
  });
  showAlert = false;
  alertColor = "blue";
  alertMessage = "Your account is being prepared. Kindly wait a few seconds"

  ngOnInit(): void {
  }

  register(){
    this.alertColor = "blue";
    this.alertMessage = "Your account is being prepared. Kindly wait a few seconds";
    this.showAlert = true;
  }

}
