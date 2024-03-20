import { Paciente } from "./Paciente.js";
import { Agendamento } from "./Agendamento.js";
import {Validador} from "../utils/Validador.js";

class Agenda {
  #pacientes;
  #agendamentos;

  constructor() {
    this.#pacientes = [];
    this.#agendamentos = [];
  }

  efetuarCadastro(cpf, nome, dataNascimento) {
    var pacienteExiste = !!this.#pacientes.find((paciente) =>  (paciente.cpf === cpf))
    
    if(!pacienteExiste) {
      const paciente = new Paciente(cpf, nome, dataNascimento);
      this.#pacientes.push(paciente);
    }
    
    return !pacienteExiste;
  }

  excluirPaciente(cpf) {
    var estadoDaOperacao = false;
  
    const dataAtual = new Date();
    var agendamentosFuturos = this.agendamentos.filter(
      (agendamento) => {
        const data = agendamento.data;
        const horaInicio = agendamento.horaInicio;
        const horaFim = agendamento.horaFim;
        return Validador.verificarDataFutura(dataAtual, data, horaInicio, horaFim);
      }
    );

    estadoDaOperacao = (agendamentosFuturos.length === 0)

    if(estadoDaOperacao) {
      this.agendamentos.filter(
        (agendamento, index, arr) => {
          if(agendamento.cpf === cpf) {
            arr.splice(index, 1);
            return true;
          }
          return false;
        }
      );

      this.pacientes.filter(
        (paciente, index, arr) => {
          if(paciente.cpf === cpf) {
            arr.splice(index, 1);
            return true;
          }
          return false;
        }
      )
    }
    
    return estadoDaOperacao;
  }

  efetuarAgendamento(cpf, dataConsulta, horaInicial, horaFinal) {
    var agendamentoFuturo = true;
    var horaDisponivel = true;
    var pacienteEncontrado = true;
    
    pacienteEncontrado = !!this.#pacientes.find((paciente) =>  (paciente.cpf === cpf));
    if(pacienteEncontrado) {  
      const dataAtual = new Date();
      agendamentoFuturo = !!this.#agendamentos.find(
        (agendamento) => {
          return (agendamento.cpf === cpf) &&
          Validador.verificarDataFutura(
            dataAtual,
            agendamento.data,
            agendamento.horaInicio,
            agendamento.horaFim
          );
        }
      );

      horaDisponivel = !this.verificarSobreposicaoHorario(dataConsulta, horaInicial) 
      horaDisponivel = horaDisponivel && !this.verificarSobreposicaoHorario(dataConsulta, horaFinal);

      if(!agendamentoFuturo && horaDisponivel) {
        const novoAgendamento = new Agendamento(cpf, dataConsulta, horaInicial, horaFinal);
        this.#agendamentos.push(novoAgendamento);
      }

      return !agendamentoFuturo && horaDisponivel;
    }
  }

  cancelarAgendamento(cpf, data, horaInicial) {
    var horarioAtual = new Date();
    var cancelamentos = this.#agendamentos.filter(
      (agendamento, indice, arr) => {
        var encontrado = false;
        var agendamentoFuturo = false;
        agendamentoFuturo = Validador.verificarDataFutura(horarioAtual, agendamento.data, agendamento.horaInicio, "2359");
        encontrado = (agendamento.cpf === cpf);
        encontrado = encontrado && (agendamento.data === data);
        encontrado = encontrado && (agendamento.horaInicio == horaInicial);
        encontrado = encontrado && agendamentoFuturo;
        
        if(encontrado) {
          arr.splice(indice, 1);
          return true;
        }
        return false;
      }
    );

    return cancelamentos.length > 0;

  }

  estaCadastrado(cpf) {
    return !!this.#pacientes.find((paciente) =>  (paciente.cpf === cpf));
  }

  verificarSobreposicaoHorario(data, hora) {
    var sobreposicao = false;

    sobreposicao = !!this.#agendamentos.find((agendamento) => 
      (agendamento.data === data) && Validador.verificarPertinenciaHora(hora, agendamento.horaInicio, agendamento.horaFim)
    );
    return sobreposicao;
  }

  get pacientes() {
    return this.#pacientes;
  }

  get agendamentos() {
    return this.#agendamentos;
  }

}

export {Agenda};