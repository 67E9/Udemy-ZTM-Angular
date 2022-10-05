import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { Observable } from "rxjs";

//providedIn: root -> service will be available application wide as a singleton with no need to add it to a module's providers array
@Injectable({providedIn: 'root'}) 
//Injectable allows dependency injection into this class and of this class
export class EmailTaken implements AsyncValidator{

    constructor(
        private auth: AngularFireAuth
    ){}

        validate = (control: AbstractControl<any, any>): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
            //firebases fetchSignInMethodsForEmail returns an array of signin methods, if the email is taken
            //if the email is not in the db, it will return an empty array -> proxy for email taken or not
            return this.auth.fetchSignInMethodsForEmail(control.value).then(
                response => response.length ? {emailTaken: true} : null
            )
        }
        //the validate function must be an arrow function
        //if not its context will change upon injection into the module and it will not be able to reference auth
}
