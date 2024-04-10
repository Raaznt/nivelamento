import { OperationErrors, OperationStatus } from "../controller/status";
import { IValidator } from "./IValidator";
import { CurrencyCodeValidator, CurrencyValueValidator } from "./Validator";
import { CustomError, OperationResult } from "./ResultObjects";


class Currency {
  private _currencyCode: string;
  private _value: string;

  private constructor(currencyCode : string, value : string) {
    this._currencyCode = currencyCode;
    this._value = value;
  }

  public static create(currencyCode: string='', value: string='') : OperationResult {
    const errors: CustomError[] = [];

    let validator: IValidator = CurrencyCodeValidator.getInstance();
    if(currencyCode) {
      if(!validator.isValid(currencyCode)) {
        errors.push(
          {errorCode : OperationErrors.INVALID_CURRENCY_CODE}
        );
      }
    } else {
      errors.push(
        {errorCode : OperationErrors.CURRENCY_CODE_NOT_FOUND}
      );
    }

    validator = CurrencyValueValidator.getInstance();
    if(value) {
      if(!validator.isValid(value)) {
        errors.push(
          {errorCode : OperationErrors.INVALID_VALUE}
        );
      }
    } else {
      errors.push(
        {errorCode : OperationErrors.VALUE_NOT_FOUND}
      );
    }

    return errors.length === 0 ?
      {
        status: OperationStatus.SUCCESS, 
        result: new Currency(currencyCode, value)
      } :
      {
        status: OperationStatus.FAIL,
        errors: errors
      };
  }

  public get currencyCode():string {
    return this._currencyCode;
  }

  public get currencyValue():string {
    return this._value;
  }
}

export {Currency};