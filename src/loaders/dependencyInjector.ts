import { Container } from 'typedi';
import { Password } from '../utils';
// import formData from 'form-data';
// import Mailgun from 'mailgun.js';
import LoggerInstance from './logger';
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
    Container.set('logger', LoggerInstance);
    Container.set('passwordManager', new Password());
    // Container.set('emailClient', mgInstance.client({ key: config.emails.apiKey, username: config.emails.apiUsername }));
    // Container.set('emailDomain', config.emails.domain);

    // LoggerInstance.info('✌️ Agenda injected into container');

    // return { agenda: agendaInstance };
  } catch (e) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};