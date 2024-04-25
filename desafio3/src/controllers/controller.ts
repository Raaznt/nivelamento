import { sequelize } from "../config/db";
import { OperationResult } from "../models/operationResult";
import { Patient } from "../models/patient";
import { Scheduling } from "../models/scheduling";
import { ValidationResult } from "../models/validation/ValidationResult";
import { PatientValidator } from "../models/validation/patientValidation";
import { SchedulingValidator } from "../models/validation/schedulingValidation";
import { PersistenceService, IPatient} from "../services/persistenceService";
import { View } from "../views/View";
import { OperationStatus } from "./status";

class Controller {
  private persistenceService: PersistenceService;
  private patient: Patient;
  private scheduling: Scheduling;
  private view: View;

  constructor(persistenceService: PersistenceService) {
    this.persistenceService = persistenceService;
    this.view = new View();
    this.patient = new Patient();
    this.scheduling = new Scheduling();
    this.patient.validator = new PatientValidator();
    this.scheduling.validator = new SchedulingValidator();
  }

  public async run(): Promise<void> {
    let operationResult: OperationResult;
    let validationStatus: ValidationResult;
    let userInput: any;
    let isRunning: boolean = true;
    let menuType: MenuType = MenuType.MAIN_MENU;
    let menuOptions: number;
    let connectionStatus: OperationResult = await PersistenceService.checkConnection();

    this.view.processPersistenceOperationStatus(connectionStatus);
    if(connectionStatus.status === OperationStatus.SUCCESS) {
      await sequelize.sync();
      while(isRunning) {

        if(menuType === MenuType.MAIN_MENU) {
          menuOptions = this.view.showMainMenu();
          if(menuOptions === MainMenuOptions.MAIN_TO_PATIENT_MENU) {
            menuType = MenuType.PATIENT_MENU
          } else if(menuOptions === MainMenuOptions.MAIN_TO_SCHEDULING_MENU) {
            menuType = MenuType.SCHEDULING_MENU
          } else if(menuOptions === MainMenuOptions.QUIT) {
            isRunning = false;
          }
        }

        if(menuType === MenuType.PATIENT_MENU) {
          menuOptions = this.view.showPatientRegisterMenu();
          if(menuOptions === PatientMenuOptions.ADD_PATIENT) {
            userInput = this.view.patient;
            this.patient.cpf = userInput.cpf;
            this.patient.name = userInput.name;
            this.patient.birthdate = userInput.birthdate;
            validationStatus = this.patient.isValid();
            this.view.processPatientValidation(validationStatus);
            if(validationStatus.status) {
              operationResult = await this.persistenceService.addPatient(this.patient);
              this.view.processPersistenceOperationStatus(operationResult);
            }
          } else if(menuOptions === PatientMenuOptions.DELETE_PATIENT) {
            userInput = this.view.cpf;
            operationResult = await this.persistenceService.removePatient(userInput.cpf);
            this.view.processPersistenceOperationStatus(operationResult);
          } else if(menuOptions === PatientMenuOptions.LIST_PATIENT_ORDER_BY_CPF) {
            operationResult = await this.persistenceService.getAllPatients();
            operationResult.result.allPatients.sort(
              (obj1: IPatient , obj2: IPatient) => obj1.cpf.localeCompare(obj2.cpf)
            );
            this.view.processPersistenceOperationStatus(operationResult);
          } else if(menuOptions === PatientMenuOptions.LIST_PATIENT_ORDER_BY_NAME) {
            operationResult = await this.persistenceService.getAllPatients();
            operationResult.result.allPatients.sort(
              (obj1: IPatient , obj2: IPatient) => obj1.nome.localeCompare(obj2.nome)
            );
            this.view.processPersistenceOperationStatus(operationResult);
          } else if(menuOptions === PatientMenuOptions.PATIENT_TO_MAIN_MENU) {
            menuType = MenuType.MAIN_MENU;
          }
        }

        if(menuType === MenuType.SCHEDULING_MENU) {
          menuOptions = this.view.showSchedulingMenu();
          if(menuOptions === SchedulingMenuOptions.ADD_SCHEDULING) {
            userInput = this.view.scheduling
            this.scheduling.cpf = userInput.cpf;
            this.scheduling.date = userInput.date;
            this.scheduling.startTime = userInput.startTime;
            this.scheduling.endTime = userInput.endTime;
            validationStatus = this.scheduling.isValid();
            this.view.processPatientValidation(validationStatus);
            if(validationStatus.status) {
              operationResult = await this.persistenceService.addScheduling(this.scheduling);
              this.view.processPersistenceOperationStatus(operationResult);
            }
          } else if(menuOptions === SchedulingMenuOptions.DELETE_SCHEDULING) {
            userInput = this.view.schedulingToRemove
            operationResult = await this.persistenceService.removeScheduling(
              userInput.cpf, userInput.date, userInput.startTime
            );
            this.view.processPersistenceOperationStatus(operationResult);
          } else if(menuOptions === SchedulingMenuOptions.LIST_SCHEDULING) {
            userInput = this.view.schedulingListOption;
            if(userInput.option.toUpperCase() === "P") {
              userInput = this.view.period;
              operationResult = await this.persistenceService.getSchedulingsByPeriod(
                userInput.startDate, userInput.endDate
              )
              this.view.processPersistenceOperationStatus(operationResult);
            }else if(userInput.option.toUpperCase() === "T") {
              operationResult = await this.persistenceService.getAllSchedulings();
              this.view.processPersistenceOperationStatus(operationResult);
            }
            
          } else if(menuOptions === SchedulingMenuOptions.SCHEDULING_TO_MAIN_MENU) {
            menuType = MenuType.MAIN_MENU;
          }
        }       
      }   
    }
    await sequelize.close();
  }
}

class MenuType {
  static get MAIN_MENU() : number {
    return 1;
  }

  static get PATIENT_MENU(): number {
    return 2;
  }

  static get SCHEDULING_MENU(): number {
    return 3;
  }
}

class MainMenuOptions {
  static get MAIN_TO_PATIENT_MENU(): number {
    return 1;
  }

  static get MAIN_TO_SCHEDULING_MENU(): number {
    return 2;
  }

  static get QUIT(): number {
    return 3;
  }
}

class PatientMenuOptions {
  static get ADD_PATIENT(): number {
    return 1;
  }

  static get DELETE_PATIENT(): number {
    return 2;
  }

  static get LIST_PATIENT_ORDER_BY_CPF(): number {
    return 3;
  }

  static get LIST_PATIENT_ORDER_BY_NAME(): number {
    return 4;
  }

  static get PATIENT_TO_MAIN_MENU(): number {
    return 5;
  }
}

class SchedulingMenuOptions {
  static get ADD_SCHEDULING(): number {
    return 1
  }

  static get DELETE_SCHEDULING(): number {
    return 2;
  }

  static get LIST_SCHEDULING(): number {
    return 3;
  }

  static get SCHEDULING_TO_MAIN_MENU(): number {
    return 4;
  }

  static get LIST_BY_PERIOD(): string {
    return "P";
  }

  static get LIST_ALL(): string {
    return "T"
  }

}

export {Controller};