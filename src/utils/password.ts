import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const asyncScrypt = promisify(scrypt);

export default class Password {

  async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await asyncScrypt(password, salt, 64)) as Buffer;
    return `${buf.toString('hex')}.${salt}`;
  }

  async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = (await asyncScrypt(suppliedPassword, salt, 64)) as Buffer;
    return buf.toString('hex') === hashedPassword;
  }
}
