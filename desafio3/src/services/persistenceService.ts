import { sequelize } from "../config/db";
import { Patient } from "../models/patient";
import { PatientModel } from "../models/persistence/patientModel";
import { SchedulingModel } from "../models/persistence/schedulingModel";
import { DateTime } from "luxon";
import { Scheduling } from "../models/scheduling";
import { Op } from "sequelize";
import { CustomError, OperationResult } from "../models/operationResult";
import { OperationErrors, OperationStatus } from "../controllers/status";

interface IPatient {
  cpf: string;
  nome: string;
  dataNascimento: string;
}

interface IScheduling {
  pacienteCPF: string,
  dataConsulta: string,
  horarioInicio: string,
  horarioFim: string
}

interface ISchedulingPatient {
  paciente: {nome: string, dataNascimento: string},
  dataConsulta: string,
  horarioInicio: string,
  horarioFim: string
}

class PersistenceService {
 constructor() {
    PatientModel.initialize(sequelize);
    SchedulingModel.initialize(sequelize);
    SchedulingModel.belongsTo(
      PatientModel, 
      {
        constraints: true,
        foreignKey: 'pacienteCPF',
        as: 'paciente'
      }
    );
  }

  async addPatient(patient: Patient): Promise<OperationResult> {
    let errorMessages: CustomError[] = [];
    let patientRetrieved: any = await PatientModel.findByPk(patient.cpf);
    
    //Se paciente nao existir realiza a insercao de novo registro
    if(!!!patientRetrieved) {
      await PatientModel.create({
        nome: patient.name,
        cpf: patient.cpf,
        dataNascimento: DateTime.fromFormat(patient.birthdate,'dd/MM/yyyy').toISODate()
      });
    } else {
      errorMessages.push({errorCode: OperationErrors.CPF_FOUND});
    }

    return errorMessages.length === 0 ?
      {
        status: OperationStatus.SUCCESS
      }:
      {
        status: OperationStatus.FAIL,
        errors: errorMessages
      }
  }

  async idPatientExists(cpf: string): Promise<boolean> {
    let patientRetrieved: any = await PatientModel.findByPk(cpf);
    return !!patientRetrieved;
  }

  async removePatient(cpf: string): Promise<OperationResult> {
    let errorMessages: CustomError[] = [];
    let patientRetrieved: any = await PatientModel.findByPk(cpf);

    //Se paciente existir
    if(!!patientRetrieved) {
      //Verifica se ha agendamento futuro
      let futureSchedulingRetrieved = await SchedulingModel.findOne({
        where: {
          [Op.or]: [
            {
              dataConsulta: {
                [Op.gt]: DateTime.now().toISODate()
              }
            },
            {
              [Op.and] : [
                {
                  dataConsulta : {
                    [Op.eq]: DateTime.now().toISODate()
                  },
                  horarioInicio : {
                    [Op.gte]: DateTime.now().toISOTime()
                  },
                  horarioFim : {
                    [Op.gte]: DateTime.now().toISOTime()
                  }
                }
              ]
            },
          ],
          pacienteCPF: cpf
        }
      });

      //Se nao houver agendamentos futuros
      if(!!!futureSchedulingRetrieved) {
        //Remove agendamentos associados ao cpf
        await SchedulingModel.destroy({
          where : {
            pacienteCPF: cpf
          }
        });
        //Remove paciente
        await PatientModel.destroy({
          where: {
            cpf: cpf
          }
        });
      } else {
        errorMessages.push({errorCode: OperationErrors.FUTURE_SCHEDULING_FOUND});
      }
    } else {
      errorMessages.push({errorCode: OperationErrors.PATIENT_NOT_FOUND});
    }
    return errorMessages.length === 0 ? 
      {
        status: OperationStatus.SUCCESS
      } :
      {
        status: OperationStatus.FAIL,
        errors: errorMessages
      };
  }

