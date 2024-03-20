import { question } from "readline-sync";
import { Validador } from "../utils/Validador.js";
import { Controller } from "../controllers/Controller.js";

class View {
  #controller;

  setController(controller) {
    if(controller instanceof Controller) {
      this.#controller = controller;
    }
    
  }

  exibirMenu() {
    var menuAtivo = true;

    while(menuAtivo) {
      var opt = Number(question("\nMenu Principal\n1-Cadastro de Pacientes\n2-Agenda\n3-Fim\n"));
      switch(opt) {
        case 1:
          this.#menuCadastroPacientes();
          break;
        case 2:
          this.#menuAgenda();
          break;
        case 3:
          menuAtivo = false;
          break;
      }
    }
  }

  #menuCadastroPacientes() {
    var menuAtivo = true;
    let cpf, nome, dataNascimento;
    while(menuAtivo) {
      var opt = Number(question(
      "\nMenu do Cadastro de Pacientes\n"+
      "1-Cadastrar novo paciente\n"+
      "2-Excluir pacientes\n"+
      "3-Listar pacientes (ordenado por CPF)\n"+
      "4-Listar pacientes (ordenado por nome)\n"+
      "5-Voltar p/ menu principal\n"));
      switch(opt) {
        case 1:
          cpf = this.#setCPF()
          nome = this.#setNome();
          dataNascimento = this.#setDataNascimento();
          let cadastrado = this.#controller.cadastrarPaciente(cpf, nome, dataNascimento);
          if(cadastrado) {
            console.log("\nPaciente cadastrado com sucesso.\n");
          }
          break;
        case 2:
          cpf = question("CPF: ");
          if(this.#controller.estaCadastrado(cpf)){
            if(this.#controller.excluirPaciente(cpf)) {
              console.log("Paciente excluido com sucesso!");
            } else {
              console.log("Paciente esta agendado");
            }
          } else {
            console.log("ERRO: Paciente nao cadastrado");
          }
          break;
        case 3:
          this.#listarPacientes(2);
          break;
        case 4:
          this.#listarPacientes(1);
          break;
        case 5:
          menuAtivo = false;
          break;
      }
    }
  }

  #menuAgenda() {
    var menuAtivo =  true;
    var valido = false;
    var opt, dataAtual, cpf, data, horaInicio, horaFim;
    while(menuAtivo){
      var opt = Number(question(
      "\nAgenda\n"+
      "1-Agendar consulta\n"+
      "2-Cancelar agendamento\n"+
      "3-Listar agenda\n"+
      "4-Voltar p/ menu principal\n"));
      switch(opt) {
        case 1:
          cpf = this.#verificarPacientePorCPF();
          data = this.#definirDataConsulta();
          horaInicio = this.#definirHorarioInicial();
          horaFim = this.#definirHorarioFinal();
          dataAtual = new Date();
          
          valido = Validador.verificarIntervalo(horaInicio, horaFim);
          if(!valido){
            console.log("ERRO: Hora inicial e posterior a hora final.");
          }

          valido = valido && Validador.verificarDataFutura(dataAtual, data, horaInicio, horaFim);
          if(!valido) {
            console.log("ERRO: Horario da consulta e anterior ao horario atual.");
          }

          if(valido){
            valido = this.#controller.agendar(cpf, data, horaInicio, horaFim);
            if(valido) {
              console.log("Agendamento realizado com sucesso!");
            } else {
              console.log("ERRO: Paciente possui consulta agendada.");
            }
          } 
          break;
        case 2:
          cpf = this.#verificarPacientePorCPF();
          data = this.#definirDataConsulta();
          horaInicio = this.#definirHorarioInicial();
          if(this.#controller.cancelarAgendamento(cpf, data, horaInicio)) {
            console.log("Agendamento cancelado com sucesso!");
          } else {
            console.log("ERRO: agendamento nao encontrado.");
          }
          break;
        case 3:
          var opt = question("Apresentar a agenda T-Toda ou P-Periodo: ");
          if(opt.toUpperCase() === "P") {
            data = question("Data inicial: ");
            dataAtual = question("Data final: ");
            this.#listarAgendamentosPeriodo(data, dataAtual);
          } else if(opt.toUpperCase() === "T") {
            this.#listarAgendamentos();
          }          
          break;
        case 4:
          menuAtivo = false;
          break;
      }
    }
  }

  #setNome() {
    var valido = false;
    var nome;
    do {
      nome = question("Nome: ");
      valido = Validador.verificarNome(nome);
      if(!valido) {
        console.log("ERRO:" + 
        "Nome invalido. Deve conter 5 letras. Nome e sobrenome devem comecar com maiusculas.");
      }
    } while(!valido);
    return nome;
  }

  #setCPF() {
    var valido = false;
    var cpf;
    do {
      cpf = question("CPF: ");
      valido = Validador.verificarCPF(cpf);
      if(!valido) { 
        console.log("ERRO: " +
        "CPF invalido. Deve conter 11 digitos.");
      } else if(this.#controller.estaCadastrado(cpf)) {
        console.log("\nCPF ja cadastrado\n");
        valido = false;
      }
    } while(!valido);
    return cpf;
  }

  #setDataNascimento() {
    var valido = false;
    var dataNascimento;
    const dataAtual = new Date();
    do {
      dataNascimento = question("Data Nascimento: ");
      valido = Validador.verificarFormatoData(dataNascimento);
      if(!valido) {
        console.log("\nERRO: Data invalida. O formato deve ser DD/MM/AAAA." + "\n");
      } else if(Validador.verificarDataFutura(dataAtual, dataNascimento, "0000","0000")) {
        console.log("\nERRO: Data de nascimento posterior a data atual." + "\n");
        valido = false;
      } else if(!(Validador.calcularIdade(dataNascimento) >= 13)) {
        console.log("\nERRO: Paciente deve ter pelo menos 13 anos." + "\n");
        valido = false;
      }
    } while(!valido);
    return dataNascimento;
  }

  #verificarPacientePorCPF() {
    var cpf;
    var valido = false;
    do {
      cpf = question("CPF: ");
      valido = this.#controller.estaCadastrado(cpf);
      if(!valido) {
        console.log("Erro: paciente nao cadastrado");
      }
    }while(!valido);
    return cpf;
  }

  #definirDataConsulta() {
    var valido = false;
    var data;
    do {
      data = question("Data da consulta: ");
      valido = Validador.verificarFormatoData(data);

      if(!valido) {
        console.log("Erro: Data invalida. O formato deve ser DD/MM/AAAA.");
      }
    } while(!valido);

    return data;
  }

  #definirHorarioInicial() {
    var valido = false;
    var horarioInicial;
    do {
      horarioInicial = question("Horario inicial: ");
      valido = Validador.verificarFormatoHoras(horarioInicial);
      if(!valido) {
        console.log("Erro: Hora invalida. O formato deve ser HHMM");
      }

      valido = valido && ((Number(horarioInicial.slice(2)) % 15) === 0);
      if(!valido) {
        console.log("Erro: Horario invalido. Horario deve ser definido em intervalos de 15 minutos");
      }

      valido = valido && Validador.verificarPertinenciaHora(horarioInicial, "0800", "1900");
      if(!valido) {
        console.log("Erro: horario informado nao pertence ao horario de funcionamento de 8:00 as 19:00");
      }

    } while(!valido);
    return horarioInicial;
  }

  #definirHorarioFinal() {
    var valido = false;
    var horarioFinal;
    do {
      horarioFinal = question("Horario final: ");
      valido = Validador.verificarFormatoHoras(horarioFinal);
      if(!valido) {
        console.log("Erro: Hora invalida. O formato deve ser HHMM");
      }

      valido = valido && ((Number(horarioFinal.slice(2)) % 15) === 0);
      if(!valido) {
        console.log("Erro: Horario invalido. Horario deve ser definido em intervalos de 15 minutos");
      }

      valido = valido && Validador.verificarPertinenciaHora(horarioFinal, "0800", "1900");
      if(!valido) {
        console.log("Erro: horario informado nao pertence ao horario de funcionamento de 8:00 as 19:00");
      }

    } while(!valido);
    return horarioFinal;
  }

  #listarPacientes(opt) {
    const cabecalho = Array(73).join("-") +
    ("\nCPF" + Array(14).join(" ")).slice(0, 14) +
    ("Nome" + Array(38).join(" ")).slice(0, 38) +
    ("Dt.Nasc." + Array(13).join(" ")).slice(0, 13) +
    ("Idade" + Array(8).join(" ")).slice(0, 8) + "\n" +
    Array(73).join("-");
    var pacientes = this.#controller.listarPacientes(opt);
    var consulta;
    console.log(cabecalho);
    for(const paciente of pacientes) {
      const idade = Validador.calcularIdade(paciente.dataNascimento);
      consulta = this.#controller.obterConsulta(paciente.cpf);
      const registro = (`${paciente.cpf}` + Array(13).join(" ")).slice(0, 13) +
      (`${paciente.nome}` + Array(36).join(" ")).slice(0, 36) + Array(3).join(" ") +
      (`${paciente.dataNascimento}` + Array(13).join(" ")).slice(0, 13) + 
      (`${idade}` + Array(8).join(" ")).slice(0, 8);
      console.log(registro);
      if(!!consulta) {
        consulta = Array(14).join(" ") + `Agendado para: ${consulta.data}\n` +
        Array(14).join(" ") + `${consulta.horaInicio.slice(0,2)}` + ":" +
        `${consulta.horaInicio.slice(2)}` + " as " + `${consulta.horaFim.slice(0, 2)}` + ":" +
        `${consulta.horaFim.slice(2)}`;
        console.log(consulta);
      }
    }
    console.log(Array(73).join("-"));
  }

  #listarAgendamentosPeriodo(dataInicio, dataFim) {
    const cabecalho = Array(61).join("-") +
    ("\nData" + Array(12).join(" ")).slice(0, 12) +
    ("H.Ini" + Array(6).join(" ")).slice(0, 6) +
    ("H.Fim" + Array(6).join(" ")).slice(0, 6) +
    ("Tempo" + Array(6).join(" ")).slice(0, 6) + 
    ("Nome" + Array(21).join(" ")).slice(0, 21) + 
    ("Dt.Nasc." + Array(10).join(" ")).slice(0, 10) + "\n" +
    Array(61).join("-");
    var resultados = this.#controller.listarAgendaPeriodo(dataInicio, dataFim);
    var dataAnterior = " ";
    var dataStr = " ";
    console.log(cabecalho);
    for(const registro of resultados) {
      if(registro.dataConsulta === dataAnterior) {
        dataStr = " ";
      } else {
        dataAnterior = registro.dataConsulta;
        dataStr = dataAnterior;
      }
      const consulta = (`${dataStr}` + Array(11).join(" ")).slice(0, 11) +
      (`${registro.horaInicio}` + Array(6).join(" ")).slice(0, 6) + 
      (`${registro.horaFim}` + Array(6).join(" ")).slice(0, 6) + 
      (`${registro.duracao}` + Array(6).join(" ")).slice(0, 6) +
      (`${registro.nome}`.slice(0, 20) + Array(21).join(" ")).slice(0, 21) +
      (`${registro.dataNascimento}` + Array(10).join(" ")).slice(0, 10);
      console.log(consulta);
    }
    console.log(Array(61).join("-"));
  }

  #listarAgendamentos() {
    const cabecalho = Array(61).join("-") +
    ("\nData" + Array(12).join(" ")).slice(0, 12) +
    ("H.Ini" + Array(6).join(" ")).slice(0, 6) +
    ("H.Fim" + Array(6).join(" ")).slice(0, 6) +
    ("Tempo" + Array(6).join(" ")).slice(0, 6) + 
    ("Nome" + Array(21).join(" ")).slice(0, 21) + 
    ("Dt.Nasc." + Array(10).join(" ")).slice(0, 10) + "\n" +
    Array(61).join("-");
    var resultados = this.#controller.listarAgendamentos();
    var dataAnterior = " ";
    var dataStr = " ";
    console.log(cabecalho);
    for(const registro of resultados) {
      if(registro.dataConsulta === dataAnterior) {
        dataStr = " ";
      } else {
        dataAnterior = registro.dataConsulta;
        dataStr = dataAnterior;
      }
      const consulta = (`${dataStr}` + Array(11).join(" ")).slice(0, 11) +
      (`${registro.horaInicio}` + Array(6).join(" ")).slice(0, 6) + 
      (`${registro.horaFim}` + Array(6).join(" ")).slice(0, 6) + 
      (`${registro.duracao}` + Array(6).join(" ")).slice(0, 6) +
      (`${registro.nome}`.slice(0, 20) + Array(21).join(" ")).slice(0, 21) +
      (`${registro.dataNascimento}` + Array(10).join(" ")).slice(0, 10);
      console.log(consulta);
    }
    console.log(Array(61).join("-"));
  }
}

export {View};