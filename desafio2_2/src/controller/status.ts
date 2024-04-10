class OperationStatus {
  static get SUCCESS() : number {
    return 0;
  }

  static get FAIL() : number {
    return 1;
  }
}

class OperationErrors {
  static get INVALID_CURRENCY_CODE() : number{
    return 1;
  }

  static get INVALID_VALUE() : number {
    return 2;
  }

  static get VALUE_NOT_FOUND() : number {
    return 3;
  }

  static get CURRENCY_CODE_NOT_FOUND() : number {
    return 4;
  }

  static get INVALID_TARGET_CODE() : number {
    return 5;
  }

  static get INVALID_SOURCE_CODE() : number {
    return 6;
  }

  static get SRC_TARGET_CODE_ERROR() : number {
    return 7;
  }

  static get CURRENCY_CONVERSION_FAILED() : number {
    return 8;
  }

  static get REQUEST_ERROR() : number {
    return 9;
  }
}

export {OperationStatus, OperationErrors};