  async addScheduling(scheduling: Scheduling): Promise<OperationResult> {
    let errorMessages: CustomError[] = [];
    
    let patientRetrieved: any = await PatientModel.findByPk(scheduling.cpf);

    if(!!patientRetrieved) {
      let futureSchedulingRetrieved = await SchedulingModel.findOne({
        where: {
          [Op.or]: [
            {
              dataConsulta: {
                [Op.gt]: DateTime.now().toISODate()
              }
            },
            {
              [Op.and] : [
                {
                  dataConsulta : {
                    [Op.eq]: DateTime.now().toISODate()
                  },
                  horarioInicio : {
                    [Op.gte]: DateTime.now().toISOTime()
                  },
                  horarioFim : {
                    [Op.gte]: DateTime.now().toISOTime()
                  }
                }
              ]
            },
          ],
          pacienteCPF: scheduling.cpf
        }
      });
      if(!!!futureSchedulingRetrieved) {
        let hasIntersection = await this.checkSchedulingSobreposition(scheduling);
        if(!hasIntersection) {
          await SchedulingModel.create({
            dataConsulta: DateTime.fromFormat(scheduling.date,'dd/MM/yyyy').toISODate(),
            horarioInicio: DateTime.fromFormat(scheduling.startTime,'HHmm').toISOTime(),
            horarioFim: DateTime.fromFormat(scheduling.endTime,'HHmm').toISOTime(),
            pacienteCPF: scheduling.cpf
          });
        } else {
          errorMessages.push({errorCode: OperationErrors.SCHEDULING_INTERSECTION});
        }
      } else {
        errorMessages.push({errorCode: OperationErrors.FUTURE_SCHEDULING_FOUND});
      }
      
    } else {
      errorMessages.push({errorCode: OperationErrors.PATIENT_NOT_FOUND});
    }

    return errorMessages.length === 0 ? 
      {
        status: OperationStatus.SUCCESS
      } :
      {
        status: OperationStatus.FAIL,
        errors: errorMessages
      };
  }

  async removeScheduling(cpf: string, date: string, startTime: string): Promise<OperationResult> {
    let errorMessages: CustomError[] = [];

    let recordsRemoved: number = 0;
    let retrievePatient = await PatientModel.findByPk(cpf);

    if(!!retrievePatient) {
      recordsRemoved = await SchedulingModel.destroy({
        where : {
          pacienteCPF: cpf,
          dataConsulta: DateTime.fromFormat(date,'dd/MM/yyyy').toISODate(),
          horarioInicio: DateTime.fromFormat(startTime,'HHmm').toISOTime()
        }
      });
    } else {
      errorMessages.push({errorCode: OperationErrors.PATIENT_NOT_FOUND});
    }

    if(recordsRemoved === 0) {
      errorMessages.push({errorCode: OperationErrors.SCHEDULING_NOT_FOUND});
    }

    return errorMessages.length === 0 ? 
      {
        status: OperationStatus.SUCCESS
      }:
      {
        status: OperationStatus.FAIL,
        errors: errorMessages
      };
  }

  async checkSchedulingSobreposition(scheduling: Scheduling): Promise<boolean> {
    let result: boolean = false;
    let startTime = DateTime.fromFormat(scheduling.startTime,'HHmm').toISOTime();
    let endTime = DateTime.fromFormat(scheduling.endTime,'HHmm').toISOTime();
    let date = DateTime.fromFormat(scheduling.date,'dd/MM/yyyy').toISODate();

    let schedulingRetrieved = await SchedulingModel.findOne({
      where: {
        dataConsulta: date,
        [Op.or]: [
          {
            [Op.and]: [
              {
                horarioInicio: {
                  [Op.lte]: startTime
                },
                horarioFim: {
                  [Op.gte]: startTime
                }
              }
            ]
          },
          {
            [Op.and]: [
              {
                horarioInicio: {
                  [Op.lte]: endTime
                },
                horarioFim: {
                  [Op.gte]: endTime
                }
              }
            ]
          }
        ]
      }
    });

    if(!!schedulingRetrieved) {
      result = true;
    }

    return result;
  }

