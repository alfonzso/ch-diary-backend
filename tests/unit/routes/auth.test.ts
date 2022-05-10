// describe('User', () => {
//   describe('RefreshToken', () => {
//     test('/api/auth/refreshToken', async () => {

//     })
//   })
// })


// import app from '../../src/app';
import { app } from '../../../src';
import request from 'supertest';

const refreshToken = "refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjZjA0OTQzYi0zODE2LTQzODEtOTIxOS1hNDA3ZWYwODVmOWQiLCJqdGkiOiIyMDY1ZGI2MC1mNGUwLTQzMWItODcxYy1lYmI3ODRhNDFmNTUiLCJpYXQiOjE2NTIxOTA2MDIsImV4cCI6MTY1MjIxOTQwMn0.OkST_oU20nu-_Wmd1e9f3T3ApBE-pCklZwQSy-5RgfY"

describe('GET /api/auth/refreshToken', () => {
  it('refreshToken API Request', async () => {

    const result = await request(app)
      .get('/api/auth/refreshToken')
      .set('Cookie', [refreshToken])
    const faf = result.body;
    console.log(faf)
    // expect(message).toEqual('helloWorld');
    // expect(result.statusCode).toEqual(200);
  });
});
