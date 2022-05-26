import 'reflect-metadata';
import { app, appServer } from '../../../server';
import request from 'supertest';
import { addNewEntry } from '../../../src/types';

// type data = {
//   accessToken: string,
//   refreshToken: string
// }

describe('api -> diary -> addNewEntry ', () => {

  // let token: data

  beforeAll(async () => {
  });

  afterAll(async () => {
    appServer.close()
  });

  test('addNewEntry API Request', async () => {
    let response = await request(app)
      .post('/api/diary/addNewEntry')
      .send({
        userDTO: {
          id: "1bbd258b-4599-4406-bbc3-9a2ad569fbae"
        },
        foodName: "FAr1111aja",
        foodPortion: 1111,
        createdAt: new Date("2011-11-11"),
        interFoodType: "D11",
        foodProp: {
          ch: 111,
          fat: 111,
          gramm: 11,
          kcal: 111,
          portein: 1111,
        }
      } as addNewEntry)
    let token = response.body
    console.log(
      token
    )
    // expect(token.accessToken.length).not.toEqual(0)
    // expect(token.refreshToken.length).not.toEqual(0)

    // let refreshTokenCookie = response.headers['set-cookie'][0]
    //   .split(',')
    //   .map((item: any) => item.split(';')[0])
    //   .filter((cookie: string) => cookie.includes("refresh_token="))[0]
    // expect(refreshTokenCookie.length).not.toEqual(0)
  })


})