  async getAllPatients(): Promise<OperationResult> {
    let result: OperationResult;

    let queryResults: any = await PatientModel.findAll({
      attributes: ['nome', 'cpf', 'dataNascimento']
    });

    let futureSchedulings: IScheduling[] = await this.getFutureSchedulings();
    let allPatients: IPatient[] = JSON.parse(JSON.stringify(queryResults));

    result = {
      status: OperationStatus.SUCCESS,
      result: {futureSchedulings, allPatients}
    };
    
    return result;
  }

  async getFutureSchedulings(): Promise<IScheduling[]> {
    let result: IScheduling[];

    let queryResults: any = await SchedulingModel.findAll({
      attributes: ['pacienteCPF', 'dataConsulta', 'horarioInicio', 'horarioFim'],
      where: {
        [Op.or]: [
          {
            dataConsulta: {
              [Op.gt]: DateTime.now().toISODate()
            }
          },
          {
            [Op.and] : [
              {
                dataConsulta : {
                  [Op.eq]: DateTime.now().toISODate()
                },
                horarioInicio : {
                  [Op.gte]: DateTime.now().toISOTime()
                },
                horarioFim : {
                  [Op.gte]: DateTime.now().toISOTime()
                }
              }
            ]
          },
        ]
      }
    });

    result = JSON.parse(JSON.stringify(queryResults));

    return result;
  }

  async getAllSchedulings(): Promise<OperationResult> {
    let allSchedulings: ISchedulingPatient[];

    let queryResults: any = await SchedulingModel.findAll({
      include: [{model: PatientModel, as: 'paciente', attributes:['nome', 'dataNascimento']}],
      attributes: ['dataConsulta', 'horarioInicio', 'horarioFim']
    });

    allSchedulings = JSON.parse(JSON.stringify(queryResults));
    
    return {
      status: OperationStatus.SUCCESS,
      result: {allSchedulings}
    }
  }

  async getSchedulingsByPeriod(startDate: string, endDate: string): Promise<OperationResult> {
    let errorMessages: CustomError[] = [];
    let schedulingsByPeriod: ISchedulingPatient[] = [];

    let start: DateTime = DateTime.fromFormat(startDate, 'dd/MM/yyyy');
    let end: DateTime = DateTime.fromFormat(endDate, 'dd/MM/yyyy');
    
    if(start.isValid && end.isValid) {
      if(start < end) {
        let queryResults = await SchedulingModel.findAll({
          include: [{model: PatientModel, as: 'paciente', attributes: ['nome', 'dataNascimento']}],
          attributes: ['pacienteCPF', 'dataConsulta', 'horarioInicio', 'horarioFim'],
          where: {
            [Op.and]: [
              {
                dataConsulta: {
                  [Op.gte]: start.toISODate()
                }
              },
              {
                dataConsulta: {
                  [Op.lte]: end.toISODate()
                }
              }
            ]
          }
        });
        schedulingsByPeriod = JSON.parse(JSON.stringify(queryResults));
      } else {
        errorMessages.push({errorCode: OperationErrors.INVALID_DATE_INTERVAL});
      }
    } else {
      errorMessages.push({errorCode: OperationErrors.INVALID_DATE_FORMAT});
    }

    return errorMessages.length === 0 ? 
    {
      status: OperationStatus.SUCCESS,
      result: {schedulingsByPeriod}
    } :
    {
      status: OperationStatus.FAIL,
      errors: errorMessages
    };
  }

  static async checkConnection() : Promise<OperationResult> {
    let errors: CustomError[] = [];
    try {
      await sequelize.authenticate();
    } catch(error) {
      errors.push({errorCode: OperationErrors.CONNECTION_ERROR});
    }

    let res: OperationResult = errors.length === 0 ? 
    {
      status: OperationStatus.SUCCESS
    } :
    {
      status: OperationStatus.FAIL,
      errors: errors
    };

    return res;
  }
      
}

export {PersistenceService, IPatient, IScheduling};