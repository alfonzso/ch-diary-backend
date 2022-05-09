import Container from 'typedi';
import { Logger } from "winston";
import util from 'util';


export default (...msg: any) => {
  const logger: Logger = Container.get('logger');
  logger.silly(util.format(...msg))
}