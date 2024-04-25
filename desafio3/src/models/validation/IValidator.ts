import { ValidationResult } from "./ValidationResult";

interface IValidator {
  isValid(obj: any) : ValidationResult;
}

export {IValidator};