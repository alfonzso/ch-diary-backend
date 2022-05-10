import { Container } from 'typedi';
import { userRepositoryInstance } from '../repositorys';
import { myUtilsInstance } from '../utils';
// import { Password, passwordInstance } from '../utils';
// import formData from 'form-data';
// import Mailgun from 'mailgun.js';
import loggerInstance from './logger';
// import agendaFactory from './agenda';
// import config from '@/config';

// export default ({ mongoConnection, models }: { mongoConnection; models: { name: string; model: any }[] }) => {
export default () => {
  try {
    // models.forEach(m => {
    //   Container.set(m.name, m.model);
    // });

    // const agendaInstance = agendaFactory({ mongoConnection });
    // const mgInstance = new Mailgun(formData);


    // Container.set('agendaInstance', agendaInstance);
    Container.set('logger', loggerInstance);
    Container.set('myUtils', myUtilsInstance);
    Container.set('userRepository', userRepositoryInstance);
    // Container.set('emailClient', mgInstance.client({ key: config.emails.apiKey, username: config.emails.apiUsername }));
    // Container.set('emailDomain', config.emails.domain);

    // LoggerInstance.info('✌️ Agenda injected into container');

    // return { agenda: agendaInstance };
  } catch (e) {
    loggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
function MyUtils(arg0: string, MyUtils: any) {
  throw new Error('Function not implemented.');
}

