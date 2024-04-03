import { DateTime } from "luxon";
import fs from 'node:fs';

class WriteFileController {
  write(data, filePath) {
    fs.writeFileSync(filePath, data, {encoding : 'utf-8'});
  }
  
  getFilePath(inputFilePath) {
    const fileNameRegex = new RegExp(/[^\/\\]+$/);
    const fileName = inputFilePath.match(fileNameRegex);
    const formatedDate = DateTime.now().toFormat('ddMMyyyy-HHmmss');
    let outputFilePath = inputFilePath.replace(fileName, '');
    outputFilePath = outputFilePath + "erros-" + formatedDate + ".json";
    return outputFilePath;
  }
}

export {WriteFileController};