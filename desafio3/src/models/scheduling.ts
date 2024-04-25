import { IValidator } from "./validation/IValidator";
import { ValidationResult } from "./validation/ValidationResult";

class Scheduling {
  private _cpf: string;
  private _date: string;
  private _startTime: string;
  private _endTime: string;
  private _validator: IValidator | undefined;

  constructor(cpf: string="", date: string="", startTime: string="", endTime: string="") {
    this._cpf = cpf;
    this._date = date;
    this._startTime = startTime;
    this._endTime = endTime;
  }

  public isValid() : ValidationResult {
    let validation: ValidationResult = {status: true, causes: []};
    if(!!this._validator) {
      validation = this._validator.isValid(this);
    }
    return validation;
  }

  public get date() {
    return this._date;
  }

  public get startTime() {
    return this._startTime;
  }

  public get endTime() {
    return this._endTime;
  }

  public get cpf() {
    return this._cpf;
  }

  public set cpf(cpf: string) {
    this._cpf = cpf;
  }

  public set date(date: string) {
    this._date = date;
  }

  public set startTime(startTime: string) {
    this._startTime = startTime;
  }

  public set endTime(endTime: string) {
    this._endTime = endTime;
  }

  public set validator(validator: IValidator) {
    this._validator = validator;
  }
}

export {Scheduling};