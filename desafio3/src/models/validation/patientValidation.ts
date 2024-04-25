import { OperationErrors } from "../../controllers/status";
import { IValidator } from "./IValidator";
import { ValidationResult } from "./ValidationResult";
import { DateTime } from "luxon";


class PatientValidator implements IValidator{
  public isValid(obj: any): ValidationResult {
    let result: ValidationResult = {status: true, causes: []};

    if(!!!obj.name || !!!obj.cpf || !!!obj.birthdate) {
      result.status = false;
      result.causes.push(OperationErrors.MISSING_PROPERTY);
    } else {
      if(!PatientValidator.checkName(obj.name)) {
        result.status = false;
        result.causes.push(OperationErrors.INVALID_PATIENT_NAME);
      }
      if(!PatientValidator.checkCPF(obj.cpf)) {
        result.status = false;
        result.causes.push(OperationErrors.INVALID_CPF);
      }

      if(!PatientValidator.checkDateFormat(obj.birthdate)) {
        result.status = false;
        result.causes.push(OperationErrors.INVALID_DATE_FORMAT);
      } else if(!PatientValidator.checkDateOnPast(obj.birthdate)) {
        result.status = false;
        result.causes.push(OperationErrors.BIRTHDATE_ON_FUTURE);
      } else {
        let parsedBirthdate: DateTime = DateTime.fromFormat(obj.birthdate, 'dd/MM/yyyy');
        if(parsedBirthdate > DateTime.now().minus({ year: 13 })) {
          result.status = false;
          result.causes.push(OperationErrors.AGE_NOT_ACCEPTED);
        }
      }
    }

    return result;
  }

  private static checkCPF(cpf: string): boolean {
    
    function checkDigitsCPF(digits: string[]) {
      var firstDigitIsValid = false;
      var secondDigitIsValid = false;
  
      if(digits.length === 11) {
        let sum1 = 0, sum2 = 0;
        for(let i = 0; i < digits.length - 1; i++) {
          sum1 = (i < 9) ? sum1 +  Number(digits[i]) * (11 - i - 1) : sum1;
          sum2 = (i < 10) ? sum2 + Number(digits[i]) * (11 - i) : sum2;
        }
  
        let r1 = sum1 % 11;
        if(r1 < 2) {
          firstDigitIsValid = Number(digits[9]) === 0;
        } else {
          firstDigitIsValid = (Number(digits[9]) === (11 - r1));
        }
  
        let r2 = sum2 % 11;
        if(r2 < 2) {
          secondDigitIsValid = (Number(digits[10]) === 0);  
        } else {
          secondDigitIsValid = (Number(digits[10]) === (11 - r2));
        }
      }
      return firstDigitIsValid && secondDigitIsValid;
    }

    const expCPF: RegExp = new RegExp(/^\d{11}$/);
    var valid = false;
    if(typeof cpf === "string") {
      let digits: string[] = cpf.split("");
      valid = expCPF.test(cpf) && checkDigitsCPF(digits);
    }
    return valid;
  }

  private static checkName(nome: string): boolean {
    var valido = false;
    const expNome = new RegExp(/^(([A-Z]{1}[a-z]+)(\s([A-Z]{1}[a-z]+))*)$/);
    var valido = (expNome.test(nome)) && (nome.length > 4);
    return valido;
  }

  static checkDateFormat(date: string) {
    let valid = false;
    const expData = new RegExp(/^((0[1-9])|([12][0-9])|(3[01]))\/((0[1-9])|(1[0-2]))\/[0-9]{4}$/);
    valid = expData.test(date);
    let dataParsed: DateTime = DateTime.fromFormat(date, 'dd/MM/yyyy');
    valid = valid && dataParsed.isValid;
    return valid;
  }

  static checkDateOnPast(date: string) {
    let valid: boolean = false;
    let dataParsed: DateTime = DateTime.fromFormat(date, 'dd/MM/yyyy');
    valid = DateTime.now() > dataParsed;
    return valid;
  }
}

export {PatientValidator};