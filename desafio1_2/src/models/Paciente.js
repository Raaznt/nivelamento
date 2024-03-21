import {Validador} from "../utils/Validador.js";

class Paciente {
  #cpf;
  #nome;
  #dataNascimento;

  constructor(cpf, nome, dataNascimento) {
    this.#nome = nome;
    this.#cpf = cpf;
    this.#dataNascimento = dataNascimento;
  }

  get nome () {
    return this.#nome;
  }

  get dataNascimento() {
    return this.#dataNascimento;
  } 

  get cpf() {
    return this.#cpf;
  }
}

export {Paciente};