class OperationStatus {
  static get SUCCESS() {
    return 0;
  }

  static get FAIL() {
    return 1;
  }
}

class OperationErrors {
  static get MANDATORY_FIELD_NOT_FOUND() {
    return 1;
  }

  static get INVALID_NAME_FIELD() {
    return 2;
  }

  static get INVALID_CPF_FIELD() {
    return 3;
  }

  static get INVALID_BIRTHDATE_FIELD() {
    return 4;
  }

  static get INVALID_INCOME_FORMAT() {
    return 5;
  }

  static get INVALID_CIVIL_STATUS() {
    return 6;
  }

  static get FILE_NOT_FOUND() {
    return 7;
  }

  static get FILE_READ_ERROR() {
    return 8;
  }

  static get INVALID_CONTENT() {
    return 9;
  }

  static get OUTPUT_GENERATION_FAILED() {
    return 10;
  }
}

export {OperationStatus, OperationErrors};