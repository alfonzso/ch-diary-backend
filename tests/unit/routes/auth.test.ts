// describe('User', () => {
//   describe('RefreshToken', () => {
//     test('/api/auth/refreshToken', async () => {

//     })
//   })
// })

import 'reflect-metadata';

// import app from '../../src/app';
import { app, appServer } from '../../../src';
import request from 'supertest';
import { myUtilsInstance, uuidv4 } from '../../../src/utils';
import { User } from "@prisma/client";
import { userRepositoryInstance } from '../../../src/repositorys';

let server: any

type data = {
  accessToken: string,
  refreshToken: string
}

describe('APP', () => {

  let token: data

  beforeAll(async () => {
    let response = await request(app)
      .post('/api/auth/register')
      .send({ email: 'foo@bar.com', password: "barbar" })
    token = response.body.data
    expect(token.accessToken.length).not.toEqual(0)
    expect(token.refreshToken.length).not.toEqual(0)
  });

  afterAll(async () => {
    console.log(
      "trying to remove foobar user ",
    )
    let res = await userRepositoryInstance.deleteUserByEmail('foo@bar.com')
    expect(res.email).toEqual('foo@bar.com');
    appServer.close()
  });

  // afterAll(() => {
  //   return clearCityDatabase();
  // });

  // beforeEach(() => {
  // })

  // afterEach(() => {
  //   // appServer.close()
  // })


  // const refreshToken = "refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjZjA0OTQzYi0zODE2LTQzODEtOTIxOS1hNDA3ZWYwODVmOWQiLCJqdGkiOiIyMDY1ZGI2MC1mNGUwLTQzMWItODcxYy1lYmI3ODRhNDFmNTUiLCJpYXQiOjE2NTIxOTA2MDIsImV4cCI6MTY1MjIxOTQwMn0.OkST_oU20nu-_Wmd1e9f3T3ApBE-pCklZwQSy-5RgfY"


  // describe('GET /products', () => {
  //   it('returns array of products', async () => {
  //     await request(app)
  //       .post('/api/auth/register')
  //       .send({ email: 'foo@bar.com', password: "barbar" })
  //   })
  // })

  // describe('GET /products', () => {
  //   it('returns array of products', async () => {
  //     await request(app)
  //       .post('/api/auth/register')
  //       .send({ email: 'foo@bar.com', password: "barbar" })
  //   })
  // })

  // test('GET /api/auth/register', async () => {

  //     const jti = uuidv4();
  //     // const user: any = {
  //     const user = {
  //       id: "sasa-fafa",
  //       email: 'alfonzso@gmail.com',
  //       password: "fafa",
  //     } as User
  //     // const { accessToken, refreshToken } = myUtilsInstance.myJWT.generateTokens({ email: 'alfonzso@gmail.com', password: "fafa" }  , jti);
  //     // const { accessToken, refreshToken } = myUtilsInstance.myJWT.generateTokens(user, jti);
  //     // console.log("........................",refreshToken)

  //     const result = await request(app)
  //       .post('/api/auth/register')
  //       .send({ email: 'foo@bar.com', password: "barbar" })

  //     // .set('Cookie', [refreshToken])
  //     // .set('Cookie', [`refresh_token=${refreshToken}`])
  //     token = result.body;
  //     console.log(token)
  //     // console.log(result)
  //     // expect(message).toEqual('helloWorld');
  //     // expect(result.statusCode).toEqual(200);
  // });

  // describe('GET /api/auth/register', () => {
  //   it('/register API Request', async () => {

  //     const jti = uuidv4();
  //     // const user: any = {
  //     const user = {
  //       id: "sasa-fafa",
  //       email: 'alfonzso@gmail.com',
  //       password: "fafa",
  //     } as User
  //     // const { accessToken, refreshToken } = myUtilsInstance.myJWT.generateTokens({ email: 'alfonzso@gmail.com', password: "fafa" }  , jti);
  //     // const { accessToken, refreshToken } = myUtilsInstance.myJWT.generateTokens(user, jti);
  //     // console.log("........................",refreshToken)

  //     const result = await request(app)
  //       .post('/api/auth/register')
  //       .send({ email: 'foo@bar.com', password: "barbar" })
  //     // .set('Cookie', [refreshToken])
  //     // .set('Cookie', [`refresh_token=${refreshToken}`])
  //     token = result.body;
  //     console.log(token)
  //     // console.log(result)
  //     // expect(message).toEqual('helloWorld');
  //     // expect(result.statusCode).toEqual(200);
  //   });
  // });

  describe('GET /api/auth/refreshToken', () => {
    it('refreshToken API Request', async () => {

      // const jti = uuidv4();
      // const user: any = {
      // const user = {
      //   id: "sasa-fafa",
      //   email: 'alfonzso@gmail.com',
      //   password: "fafa",
      // } as User
      // const { accessToken, refreshToken } = myUtilsInstance.myJWT.generateTokens({ email: 'alfonzso@gmail.com', password: "fafa" }  , jti);
      // const { accessToken, refreshToken } = myUtilsInstance.myJWT.generateTokens(user, jti);
      // console.log("........................", refreshToken)

      const result = await request(app)
        .get('/api/auth/refreshToken')
        // .set('Cookie', [refreshToken])
        .set('Cookie', [`refresh_token=${token.refreshToken}`])
      const res = result.body;
      console.log(
        "refreshToken -->"
        , res
      )
      // console.log(result)
      // expect(message).toEqual('helloWorld');
      // expect(result.statusCode).toEqual(200);
    });
  });

})