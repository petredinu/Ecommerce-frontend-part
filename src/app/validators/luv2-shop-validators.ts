import { FormControl, ValidationErrors } from "@angular/forms";
import { ValidatorFn, AbstractControl } from '@angular/forms';

export class Luv2ShopValidators {

    // whitespace validation

    static notOnlyWhitespace(control: FormControl) : ValidationErrors | null{

        // check if string only contains whitespace
        if((control.value != null)&& (control.value.trim().length === 0)){

            // invalid, return error object
            return {'notOnlyWhitespace': true};
        }
        else{
            return null;
        }
        
    }

    static cardLuhnValidator(control: AbstractControl): ValidationErrors | null {
    const cardnumber = control.value;
    if (!cardnumber || cardnumber.length === 0) {
      return null; // Or return { required: true } if you need required validation
    }

    // Implementarea algoritmului Luhn
    const digits = cardnumber.replace(/\s/g, '').split('').map(Number);
    let sum = 0;
    let doubleDigit = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = digits[i];

      if (doubleDigit) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      doubleDigit = !doubleDigit;
    }

    return (sum % 10 === 0) ? null : { 'luhn': { value: control.value } };
  };
}

