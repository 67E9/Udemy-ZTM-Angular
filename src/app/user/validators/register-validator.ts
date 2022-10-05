import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


export class RegisterValidator {
    //we are using the AbstractControl class in the parameter, as FormControl inherits from this class
    static match(controlName: string, controlNameToMatch: string): ValidatorFn  {
        //this factory function returns a ValidatorFn and checks whether two Formcontrol's values match
        return ( (group: AbstractControl) : ValidationErrors|null => {
            const control = group.get(controlName);
            const controlToMatch = group.get(controlNameToMatch);
    
            if (!control || !controlToMatch){
                console.error("Either Form Control to be validated by Register Validator not found in Form Group")
                return {ControlNotFound: false}
            }
    
            const result = control.value === controlToMatch.value ? null : {notMatch: true}; 
            //returning null means there are no errors present

            controlToMatch.setErrors(result);
            //this manually sets an error to the second formControl
            //because setting it to null removes the error, it also removes it, if no more errors present
    
            return result;            
        })
    }
}
