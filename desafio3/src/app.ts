import { PersistenceService } from "./services/persistenceService";
import { Controller } from "./controllers/controller";

(() => {
  let persistenceService: PersistenceService = new PersistenceService();
  let controller: Controller = new Controller(persistenceService);
  controller.run();
})()