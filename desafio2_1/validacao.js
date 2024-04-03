import { Presenter } from "./presenter/Presenter.js";
import {ReadFileController} from "./controller/ReadFileController.js";
import { WriteFileController } from "./controller/WriteFileController.js";

(function () {
  const readController = new ReadFileController();
  const writeController = new WriteFileController();
  const presenter = new Presenter(readController, writeController);
  presenter.run();
})();