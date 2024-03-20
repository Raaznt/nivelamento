import { Agenda } from "../models/Agenda.js";
import {Agendamento} from "../models/Agendamento.js";
import { Validador } from "../utils/Validador.js";
import { View } from "../views/View.js";

class Controller {
  constructor(model, view) {
    if(model instanceof Agenda) this.model = model;
    if(view instanceof View) this.view = view;
  }

  cadastrarPaciente(cpf, nome, dataNascimento) {
    return this.model.efetuarCadastro(cpf, nome, dataNascimento);
  }

  excluirPaciente(cpf) {
    var estadoDaOperacao = this.model.excluirPaciente(cpf);
    return estadoDaOperacao;
  }

  agendar(cpf, data, horaInicio, horaFim) {
    return this.model.efetuarAgendamento(cpf, data, horaInicio, horaFim);
  }
 
  listarPacientes(criterioOrdenacao=1) {
    var resultado = [];
    var obj;
    for(const paciente of this.model.pacientes) {
      obj = {
        "cpf" : paciente.cpf,
        "nome" : paciente.nome, 
        "dataNascimento" : paciente.dataNascimento
      } 
      resultado.push(obj);
    }

    if(criterioOrdenacao === 1) {
      resultado.sort((obj1, obj2) => obj1.nome.localeCompare(obj2.nome));
    } else if(criterioOrdenacao === 2) {
      resultado.sort((obj1, obj2) => obj1.cpf.localeCompare(obj2.cpf));
    }

    return resultado;
  }

  obterConsulta(cpf)  {
    var dataAtual = new Date();
    var consultaFutura = this.model.agendamentos.find(
      (consulta) => {
        var encontrado = false;
        encontrado = Validador.verificarDataFutura(dataAtual, consulta.data, consulta.horaInicio, consulta.horaFim);
        encontrado = encontrado && (consulta.cpf === cpf);
        return encontrado;
      }    
    );

    var obj;
    if(!!consultaFutura) {
      obj = {
        "data" : consultaFutura.data,
        "horaInicio" : consultaFutura.horaInicio,
        "horaFim" : consultaFutura.horaFim
      };
    }

    return obj; 
  }

  cancelarAgendamento(cpf, data, horaInicio) {
    return this.model.cancelarAgendamento(cpf, data, horaInicio);
  }

  listarAgendaPeriodo(dataInicial, dataFinal) {
    var resultados = [];
    var horaInicio, horaFim;
    var listaAgendamentos = this.model.agendamentos.filter(
      (agendamento) => {
        const agendamentoData = Validador.converterParaData(agendamento.data);
        const dataInicio = Validador.converterParaData(dataInicial);
        const dataFim = Validador.converterParaData(dataFinal);
        return (agendamentoData.getTime() >= dataInicio.getTime()) && (agendamentoData.getTime() <= dataFim.getTime());
      }
    )

    listaAgendamentos.sort(
      (agendamento1, agendamento2) => {
        const data1 = Validador.converterParaData(agendamento1.data, agendamento1.horaInicio)
        const data2 = Validador.converterParaData(agendamento2.data, agendamento2.horaInicio);
        return data1.getTime() - data2.getTime();
      }
    )

    for(const agendamento of listaAgendamentos) {
      const paciente = this.model.pacientes.find((p) => p.cpf === agendamento.cpf);
      const duracao = Agendamento.duracaoConsulta(agendamento.data, agendamento.horaInicio, agendamento.horaFim);
      horaInicio = agendamento.horaInicio.slice(0, 2) + ":" + agendamento.horaInicio.slice(2);
      horaFim = agendamento.horaFim.slice(0, 2) + ":" + agendamento.horaFim.slice(2);
      resultados.push(
        {
          "nome" : paciente.nome,
          "dataNascimento" : paciente.dataNascimento,
          "dataConsulta" : agendamento.data,
          "horaInicio" : horaInicio,
          "horaFim" : horaFim,
          "duracao" : duracao
        }
      );
    }

    return resultados;
  }

  listarAgendamentos() {
    var resultados = [];
    var obj, paciente, duracao, horaInicio, horaFim;
    var agendamentos = this.model.agendamentos.toSorted(
      (obj1, obj2) => {
        const data1 = Validador.converterParaData(obj1.dataConsulta, obj1.horaInicio);
        const data2 = Validador.converterParaData(obj2.dataConsulta, obj2.horaInicio);
        return data1 - data2;
      }
    )

    for(const agendamento of agendamentos) {
      paciente = this.model.pacientes.find((p) => (agendamento.cpf === p.cpf));
      duracao = Agendamento.duracaoConsulta(agendamento.data, agendamento.horaInicio, agendamento.horaFim);
      horaInicio = agendamento.horaInicio.slice(0, 2) + ":" + agendamento.horaInicio.slice(2);
      horaFim = agendamento.horaFim.slice(0, 2) + ":" + agendamento.horaFim.slice(2);
      obj = {
        "nome" : paciente.nome,
        "dataNascimento": paciente.dataNascimento,
        "dataConsulta" : agendamento.data,
        "horaInicio" : horaInicio,
        "horaFim" : horaFim,
        "duracao" : duracao
      };
      resultados.push(obj);
    }

    return resultados;
  }

  estaCadastrado(cpf) {
    return this.model.estaCadastrado(cpf);
  }

  executar() {
    this.view.setController(this);
    this.view.exibirMenu();
  }
}

export {Controller};