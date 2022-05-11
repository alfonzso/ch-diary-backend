import 'reflect-metadata'
import winston, { Logger } from "winston";
import { AuthService } from "../../../src/services";
import { MyUtils, myUtilsInstance } from "../../../src/utils";
import { RefreshTokenRepository, UserRepository, userRepositoryInstance } from "../../../src/repositorys";
import LoggerInstance from '../../../src/loaders/logger';
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";


describe('User', () => {
  describe('RefreshToken', () => {
    test('Should user refresh his/her accessToken', async () => {
      // const eventEmitterService = {
      //   emit: jest.fn(),
      // };
      // const logger = {
      //   debug: jest.fn(),
      //   log: jest.fn(),
      //   silly: jest.fn()
      // } as  Logger ;
      // const MockedVoiceChannel = Logger as jest.Mock<Logger>;
      // let logger = new jest.Mock<Logger>()
      // let logger = jest.mock('winston') as Logger ;
      // jest.mock('winston', () => {
      //   const mLogger = {
      //     error: jest.fn(),
      //   };
      //   // return {
      //   //   LOG_LEVEL: require.requireActual('./Book-logger.ts').default.LOG_LEVEL,
      //   //   getLogger: jest.fn(() => mLogger),
      //   // };
      // });
      // let loggerMock: Logger;
      // const mockCreateLogger = jest.spyOn(winston, 'createLogger');
      // let loggerMock = mockCreateLogger.mock.instances[0];

      // jest.mock("../../../src/utils")
      // jest.mock("../../../src/repositorys")

      // const fafafa = jest.spyOn(RefreshTokenRepository, 'findRefreshTokenById');
      // // const fafafa = jest.spyOn(refreshTokenInstance, 'findRefreshTokenById');
      // let fefefe = fafafa.mock.instances[0];

      // const mockPlaySoundFile = jest.fn();
      // jest.mock('../../../src/repositorys/refreshToken', () => {
      //   return jest.fn().mockImplementation(() => {
      //     // return { findRefreshTokenById: mockPlaySoundFile };
      //     return { findRefreshTokenById: (id: string) => { return "fefe" } };
      //   });
      // });


      const refreshTokenRepositoryMock = jest
        .spyOn(RefreshTokenRepository.prototype, 'findRefreshTokenById')
        .mockImplementation((id: string): any => {
          console.log('mocked function');
          return {
            id: '2065db60-f4e0-431b-871c-ebb784a41f55',
            hashedToken: '8c56c3d42e8948855963f2bb45b8cc2390ad9793306d04056cf4f966671a8c6f20286c06210bade53b1278970f787d9ad3a0897822e0408b915c22ac7df94d13.d0fbd56d4d136281',
            userId: 'cf04943b-3816-4381-9219-a407ef085f9d',
            revoked: false,
            createdAt: '2022-05-10T13:50:02.976Z',
            updatedAt: '2022-05-10T13:50:02.977Z'
          }
        });

      // const playSoundFileMock = jest
      //   .spyOn(MyUtils.prototype, 'password')
      //   .mockImplementation((id: string): any => {
      //     console.log('mocked function');
      //   });

      const fafMock = jest
        .spyOn(myUtilsInstance.password, 'compare')
        .mockImplementation((): any => {
          console.log('mocked FEF function');
          return true
        });

      const fff = jest
        .spyOn(jwt, 'verify')
        .mockImplementation((): any => {
          console.log('mocked FEF function');
          return true
        });

      // comment this line if just want to "spy"

      const fef = jest
        .spyOn(userRepositoryInstance, 'findUserById')
        .mockImplementation((id: string): any => {
          console.log('mocked rerer function');
          return {
            id: "cf04943b-3816-4381-9219-a407ef085f9d",
            email: "alfonzso@gmail.com",
            password: "dbc132aca638fc824cfbe117b7ba4b2c2b96fead8fb3da6b4546c6217ccc79c867a9fa23c6011616f9a5be0f296e439ae8c5f570fc253d792010f9d324fe1dfb.a6058deadb4fe660",
            createdAt: '2022-05-10T13:50:02.976Z',
            updatedAt: '2022-05-10T13:50:02.977Z'
          }
        });




      // const mockCreateLogger = jest.spyOn(MyUtils) as jest.Mock<Logger>;
      // loggerMock = mockCreateLogger.mock.instances[0];

      // const myUtils: MyUtils = {
      // prismaClient: undefined,
      // password: new Password,
      // myJWT: new MyJWT,
      // sendRefreshToken: function (res: Response<any, Record<string, any>>, token: string): void {
      //   throw new Error("Function not implemented.");
      // },
      // logger: function (...msg: any): void {
      //   throw new Error("Function not implemented.");
      // }
      // };
      // const userRepository = {
      //   debug: jest.fn(),
      //   log: jest.fn(),
      //   silly: jest.fn()
      // };
      // const refreshToken = {
      //   debug: jest.fn(),
      //   log: jest.fn(),
      //   silly: jest.fn()
      // };
      // const logger: Logger = Container.get('logger');

      const userService = new AuthService(LoggerInstance, new MyUtils(), new UserRepository(), new RefreshTokenRepository());
      // const userService = new AuthService(loggerMock, new MyUtils(), new UserRepository(), fefefe);
      const userRecord = await userService.RefreshToken("faf");
      console.log(
        userRecord
      )

      // expect(userRecord).toBeDefined();
      // expect(userRecord._id).toBeDefined();
      // expect(eventEmitterService.emit).toBeCalled();
    });
  })
})