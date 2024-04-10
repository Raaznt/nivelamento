import { OperationErrors, OperationStatus} from "./status";
import { OperationResult } from "../model/ResultObjects";

class ConversionController {
  private _conversionRates: any;

  constructor(conversionRates?: object) {
    this._conversionRates = conversionRates;
  }

  public set conversionRates(converstionRates: object) {
    this._conversionRates = converstionRates;
  }

  public convert(currencySource: string, currencyValue: string, currencyTarget: string): OperationResult {
    if(!this._conversionRates.hasOwnProperty(currencySource)) {
      return {
        status: OperationStatus.FAIL,
        errors: [{errorCode : OperationErrors.INVALID_SOURCE_CODE}]
      };
    }

    if(!this._conversionRates.hasOwnProperty(currencyTarget)) {
      return {
        status: OperationStatus.FAIL,
        errors: [{errorCode: OperationErrors.INVALID_TARGET_CODE}]
      };
    }

    if(currencySource === currencyTarget) {
      return {
        status: OperationStatus.FAIL,
        errors: [{errorCode: OperationErrors.SRC_TARGET_CODE_ERROR}]
      }
    }
    
    let strValue = currencyValue.replace(',','.');
    let sourceValue: number = Number(strValue);
    let sourceFactor: number = this.factor(currencySource);
    let targetFactor: number = this.factor(currencyTarget);
    let targetValue: number = (targetFactor/sourceFactor) * sourceValue;
    strValue = targetValue.toFixed(2).toString().replace('.',',');
    let factor = (targetFactor/sourceFactor).toFixed(6).toString();
    return {
      status: OperationStatus.SUCCESS,
      result: {value: strValue, factor: factor}
    };
  }

  private factor(code: string) : number {
    const properties = Object.keys(this._conversionRates);

    for(const property of properties) {
      if(property === code) {
        return this._conversionRates[property];
      }
    }

    return 0;
  }
}

export {ConversionController};