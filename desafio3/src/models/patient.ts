import { IValidator } from "./validation/IValidator";
import { ValidationResult } from "./validation/ValidationResult";

class Patient {
  private _name: string;
  private _cpf: string;
  private _birthdate: string;
  private _validator: IValidator | undefined;

  constructor(cpf: string="", name: string="", birthdate: string="") {
    this._name = name;
    this._cpf = cpf;
    this._birthdate = birthdate;
  }

  public isValid() : ValidationResult {
    let validation: ValidationResult = {status: true, causes: []}
    if(!!this._validator) {
      validation = this._validator.isValid(this);
    }
    return validation;
  }

  public set validator(validator: IValidator) {
    this._validator = validator;
  }

  public get name() {
    return this._name
  }

  public get cpf() {
    return this._cpf;
  }

  public get birthdate() {
    return this._birthdate;
  }

  public set name(name: string) {
    this._name = name;
  }

  public set cpf(cpf: string) {
    this._cpf = cpf;
  }

  public set birthdate(birthdate: string) {
    this._birthdate = birthdate;
  }
}

export {Patient};