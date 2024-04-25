import {question} from 'readline-sync';
import { ValidationResult } from '../models/validation/ValidationResult';
import { OperationErrors, OperationStatus } from '../controllers/status';
import { OperationResult } from '../models/operationResult';
import { DateTime } from 'luxon';

class View {

  private messages: Map<OperationErrors, string>;

  constructor() {
    this.messages = new Map<OperationErrors, string>();
    this.setMessages();
  }

  public showMainMenu() {
    let opt: number;
    opt = Number(question("\nMenu Principal\n1-Cadastro de Pacientes\n2-Agenda\n3-Fim\n\n"));
    return opt;
  }

  public showPatientRegisterMenu() {
    let opt: number;
    opt = Number(question(
      "\nMenu do Cadastro de Pacientes\n"+
      "1-Cadastrar novo paciente\n"+
      "2-Excluir pacientes\n"+
      "3-Listar pacientes (ordenado por CPF)\n"+
      "4-Listar pacientes (ordenado por nome)\n"+
      "5-Voltar p/ menu principal\n\n"));
    return opt;
  }

  public showSchedulingMenu(): number {
    let opt: number;
   
    opt = Number(question(
    "\nAgenda\n"+
    "1-Agendar consulta\n"+
    "2-Cancelar agendamento\n"+
    "3-Listar agenda\n"+
    "4-Voltar p/ menu principal\n\n"));
    
    return opt;
  }

  public get patient(): object {
    let cpf: string = question("CPF: ");
    let name: string = question("Nome: ");
    let birthdate: string = question("Data Nascimento: ");

    return {cpf, name, birthdate};
  }

  public get cpf(): object {
    let cpf: string = question("CPF: ");
    return {cpf};
  }

  public get scheduling(): object {
    let cpf: string = question("CPF: ");
    let date: string = question("Data da consulta: ");
    let startTime: string = question("Hora inicial: ");
    let endTime: string = question("Hora final: ");
    
    return {cpf, date, startTime, endTime};
  }

  public get schedulingToRemove(): object {
    let cpf: string = question("CPF: ");
    let date: string = question("Data da consulta: ");
    let startTime: string = question("Hora inicial: ");

    return {cpf, date, startTime};
  }

  public get schedulingListOption() : object{
    let option: string = question("\nApresentar a agenda T-Toda ou P-Periodo: ");
    return {option};
  }

  public get period(): object {
    let startDate: string = question('\nData inicial: ');
    let endDate: string = question('Data Final: ');
    return {startDate, endDate};
  }

  public processPersistenceOperationStatus(operationResult: OperationResult) {
    if(operationResult.status === OperationStatus.SUCCESS) {
      console.log("\nOperacao bem sucedida.\n")
      this.processPersistenceOperationResult(operationResult);
    } else {
      operationResult.errors?.forEach(err=>{
        console.log(`\n${this.messages.get(err.errorCode)}`);
      })
    }
  }

  private processPersistenceOperationResult(operationResult: OperationResult) {
    if(!!operationResult.result) {
      let futureSchedulings: any[]= operationResult.result?.futureSchedulings;
      let allPatients: any[] = operationResult.result.allPatients;
      let schedulingsByPeriod: any[] = operationResult.result?.schedulingsByPeriod;
      let allSchedulings: any[] = operationResult.result?.allSchedulings;
      let patientScheduling: any;
      
      //Listagem de todos os pacientes
      if(!!futureSchedulings && !!allPatients) {
        this.displayPatientList(allPatients, futureSchedulings);
      }

      //Listagem de consultas por periodo
      if(!!schedulingsByPeriod) {
        this.displaySchedulings(schedulingsByPeriod);
      }

      //Listagem de todas as consultas
      if(!!allSchedulings) {
        this.displaySchedulings(allSchedulings);
      }

    }
  }

  public processPatientValidation(validationResult: ValidationResult) {
    if(!validationResult.status) {
      validationResult.causes.forEach(cause => {
        console.log(this.messages.get(cause));
      });
    }
  }

