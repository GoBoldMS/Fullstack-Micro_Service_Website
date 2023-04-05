import { app } from "../app";
import request from 'supertest';


export const signup = async () : Promise<string[]> => {
    const email = 'test@test.com';
    const password = 'password';

    const res = await request(app)
        .post('/api/users/signup')
        .send({
            email,
            password
        })
        .expect(201);

    const cookie = res.get('Set-Cookie');
    
    return cookie;
} 