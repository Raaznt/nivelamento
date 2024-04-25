import { Scheduling } from "./models/scheduling";
import { PatientValidator } from "./models/validation/patientValidation";
import { SchedulingValidator } from "./models/validation/schedulingValidation";
import { Patient } from "./models/patient";
import { sequelize } from "./config/db";
import { PersistenceService } from "./services/persistenceService";
import { DateTime } from "luxon";
import { Controller } from "./controllers/controller";

(() => {
  let persistenceService: PersistenceService = new PersistenceService();
  let controller: Controller = new Controller(persistenceService);
  controller.run();
})()