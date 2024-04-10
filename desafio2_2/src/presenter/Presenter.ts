import { ConversionController } from "../controller/ConversionController";
import { RequestController } from "../controller/RequestController";
import { OperationErrors, OperationStatus } from "../controller/status";
import { Currency } from "../model/Currency";
import { OperationResult } from "../model/ResultObjects";
import { View } from "../view/View";

class Input {
  static get CURRENCY_SOURCE(): number {
    return 0;
  }

  static get CURRENCY_TARGET(): number {
    return 1;
  }

  static get CURRENCY_VALUE(): number {
    return 2;
  }
}

class Presenter {
  private view: View;
  private requestContoller: RequestController;
  private conversionController: ConversionController;

  constructor(requestController: RequestController, conversionController: ConversionController) {
    this.view = new View();
    this.requestContoller = requestController;
    this.conversionController = conversionController;
  }

  async run() {
    //Realiza a requisicao e retorna o resultado
    let result: OperationResult = await this.requestContoller.init();
    this.conversionController.conversionRates = this.requestContoller.conversionRates;
    this.view.process(result);

    let isLoopActive: boolean = result.status === OperationStatus.SUCCESS;
    let input: string[];

    while(isLoopActive) {
      //Obtem dados de entrada do usuario
      input = this.view.userInput;
      
      if(!input[Input.CURRENCY_SOURCE]) 
        isLoopActive = false;

      //Valida a entrada
      result = Currency.create(input[Input.CURRENCY_SOURCE], input[Input.CURRENCY_VALUE]);

      //Processa o resultado da operacao e apresenta mensagens em caso de erro
      this.view.process(result);

      //Se os dados informados definem uma moeda fonte e moeda destino validas
      //realiza a conversao
      if(result.status === OperationStatus.SUCCESS) {
        result = this.conversionController.convert(
          result.result.currencyCode,
          result.result.currencyValue,
          input[Input.CURRENCY_TARGET],
        
        );
        this.view.process(result);
        this.view.showConversionResult(result);
      }
    }
  }
}

export {Presenter};