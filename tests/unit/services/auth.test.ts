import 'reflect-metadata'
import { AuthService } from "../../../src/services";
import { MyUtils, myUtilsInstance } from "../../../src/utils";
import { RefreshTokenRepository, UserRepository, userRepositoryInstance } from "../../../src/repositorys";
import LoggerInstance from '../../../src/loaders/logger';
import jwt from "jsonwebtoken";


describe('User', () => {
  describe('RefreshToken', () => {
    test('Should user refresh his/her accessToken', async () => {

      const mockedRefToken = {
        id: '2065db60-f4e0-431b-871c-ebb784a41f55',
        hashedToken: '8c56c3d42e8948855963f2bb45b8cc2390ad9793306d04056cf4f966671a8c6f20286c06210bade53b1278970f787d9ad3a0897822e0408b915c22ac7df94d13.d0fbd56d4d136281',
        userId: 'cf04943b-3816-4381-9219-a407ef085f9d',
        revoked: false,
        createdAt: '2022-05-10T13:50:02.976Z',
        updatedAt: '2022-05-10T13:50:02.977Z'
      }

      const mockedUser = {
        id: "cf04943b-3816-4381-9219-a407ef085f9d",
        email: "alfonzso@gmail.com",
        password: "dbc132aca638fc824cfbe117b7ba4b2c2b96fead8fb3da6b4546c6217ccc79c867a9fa23c6011616f9a5be0f296e439ae8c5f570fc253d792010f9d324fe1dfb.a6058deadb4fe660",
        createdAt: '2022-05-10T13:50:02.976Z',
        updatedAt: '2022-05-10T13:50:02.977Z'
      }

      const refreshTokenRepositoryMock = jest
        .spyOn(RefreshTokenRepository.prototype, 'findRefreshTokenById')
        .mockImplementation((id: string): any => {
          let refToken = {}
          if (id = '2065db60-f4e0-431b-871c-ebb784a41f55') {
            refToken = mockedRefToken
          }
          return refToken
        });


      const jwtCompareMock = jest
        .spyOn(myUtilsInstance.password, 'compare')
        .mockImplementation((): any => {
          return true
        });

      const jwtVerifyMock = jest
        .spyOn(jwt, 'verify')
        .mockImplementation((): any => {
          return {
            userId: "cf04943b-3816-4381-9219-a407ef085f9d",
            jti: '2065db60-f4e0-431b-871c-ebb784a41f55'
          }
        });

      const userRepoFindUserByIdMock = jest
        .spyOn(userRepositoryInstance, 'findUserById')
        .mockImplementation((id: string): any => {
          let user = {}
          if (id == "cf04943b-3816-4381-9219-a407ef085f9d") {
            user = mockedUser
          }
          return user
        });

      const userService = new AuthService(LoggerInstance, new MyUtils(), new UserRepository(), new RefreshTokenRepository());
      const userRecord = await userService.RefreshToken("faf");

      expect(refreshTokenRepositoryMock).toHaveBeenCalledTimes(1);
      expect(refreshTokenRepositoryMock).toReturnWith(mockedRefToken)

      expect(userRepoFindUserByIdMock).toHaveBeenCalledTimes(1);
      expect(userRepoFindUserByIdMock).toReturnWith(mockedUser)

      expect(jwtVerifyMock).toHaveBeenCalledTimes(1);
      expect(jwtVerifyMock).toReturnWith({
        userId: "cf04943b-3816-4381-9219-a407ef085f9d",
        jti: '2065db60-f4e0-431b-871c-ebb784a41f55'
      })

      expect(userRecord.length).not.toEqual(0)

    });
  })
})