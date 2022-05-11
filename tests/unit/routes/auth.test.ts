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
import { userRepositoryInstance } from '../../../src/repositorys';

type data = {
  accessToken: string,
  refreshToken: string
}

describe('register -> refreshToken -> delete ', () => {

  let token: data

  beforeAll(async () => {
    // let response = await request(app)
    //   .post('/api/auth/register')
    //   .send({ email: 'foo@bar.com', password: "barbar" })
    // token = response.body.data
    // expect(token.accessToken.length).not.toEqual(0)
    // expect(token.refreshToken.length).not.toEqual(0)

    // let refreshTokenCookie = response.headers['set-cookie'][0]
    //   .split(',')
    //   .map((item: any) => item.split(';')[0])
    //   .filter((cookie: string) => cookie.includes("refresh_token="))[0]
    // expect(refreshTokenCookie.length).not.toEqual(0)

  });

  afterAll(async () => {
    // let res = await userRepositoryInstance.deleteUserByEmail('foo@bar.com')
    // expect(res.email).toEqual('foo@bar.com');
    appServer.close()
  });

  // describe('GET /api/auth/refreshToken', () => {
  test('register API Request', async () => {
    let response = await request(app)
      .post('/api/auth/register')
      .send({ email: 'foo@bar.com', password: "barbar" })
    token = response.body.data
    expect(token.accessToken.length).not.toEqual(0)
    expect(token.refreshToken.length).not.toEqual(0)

    let refreshTokenCookie = response.headers['set-cookie'][0]
      .split(',')
      .map((item: any) => item.split(';')[0])
      .filter((cookie: string) => cookie.includes("refresh_token="))[0]
    expect(refreshTokenCookie.length).not.toEqual(0)
  })

  test('refreshToken API Request', async () => {
    const result = await request(app)
      .get('/api/auth/refreshToken')
      .set('Cookie', [`refresh_token=${token.refreshToken}`])
    const res = result.body;
    expect(res.accessToken.length).not.toEqual(0)
    expect(res.refreshToken.length).not.toEqual(0)
  });

  test('delete API Request', async () => {
    const result = await request(app)
      .delete('/api/user/delete')
      .set('Authorization', `Bearer ${token.accessToken}`)
      .send({ email: 'foo@bar.com' })
    const res = result.body;
    expect(res).toEqual({ success: true, message: 'deleted' })
  });

})