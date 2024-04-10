import { Presenter } from './presenter/Presenter';
import { RequestController } from './controller/RequestController';
import { ConversionController } from './controller/ConversionController';

(function () {
  const requestController = new RequestController(
    'https://v6.exchangerate-api.com/v6/70c41bd3978acb22926873f6/latest/USD'
  );
  const conversionController = new ConversionController();

  const presenter = new Presenter(requestController, conversionController);
  presenter.run();
})()