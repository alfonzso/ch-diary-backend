import { User } from "@prisma/client";
import { myUtilsInstance } from "../utils";
// import { db, passwordInstance } from "../utils";


const db = myUtilsInstance.prismaClient
const jwtInstance = myUtilsInstance.myJWT
const passwordInstance = myUtilsInstance.password


class UserRepository {

  findUserByEmail(email: string) {
    return db.user.findUnique({
      where: {
        email,
      },
    });
  }

  async createUserByEmailAndPassword(user: User) {
    user.password = await passwordInstance.toHash(user.password);

    return db.user.create({
      data: user,
    });
  }

  findUserById(id: string) {
    return db.user.findUnique({
      where: {
        id,
      },
    });
  }

}
const userRepositoryInstance = new UserRepository()
// export default userRepositoryInstance
export {
  UserRepository,
  userRepositoryInstance
};