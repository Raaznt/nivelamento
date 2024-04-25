import {Model, DataTypes, Sequelize, ModelStatic} from 'sequelize';
import { sequelize } from '../../config/db';

class SchedulingModel extends Model {
  static initialize(sequelize: Sequelize) {
    super.init(
      {
        dataConsulta: {
          type: DataTypes.DATEONLY,
          allowNull: false
        },
        horarioInicio: {
          type: DataTypes.TIME,
          allowNull: false
        },
        horarioFim: {
          type: DataTypes.TIME,
          allowNull: false
        },
      },
      {
        sequelize,
        modelName: 'Consulta',
        freezeTableName: true
      }
    );
  }
}

export {SchedulingModel};