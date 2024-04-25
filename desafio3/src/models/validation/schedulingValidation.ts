import { IValidator } from "./IValidator";
import { ValidationResult } from "./ValidationResult";
import { DateTime } from "luxon";
import { OperationErrors } from "../../controllers/status";

class SchedulingValidator implements IValidator {
  isValid(obj: any): ValidationResult {
    let date: DateTime;
    let startTime: DateTime;
    let endTime: DateTime;

    const validation: ValidationResult = {status: true, causes: []};
    
    if(!!!obj.date || !!!obj.startTime || !!!obj.endTime) {
      validation.status = false;
      validation.causes.push(OperationErrors.MISSING_PROPERTY);
    } else {
      if(!SchedulingValidator.formatoDataValido(obj.date)) {
        validation.status = false;
        validation.causes.push(OperationErrors.INVALID_SCHEDULING_DATE_FORMAT);
      }

      if(!SchedulingValidator.formatoHoraValido(obj.startTime)) {
        validation.status = false;
        validation.causes.push(OperationErrors.INVALID_SCHEDULING_START_TIME_FORMAT);
      }

      if(!SchedulingValidator.formatoHoraValido(obj.endTime)) {
        validation.status = false;
        validation.causes.push(OperationErrors.INVALID_SCHEDULING_END_TIME_FORMAT);
      }
      
      startTime = DateTime.fromFormat(obj.startTime, 'HHmm');
      endTime = DateTime.fromFormat(obj.endTime, 'HHmm');

      if(((startTime.minute % 15) !== 0) || ((endTime.minute % 15) !==0)) {
        validation.status = false;
        validation.causes.push(OperationErrors.INVALID_SCHEDULING_TIME);
      }

      date = DateTime.fromFormat(obj.date,'dd/MM/yyyy');
      if(date < DateTime.now()) {
        validation.status = false;
        validation.causes.push(OperationErrors.SCHEDULING_DATE_ON_PAST);
      }

      if((date.equals(DateTime.now().startOf('day'))) && (startTime < DateTime.now() || endTime < DateTime.now())) {
        validation.status = false;
        validation.causes.push(OperationErrors.SCHEDULING_DATE_ON_PAST);
      }

      if(startTime.hour < 8 || startTime.hour > 19 || endTime.hour < 8 || endTime.hour > 19) {
        validation.status = false;
        validation.causes.push(OperationErrors.SCHEDULING_TIME_OUTSIDE_OPENING_HOURS);
      }

      if(endTime < startTime) {
        validation.status = false;
        validation.causes.push(OperationErrors.INVALID_TIME_INTERVAL);
      }
    }

    return validation;
  }

  private static formatoDataValido(data: string): boolean {
    var valido: boolean = false;
    const expData: RegExp = new RegExp(/^((0[1-9])|([12][0-9])|(3[01]))\/((0[1-9])|(1[0-2]))\/[0-9]{4}$/);
    valido = expData.test(data);
    let dataParsed: DateTime = DateTime.fromFormat(data, 'dd/MM/yyyy');
    valido = valido && dataParsed.isValid;
    return valido;
  }

  private static formatoHoraValido(horas: string): boolean {
    var valido = false;
    const expHour = new RegExp(/^(([01][0-9])|([2][0-3]))([0-5][0-9])$/);
    valido = expHour.test(horas);
    let horasParsed: DateTime = DateTime.fromFormat(horas, 'HHmm');
    valido = valido && horasParsed.isValid;
    return valido;
  }
}

export {SchedulingValidator};