import 'reflect-metadata'
import { AuthService } from "../../../src/services";
import { Utils, utilsInstance } from "../../../src/utils";
import { RefreshTokenRepository, UserRepository } from "../../../src/repositorys";
import LoggerInstance from '../../../src/loaders/logger';
import jwt from "jsonwebtoken";
import Container from 'typedi';
import dependencyInjectorLoader from '../../../src/loaders/dependencyInjector';

describe('User', () => {
  describe('RefreshToken', () => {
    test('Should user refresh his/her accessToken', async () => {

      dependencyInjectorLoader()
      const refTok = Container.get(RefreshTokenRepository)
      const userRep = Container.get(UserRepository)

      const mockedRefToken = {
        id: '2065db60-f4e0-431b-871c-ebb784a41f55',
        hashedToken: '8c56c3d42e8948855963f2bb45b8cc2390ad9793306d04056cf4f966671a8c6f20286c06210bade53b1278970f787d9ad3a0897822e0408b915c22ac7df94d13.d0fbd56d4d136281',
        userId: '1bbd258b-4599-4406-bbc3-9a2ad569fbae',
        revoked: false,
        createdAt: '2022-05-10T13:50:02.976Z',
        updatedAt: '2022-05-10T13:50:02.977Z'
      }

      const mockedUser = {
        id: "1bbd258b-4599-4406-bbc3-9a2ad569fbae",
        email: "alfonzso@gmail.com",
        password: "dbc132aca638fc824cfbe117b7ba4b2c2b96fead8fb3da6b4546c6217ccc79c867a9fa23c6011616f9a5be0f296e439ae8c5f570fc253d792010f9d324fe1dfb.a6058deadb4fe660",
        createdAt: '2022-05-10T13:50:02.976Z',
        updatedAt: '2022-05-10T13:50:02.977Z'
      }

      const refreshTokenRepositoryMock = jest
        .spyOn(refTok, 'findRefreshTokenById')
        .mockImplementation((id: string): any => {
          let refToken = {}
          if (id = '2065db60-f4e0-431b-871c-ebb784a41f55') {
            refToken = mockedRefToken
          }
          return refToken
        });


      const jwtCompareMock = jest
        .spyOn(utilsInstance.passwordManager, 'compare')
        .mockImplementation((): any => {
          return true
        });

      const jwtVerifyMock = jest
        .spyOn(jwt, 'verify')
        .mockImplementation((): any => {
          return {
            userId: "1bbd258b-4599-4406-bbc3-9a2ad569fbae",
            jti: '2065db60-f4e0-431b-871c-ebb784a41f55'
          }
        });

      const userRepoFindUserByIdMock = jest
        .spyOn(userRep, 'findUserById')
        .mockImplementation((id: string): any => {
          let user = {}
          if (id == "1bbd258b-4599-4406-bbc3-9a2ad569fbae") {
            user = mockedUser
          }
          return user
        });

      const userService = new AuthService(LoggerInstance, new Utils(), userRep, refTok);
      const userRecord = await userService.RenewAccessFromRefresh("faf");

      expect(refreshTokenRepositoryMock).toHaveBeenCalledTimes(1);
      expect(refreshTokenRepositoryMock).toReturnWith(mockedRefToken)

      expect(userRepoFindUserByIdMock).toHaveBeenCalledTimes(1);
      expect(userRepoFindUserByIdMock).toReturnWith(mockedUser)

      expect(jwtVerifyMock).toHaveBeenCalledTimes(1);
      expect(jwtVerifyMock).toReturnWith({
        userId: "1bbd258b-4599-4406-bbc3-9a2ad569fbae",
        jti: '2065db60-f4e0-431b-871c-ebb784a41f55'
      })

      expect(userRecord.length).not.toEqual(0)

    });
  })
})