import { DateTime } from "luxon";

class Validador {
  #regexCPF;
  #regexNome;
  #regexData;
  #regexEstadoCivil;
  #regexRenda;
  constructor() {
    this.#regexCPF = new RegExp(/^\d{11}$/);
    this.#regexNome = new RegExp(/^(([A-Za-z]+)(\s([A-Za-z]+))*)$/);
    this.#regexData = new RegExp(/^((0[1-9])|([12][0-9])|(3[01]))((0[1-9])|(1[0-2]))[0-9]{4}$/);
    this.#regexEstadoCivil = new RegExp(/^[csvdCSVD]$/);
    this.#regexRenda = new RegExp(/^\d+\,[0-9]{2}$/);
  }

  verificarCPF(cpf) {

    function validarDigitosCPF(digitos) {
      var primeiroDigitoValido = false;
      var segundoDigitoValido = false;
  
      if(digitos.length === 11) {
        let soma1 = 0, soma2 = 0;
        for(let i = 0; i < digitos.length - 1; i++) {
          soma1 = (i < 9) ? soma1 +  Number(digitos[i]) * (11 - i - 1) : soma1;
          soma2 = (i < 10) ? soma2 + Number(digitos[i]) * (11 - i) : soma2;
        }
  
        let resto1 = soma1 % 11;
        if(resto1 < 2) {
          primeiroDigitoValido = Number(digitos[9]) === 0;
        } else {
          primeiroDigitoValido = (Number(digitos[9]) === (11 - resto1));
        }
  
        let resto2 = soma2 % 11;
        if(resto2 < 2) {
          segundoDigitoValido = (Number(digitos[10]) === 0);  
        } else {
          segundoDigitoValido = (Number(digitos[10]) === (11 - resto2));
        }
      }
  
      return primeiroDigitoValido && segundoDigitoValido;
    }

    const expCPF = this.#regexCPF;
    var valido = false;
    if(typeof cpf === "string") {
      let digits = cpf.split("");
      valido = expCPF.test(cpf) && validarDigitosCPF(digits);
    } 

    return valido;
  }

  verificarNome(nome) {
    var valido = false;
    const expNome = this.#regexNome;
    var valido = (expNome.test(nome)) && (nome.length > 4);
    return valido;
  }

  verificarFormatoData(data) {
    var valido = false;
    const expData = this.#regexData;
    valido = expData.test(data);
    let dt = DateTime.fromFormat(data,'ddMMyyyy');
    valido = valido && dt.isValid
    return valido;
  }

  static #converterParaData(dataString, horaInicio="0000") {
    var data = moment(dataString, "DD/MM/YYYY", true).toDate();
    data.setHours(horaInicio.slice(0, 2), horaInicio.slice(2));
    return data;
  }

  static #calcularIdade(data) {
    var idade = -1;
    var dataAtual = new Date();
    data = Validador.converterParaData(data);
    idade = dataAtual.getFullYear() - data.getFullYear();
    if(dataAtual.getMonth() < data.getMonth()){
      --idade;
    } else if(dataAtual.getDate() < data.getDate()) {
      --idade;
    }
    
    return idade;
  }

  verificarEstadoCivil(estado) {
    const valido = this.#regexEstadoCivil.test(estado);
    return valido;
  }

  verificarFormatoRenda(renda) {
    const valido = this.#regexRenda.test(renda);
    return valido;
  }
}

const validador = new Validador();

export {validador};