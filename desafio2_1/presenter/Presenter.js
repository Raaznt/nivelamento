import { ReadFileView } from "../view/ReadFileView.js";
import { OperationStatus } from "../controller/status.js";

class Presenter {
  #view;
  #readerController;
  #writerController;
  
  constructor(readerController, writerController) {
    this.#view = new ReadFileView();
    this.#readerController = readerController;
    this.#writerController = writerController;
  }

  run() {
    
    //Obtem caminho do arquivo passado como argumento no CLI
    const inputFilePath = this.#view.filePath;
    
    //Realiza a leitura do arquivo informado
    const result = this.#readerController.read(inputFilePath);
    
    if(result.status !== OperationStatus.SUCCESS) {
      this.#view.process(result.status, result.errors);
    } else {
      let outputFilePath = this.#writerController.getFilePath(inputFilePath);
      this.#view.process(result.status);

      //Substitui o codigo de erro pelas mensagens definidas na view
      this.#view.parseErrorMessages(result.result);
      
      this.#writerController.write(JSON.stringify(result.result), outputFilePath);
    }
  }
}

export {Presenter};