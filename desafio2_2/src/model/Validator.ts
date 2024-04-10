import { IValidator } from "./IValidator";

class CurrencyCodeValidator implements IValidator {
  private static instance: CurrencyCodeValidator;

  public static getInstance() : CurrencyCodeValidator {
    if(!CurrencyCodeValidator.instance) {
      CurrencyCodeValidator.instance = new CurrencyCodeValidator();
    }
    return CurrencyCodeValidator.instance;
  }

  isValid(value: string): boolean {
    let result: boolean = false;
    result = value.length === 3 ? true : false;
    return result;
  }
}

class CurrencyValueValidator implements IValidator {
  private static instance : CurrencyValueValidator;

  private valueRegex: RegExp;
  
  private constructor() {
    this.valueRegex = new RegExp(/^\d+\,[0-9]{2}$/);
  }

  public static getInstance() : CurrencyValueValidator {
    if(!CurrencyValueValidator.instance) {
      CurrencyValueValidator.instance = new CurrencyValueValidator();
    }

    return CurrencyValueValidator.instance;
  }

  isValid(value: string): boolean {
    let result: boolean = false;
    result = this.valueRegex.test(value);
    if(result) {
      let parsedValue : any =  value.replace(',', '.');
      parsedValue = Number.parseFloat(parsedValue);
      result = result && (parsedValue >= 0);
    }
    return result;
  }
}

export {CurrencyCodeValidator, CurrencyValueValidator};