import { OperationErrors, OperationStatus } from './status';
import { OperationResult } from '../model/ResultObjects';
import axios, {AxiosResponse} from 'axios';

interface MyResponse {
  conversion_rates: {}
}

class RequestController {
  private URI: string;
  private _conversionRates? : any;

  constructor(URI: string) {
    this.URI = URI;
  }

  public async getAPIData(): Promise<OperationResult> {
    try{
      const response: AxiosResponse<MyResponse> = await axios.get(this.URI);
      const data: MyResponse = response.data;
      this.updateProperties(data);
      return {status: OperationStatus.SUCCESS};
    } catch {
      return {
        status: OperationStatus.FAIL,
        errors: [{errorCode: OperationErrors.REQUEST_ERROR}]
      }
    }
  }

  public async init(): Promise<OperationResult> {
    return await this.getAPIData();
  }
 
  public get conversionRates() {
    return this._conversionRates;
  }

  public updateProperties(APIdata: MyResponse) {
    this._conversionRates = APIdata.conversion_rates;
  }

 }

export {RequestController};