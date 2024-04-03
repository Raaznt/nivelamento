import {argv} from 'node:process';
import { OperationErrors, OperationStatus } from '../controller/status.js';

class ReadFileView {
  #messages;
  #filePath;

  constructor() {
    this.#messages = new Map();
    this.#setMessages();
    this.#filePath = argv[2];
  }

  get filePath() {
    return this.#filePath;
  }

  process(status, errors) {
    if(status === OperationStatus.SUCCESS) {
      console.log("Operacao de leitura realizada com sucesso");
    } else {
      errors.forEach(err => {
        console.log(this.#messages.get(err));
      });
    }
  }


  parseErrorMessages(failure_cases) {
    failure_cases.forEach((failure) => {
      failure.mensagens.forEach((erro) => {
        erro.mensagem = this.#messages.get(erro.mensagem);
      })
    })
  }

  #setMessages() { 
    this.#messages.set(
      OperationErrors.MANDATORY_FIELD_NOT_FOUND,
      "Campo obrigatorio nao informado."
    );

    this.#messages.set(
      OperationErrors.INVALID_NAME_FIELD,
      "Campo nome invalido."
    );

    this.#messages.set(
      OperationErrors.INVALID_CPF_FIELD,
      "Campo cpf invalido."
    );

    this.#messages.set(
      OperationErrors.INVALID_BIRTHDATE_FIELD,
      "Campo dt_nascimento invalido."
    );

    this.#messages.set(
      OperationErrors.INVALID_INCOME_FORMAT,
      "Campo renda_mensal invalida."
    );

    this.#messages.set(
      OperationErrors.INVALID_CIVIL_STATUS,
      "Campo estado_civil invalido."
    );

    this.#messages.set(
      OperationErrors.FILE_NOT_FOUND,
      "Arquivo nao encontrado."
    );

    this.#messages.set(
      OperationErrors.INVALID_CONTENT,
      "Arquivo de conteudo invalido."
    )
    
  }
}

export {ReadFileView};