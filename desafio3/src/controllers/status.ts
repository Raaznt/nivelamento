class OperationStatus {
  static get SUCCESS() : number {
    return 0;
  }

  static get FAIL() : number {
    return 1;
  }
}

class OperationErrors {
  static get INVALID_SCHEDULING_DATE_FORMAT() : number{
    return 1;
  }

  static get INVALID_SCHEDULING_START_TIME_FORMAT() : number {
    return 2;
  }

  static get INVALID_SCHEDULING_END_TIME_FORMAT() : number {
    return 3;
  }

  static get INVALID_SCHEDULING_TIME() : number {
    return 4;
  }

  static get SCHEDULING_DATE_TIME_UNAVAILABLE() : number {
    return 5;
  }

  static get SCHEDULING_DATE_ON_PAST() : number {
    return 6;
  }

  static get SCHEDULING_TIME_OUTSIDE_OPENING_HOURS() : number {
    return 7;
  }

  static get INVALID_TIME_INTERVAL() : number {
    return 8;
  }

  static get MISSING_PROPERTY() : number {
    return 9;
  }

  static get INVALID_CPF() : number {
    return 10;
  }

  static get BIRTHDATE_ON_FUTURE() : number {
    return 11;
  }

  static get INVALID_DATE_FORMAT() : number {
    return 12;
  }

  static get AGE_NOT_ACCEPTED() : number {
    return 13;
  }

  static get CONNECTION_ERROR() : number {
    return 14;
  }

  static get CPF_FOUND() : number {
    return 15;
  }

  static get INVALID_PATIENT_NAME(): number {
    return 16;
  }

  static get PATIENT_NOT_FOUND(): number {
    return 17;
  }

  static get FUTURE_SCHEDULING_FOUND(): number {
    return 18;
  }

  static get SCHEDULING_INTERSECTION(): number {
    return 19;
  }

  static get SCHEDULING_NOT_FOUND() : number {
    return 20;
  }

  static get INVALID_DATE_INTERVAL(): number {
    return 21;
  }

}

export {OperationStatus, OperationErrors};