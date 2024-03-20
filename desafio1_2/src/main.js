import { Controller } from "./controllers/Controller.js";
import { View } from "./views/View.js";
import { Agenda } from "./models/Agenda.js";


const model = new Agenda();
const view = new View();
const controller = new Controller(model, view);
controller.executar();