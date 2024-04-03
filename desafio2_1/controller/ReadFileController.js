import fs from 'node:fs';
import { Cliente } from '../model/cliente.js';
import { OperationStatus, OperationErrors } from './status.js';


class ReadFileController {

  read(filePath) {
    let contentIsArray = false;
    const failure_cases = [];
    const fileExists = fs.existsSync(filePath);

    if(fileExists){
      const data = fs.readFileSync(filePath, {encoding : "utf-8", flag : "r"});
      
      //Verifica se o conteudo do arquivo e um array
      contentIsArray = this.#contentIsValid(data);
      
      if(contentIsArray) {
        const arr = JSON.parse(data);
        for(const obj of arr) {
          const result = Cliente.create(
            obj.nome,
            obj.cpf,
            obj.dt_nascimento,
            obj.renda_mensal,
            obj.estado_civil
          );

          if(result.failure) {
            failure_cases.push({dados : obj, mensagens : result.failure});
          }
        }
      }
    }
    return fileExists ? 
      (contentIsArray ?
        {
          status : OperationStatus.SUCCESS,
          result : failure_cases
        } :
        {
          status : OperationStatus.FAIL,
          errors : [OperationErrors.INVALID_CONTENT]
        }
      ) :
      {
        status : OperationStatus.FAIL,
        errors : [OperationErrors.FILE_NOT_FOUND]
      };
  }

  #contentIsValid(content) {
    const regexArray = new RegExp(/^\[[^\]]*\]$/);
    return regexArray.test(content);
  }
}

export {ReadFileController};