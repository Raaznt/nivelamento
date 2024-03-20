import moment from "moment";
class Validador {
  
  static verificarCPF(cpf) {

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

    const expCPF = new RegExp(/^\d{11}$/);
    var valido = false;
    if(typeof cpf === "string") {
      let digits = cpf.split("");
      valido = expCPF.test(cpf) && validarDigitosCPF(digits);
    } 

    return valido;
  }

  static verificarNome(nome) {
    var valido = false;
    const expNome = new RegExp(/^(([A-Z]{1}[a-z]+)(\s([A-Z]{1}[a-z]+))*)$/);
    var valido = (expNome.test(nome)) && (nome.length > 4);
    return valido;
  }

  static verificarFormatoData(data) {
    var valido = false;
    const expData = new RegExp(/^((0[1-9])|([12][0-9])|(3[01]))\/((0[1-9])|(1[0-2]))\/[0-9]{4}$/);
    valido = expData.test(data);
    let dataMoment = moment(data, "DD/MM/YYYY", true);
    valido = valido && dataMoment.isValid();
    return valido;
  }

  static verificarFormatoHoras(horas) {
    var valido = false;
    const expHour = new RegExp(/^(([01][0-9])|([2][0-3]))([0-5][0-9])$/);
    valido = expHour.test(horas);
    return valido;
  }

  static verificarIntervalo(horaInicio, horaFim) {
    horaInicio = Number(horaInicio.slice(0, 2)) * 60 + Number(horaInicio.slice(2));
    horaFim = Number(horaFim.slice(0, 2)) * 60 + Number(horaFim.slice(2));

    return horaFim > horaInicio;
  }

  static verificarPertinenciaHora(hora, horaInicio, horaFim) {
    var valido = false;
    valido = Validador.verificarIntervalo(horaInicio, horaFim);

    hora = Number(hora.slice(0, 2)) * 60 + Number(hora.slice(2));
    horaInicio = Number(horaInicio.slice(0, 2)) * 60 + Number(horaInicio.slice(2));
    horaFim = Number(horaFim.slice(0, 2)) * 60 + Number(horaFim.slice(2));

    valido =  valido && (hora >= horaInicio) && (hora<= horaFim);
    return valido;
  }


  static converterParaData(dataString, horaInicio="0000") {
    var data = moment(dataString, "DD/MM/YYYY", true).toDate();
    data.setHours(horaInicio.slice(0, 2), horaInicio.slice(2));
    return data;
  }

  static verificarDataFutura(dataAnterior, dataPosterior, horaInicio, horaFim) {

      var valido = false;
      if(dataAnterior instanceof Date) {
        const dataConsulta = Validador.converterParaData(dataPosterior);
        
        dataConsulta.setHours(horaInicio.slice(0, 2), horaInicio.slice(2));
        const horaInicioMs = dataConsulta.getTime();

        dataConsulta.setHours(horaFim.slice(0, 2), horaFim.slice(2));
        const horaFimMs = dataConsulta.getTime();

        valido = (horaInicioMs >= dataAnterior.getTime());
        valido = valido && (horaFimMs > dataAnterior.getTime());
      }
      return valido;
  }

  static calcularIdade(data) {
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
}

export {Validador};