  private displayPatientList(patientList: any[], schedulingList: any[]): void{
    const header = Array(73).join("-") +
    ("\nCPF" + Array(14).join(" ")).slice(0, 14) +
    ("Nome" + Array(38).join(" ")).slice(0, 38) +
    ("Dt.Nasc." + Array(13).join(" ")).slice(0, 13) +
    ("Idade" + Array(8).join(" ")).slice(0, 8) + "\n" +
    Array(73).join("-");
    let patientScheduling: any;
    let schedulingData: string;
    let formattedDate: string;
    let formattedStart: string;
    let formattedEnd: string;
    console.log(header);
    for(const patient of patientList) {
      const age = this.getAge(patient);
      formattedDate = DateTime.fromFormat(patient.dataNascimento,'yyyy-MM-dd').
      toFormat('dd/MM/yyyy');
      patientScheduling = schedulingList.find(scheduling => {
        return scheduling.pacienteCPF === patient.cpf
      });
      const registro = (`${patient.cpf}` + Array(13).join(" ")).slice(0, 13) +
      (`${patient.nome}` + Array(36).join(" ")).slice(0, 36) + Array(3).join(" ") +
      (`${formattedDate}` + Array(13).join(" ")).slice(0, 13) + 
      (`${age}` + Array(8).join(" ")).slice(0, 8);
      console.log(registro);
      if(!!patientScheduling) {
        formattedStart = DateTime.fromFormat(patientScheduling.horarioInicio, 'HH:mm:ss').
        toFormat('HHmm');
        formattedEnd = DateTime.fromFormat(patientScheduling.horarioFim, 'HH:mm:ss').
        toFormat('HHmm');
        formattedDate = DateTime.fromFormat(patientScheduling.dataConsulta,'yyyy-MM-dd').
        toFormat('dd/MM/yyyy');
        schedulingData = Array(14).join(" ") +
        `Agendado para: ${formattedDate}\n` +
        Array(14).join(" ") + `${formattedStart.slice(0,2)}` + ":" +
        `${formattedStart.slice(2)}` + " as " + 
        `${formattedEnd.slice(0, 2)}` + ":" +
        `${formattedEnd.slice(2)}`;
        console.log(schedulingData);
      }
    }
    console.log(Array(73).join("-"));
  }

  private displaySchedulings(schedulingList: any[]): void {
    const header = Array(61).join("-") +
    ("\nData" + Array(12).join(" ")).slice(0, 12) +
    ("H.Ini" + Array(6).join(" ")).slice(0, 6) +
    ("H.Fim" + Array(6).join(" ")).slice(0, 6) +
    ("Tempo" + Array(6).join(" ")).slice(0, 6) + 
    ("Nome" + Array(21).join(" ")).slice(0, 21) + 
    ("Dt.Nasc." + Array(10).join(" ")).slice(0, 10) + "\n" +
    Array(61).join("-");
    let lastRecordDate: string = "";
    let currentRecordDate: string = "";
    let start: string;
    let end: string;
    let name: string;
    let birthdate: string;
    let duration: string;
    let dateStr: string = " ";
    console.log(header);
    for(const scheduling of schedulingList) {
      currentRecordDate = DateTime.fromFormat(scheduling.dataConsulta,'yyyy-MM-dd').
      toFormat('dd/MM/yyyy');
      
      if(currentRecordDate === lastRecordDate) {
        dateStr = " ";
      } else {
        lastRecordDate = currentRecordDate;
        dateStr = lastRecordDate;
      }
      start = DateTime.fromFormat(scheduling.horarioInicio, 'HH:mm:ss').
      toFormat('HH:mm');
      end = DateTime.fromFormat(scheduling.horarioFim, 'HH:mm:ss').
      toFormat('HH:mm');
      name = scheduling.paciente.nome;
      birthdate = DateTime.fromFormat(scheduling.paciente.dataNascimento,'yyyy-MM-dd').
      toFormat('dd/MM/yyyy');

      duration = this.getDuration(start, end);
      duration = DateTime.fromFormat(duration,'H:m').toFormat('HH:mm');
      
      const consulta = (`${dateStr}` + Array(11).join(" ")).slice(0, 11) +
      (`${start}` + Array(6).join(" ")).slice(0, 6) + 
      (`${end}` + Array(6).join(" ")).slice(0, 6) + 
      (`${duration}` + Array(6).join(" ")).slice(0, 6) +
      (`${name}`.slice(0, 20) + Array(21).join(" ")).slice(0, 21) +
      (`${birthdate}` + Array(10).join(" ")).slice(0, 10);
      console.log(consulta);
    }
    console.log(Array(61).join("-"));
  }

