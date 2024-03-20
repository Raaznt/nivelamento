import { Validador } from "../utils/Validador.js";

class Agendamento {
  #cpf;
  #data;
  #horaInicio;
  #horaFim;

  constructor(cpf, data, horaInicio, horaFim) {
    this.#cpf = cpf;
    this.#data = data;
    this.#horaInicio = horaInicio;
    this.#horaFim = horaFim;
  }

  static duracaoConsulta(data, horaInicio, horaFim) {
    var inicioMs, fimMs, diffS, horasDiff, minutosDiff;

    data = Validador.converterParaData(data);
    data.setHours(horaInicio.slice(0,2), horaInicio.slice(2));
    inicioMs = data.getTime();
    
    data.setHours(horaFim.slice(0, 2), horaFim.slice(2));
    fimMs = data.getTime();
    
    diffS = Math.floor((fimMs - inicioMs)/1000);
    horasDiff = Math.floor(diffS/3600);
    minutosDiff = Math.floor((diffS%3600)/60);
  
    return horasDiff.toString().padStart(2,0) + ":" + minutosDiff.toString().padStart(2,"0");
  } 

  get data() {
    return this.#data;
  }

  get horaInicio() {
    return this.#horaInicio;
  }

  get horaFim() {
    return this.#horaFim;
  }

  get cpf() {
    return this.#cpf;
  }
}

export {Agendamento};