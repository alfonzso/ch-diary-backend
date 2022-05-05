import db from "../utils/db";
import { Password } from "../utils/password";

type User = {
  // id: string;
  email: string;
  password: string;
};


function findUserByEmail(email: string) {
  return db.user.findUnique({
    where: {
      email,
    },
  });
}

async function createUserByEmailAndPassword(user: User) {
  // user.password = bcrypt.hashSync(user.password, 12);
  user.password = await Password.toHash(user.password);

  return db.user.create({
    data: user,
  });
}

function findUserById(id: string) {
  return db.user.findUnique({
    where: {
      id,
    },
  });
}

export {
  findUserByEmail,
  findUserById,
  createUserByEmailAndPassword
};