  private getAge(patient: any) {
    let birthdate = DateTime.fromFormat(patient.dataNascimento,'yyyy-MM-dd');
    let age: number = birthdate.diffNow('years').years;
    return Math.trunc(Math.abs(age));
  }

  private getDuration(start: string, end: string): string{
    const startTime: DateTime = DateTime.fromFormat(start, 'HH:mm');
    const endTime: DateTime = DateTime.fromFormat(end, 'HH:mm');
    const diff_ms: number = endTime.diff(startTime).milliseconds

    const seconds: number = Math.floor(diff_ms/1000);
    let minutes: number = Math.floor(seconds/60);
    let hours: number = Math.floor(minutes/60);
    minutes = minutes % 60;

    return `${hours}:${minutes}`;
  }
    

  private setMessages() {
    this.messages.set(
      OperationErrors.CONNECTION_ERROR,
      "Falha na conexao com o banco de dados. A aplicacao sera encerrada."
    );

    this.messages.set(
      OperationErrors.CPF_FOUND,
      "CPF ja cadastrado."
    );

    this.messages.set(
      OperationErrors.INVALID_PATIENT_NAME,
      "Nome de formato invalido."
    );

    this.messages.set(
      OperationErrors.AGE_NOT_ACCEPTED,
      "Paciente deve ter idade minima de 13 anos."
    );

    this.messages.set(
      OperationErrors.INVALID_DATE_FORMAT,
      "Formato invalido para data. Deve estar no formato DD/MM/AAAA."
    );

    this.messages.set(
      OperationErrors.INVALID_CPF,
      "CPF invalido."
    );

    this.messages.set(
      OperationErrors.PATIENT_NOT_FOUND,
      "CPF nao cadastrado."
    );

    this.messages.set(
      OperationErrors.FUTURE_SCHEDULING_FOUND,
      "Agendamento futuro encontrado para esse CPF."
    )

    this.messages.set(
      OperationErrors.SCHEDULING_INTERSECTION,
      "Erro: ja existe uma consulta agendada nesse horario"
    );

    this.messages.set(
      OperationErrors.SCHEDULING_DATE_ON_PAST,
      "Agendamento em data invalida. Data informada deve ser posterior a data atual."
    );

    this.messages.set(
      OperationErrors.BIRTHDATE_ON_FUTURE,
      "Data de nascimento invalido. Data informada posterior a data de cadastro"
    );

    this.messages.set(
      OperationErrors.INVALID_SCHEDULING_TIME,
      "Horario de agendamento invalido. Horario deve ser multiplo de 15."
    );

    this.messages.set(
      OperationErrors.INVALID_SCHEDULING_START_TIME_FORMAT,
      "Horario inicial invalido. Formato deve ser hhmm"
    );

    this.messages.set(
      OperationErrors.INVALID_SCHEDULING_END_TIME_FORMAT,
      "Horario final invaalido. Formato deve ser hhmm"
    );

    this.messages.set(
      OperationErrors.SCHEDULING_NOT_FOUND,
      "Agendamento nao encontrado. Nenhuma consulta removida."
    );

    this.messages.set(
      OperationErrors.INVALID_DATE_INTERVAL,
      "Intervalo de tempo informado e invalido."
    );
  }

}

export {View};