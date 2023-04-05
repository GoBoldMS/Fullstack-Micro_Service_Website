import request from 'supertest';
import { app } from '../../app';

it('returns a 400 - when email is not exist ', async () => {
    return request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test1.com',
            password: 'password'
        })
        .expect(400);
});

it('returns a 400 with an invalid credentials', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        }).expect(201);

    return request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'p'
        })
        .expect(400);
});

it('res with cookie when giving valid credential', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        }).expect(201);

    const res = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(200);

    expect(res.get('Set-Cookie')).toBeDefined()
});

