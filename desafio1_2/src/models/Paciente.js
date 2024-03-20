import {Validador} from "../utils/Validador.js";

class Paciente {
  #cpf;
  #nome;
  #dataNascimento;

  constructor(cpf, nome, dataNascimento) {
    var valido = false;
    
    valido = Validador.verificarNome(nome);
    if(valido) this.#nome = nome;
    
    valido = Validador.verificarCPF(cpf);
    if(valido) this.#cpf = cpf;
    
    valido = Validador.verificarFormatoData(dataNascimento);
    const data = Validador.converterParaData(dataNascimento);
    valido = valido && (Validador.calcularIdade(data) >= 13)
    if(valido) this.#dataNascimento = dataNascimento;
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