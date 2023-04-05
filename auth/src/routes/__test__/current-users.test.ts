import request from 'supertest';
import { app } from '../../app';
import { signup } from '../../test/auth-handler';

it('response with details on the current user', async () => {
    const cookie = await signup()
    const res = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send()
        .expect(200);

    expect(res.body.currentUser.email).toEqual('test@test.com');
});

it('response with null if not authenticated',async () => {
    const res = await request(app)

    .get('/api/users/currentuser')
    .send()
    .expect(200);

    expect(res.body.currentUser).toEqual(null);
})