interface CustomError {
  errorCode: number;
}

interface OperationResult {
  status: number;
  result?: any;
  errors?: CustomError[];
} 

export {OperationResult, CustomError}