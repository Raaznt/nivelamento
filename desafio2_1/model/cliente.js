import { validador } from "./validador.js";
import { OperationErrors} from "../controller/status.js";

class Cliente {
  #nome;
  #cpf;
  #dt_nascimento;
  #renda_mensal;
  #estado_civil;

  constructor(nome, cpf, dt_Nascimento, renda_mensal, estado_civil) {
    this.#nome = nome;
    this.#cpf = cpf;
    this.#dt_nascimento = dt_Nascimento;
    this.#renda_mensal = renda_mensal;
    this.#estado_civil = estado_civil;
  }

  static create(nome, cpf, dt_nascimento, renda_mensal, estado_civil) {
    const errors = [];

    if(!nome) {
      errors.push(
        {
          "campo" : "nome",
          "mensagem" : OperationErrors.MANDATORY_FIELD_NOT_FOUND
        }
      );
    } else if(!validador.verificarNome(nome)) {
      errors.push(
        {
          "campo" : "nome",
          "mensagem" : OperationErrors.INVALID_NAME_FIELD
        }
      );
    }

    if(!cpf) {
      errors.push(
        {
          "campo" : "cpf",
          "mensagem" : OperationErrors.MANDATORY_FIELD_NOT_FOUND
        }
      );
    } else if(!validador.verificarCPF(cpf)) {
      errors.push(
        {
          "campo" : "cpf",
          "mensagem" : OperationErrors.INVALID_CPF_FIELD
        }
      );
    }

    if(!dt_nascimento) {
      errors.push(
        {
          "campo" : "dt_nascimento",
          "mensagem" : OperationErrors.MANDATORY_FIELD_NOT_FOUND
        }
      );
    } else if(!validador.verificarFormatoData(dt_nascimento)) {
      errors.push(
        {
          "campo" : "dt_nascimento",
          "mensagem" : OperationErrors.INVALID_BIRTHDATE_FIELD
        }
      );
    }

    if(!validador.verificarFormatoRenda(renda_mensal)) {
      errors.push(
        {
          "campo" : "renda_mensal",
          "mensagem" : OperationErrors.INVALID_INCOME_FORMAT
        }
      );
    }

    if(!validador.verificarEstadoCivil(estado_civil)) {
      errors.push(
        {
          "campo" : "estado_civil",
          "mensagem" : OperationErrors.INVALID_CIVIL_STATUS
        }
      );
    }

    return errors.length === 0 ?
      {success : new Cliente(nome, cpf, renda_mensal, dt_nascimento, estado_civil)} :
      {failure : errors };
  }

  get nome() {
    return this.#nome;
  }

  get cpf() {
    return this.#cpf;
  }

  get dt_nascimento() {
    return this.#dt_nascimento;
  }

  get renda_mensal() {
    return this.#renda_mensal;
  }

  get estado_civil() {
    return this.#estado_civil;
  }
}

export {Cliente};