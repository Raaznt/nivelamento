import { OperationStatus, OperationErrors} from "../controller/status";
import {question} from 'readline-sync';
import { OperationResult } from "../model/ResultObjects";

class View {

  private messages: Map<OperationErrors, string>;

  constructor() {
    this.messages = new Map<OperationErrors, string>();
    this.setMessages();
  }

  public process(result : OperationResult) {
    if(result.status === OperationStatus.FAIL) {
      result.errors?.forEach(err => {
        console.log(this.messages.get(err.errorCode));
      });
    }
  }

  public showConversionResult(result: OperationResult) {
    let value: string;
    if(result.status === OperationStatus.SUCCESS) {
      value = result.result;
      console.log("Valor destino: ", result.result.value);
      console.log("Taxa: ", result.result.factor);
    }
  }

  public get userInput() : string[] {
    let currencySource: string = question("\nMoeda origem: ");
    let currencyValue: string = question("Valor origem: ");
    let currencyTarget: string = question("Moeda destino: ");
    return [currencySource, currencyTarget, currencyValue];
  }



  private setMessages() : void {
    this.messages.set(
      OperationErrors.INVALID_CURRENCY_CODE,
      "ERRO: Código de Moeda invalido. Codigo de moeda possui 3 caracteres."
    );

    this.messages.set(
      OperationErrors.INVALID_VALUE,
      "ERRO: Valor de Moeda invalido."
    );

    this.messages.set(
      OperationErrors.VALUE_NOT_FOUND,
      "ERRO: Valor de Moeda nao foi informado."
    );

    this.messages.set(
      OperationErrors.CURRENCY_CODE_NOT_FOUND,
      "ERRO: Código da Moeda nao foi informado."
    );

    this.messages.set(
      OperationErrors.CURRENCY_CONVERSION_FAILED,
      "ERRO: Falha na conversao de moeda. Operacao nao realizada."
    );

    this.messages.set(
      OperationErrors.REQUEST_ERROR,
      "ERRO: Falha na comunicacao com API"
    );

    this.messages.set(
      OperationErrors.INVALID_SOURCE_CODE,
      "ERRO: Codigo de origem invalido."
    );

    this.messages.set(
      OperationErrors.INVALID_TARGET_CODE,
      "ERRO: Codigo de destino invalido"
    );

    this.messages.set(
      OperationErrors.SRC_TARGET_CODE_ERROR,
      "ERRO: Codigo de origem igual a codigo de destino"
    )

  }
}

export {View};