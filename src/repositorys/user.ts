import { User } from "@prisma/client";
import db from "../utils/db";
import { Password } from "../utils/password";

function findUserByEmail(email: string) {
  return db.user.findUnique({
    where: {
      email,
    },
  });
}

async function createUserByEmailAndPassword(user: User) {
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