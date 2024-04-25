import { Model, DataTypes, Sequelize } from "sequelize";

class PatientModel extends Model {
  static initialize(sequelize: Sequelize) {
    super.init(
      {
        nome: {
          type: DataTypes.STRING,
          allowNull: false
        },
        cpf: {
          type: DataTypes.STRING(11),
          allowNull: false,
          primaryKey: true
        },
        dataNascimento: {
          type: DataTypes.DATEONLY, 
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: 'Paciente',
        freezeTableName: true
      }
    );
  }
}

export {PatientModel};