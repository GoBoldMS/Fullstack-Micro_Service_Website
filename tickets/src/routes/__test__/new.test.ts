
import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/auth-handler';
import { Ticket } from '../../models/ticket';
import { natsWarpper } from '../../nats-warpper';

it('has a route handler listening to /api/tickets for post requests', async () => {
    const res = await request(app)
        .post('/api/tickets')
        .send({});

    expect(res.status).not.toEqual(404);
})


it('can only be accessed if the user is signed in', async () => {
    await request(app)
        .post('/api/tickets')
        .send({})
        .expect(401)

})

it('returns a status other then 401 if the users signed in.', async () => {
    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({});

    expect(res.status).not.toEqual(401);
})

it('returns an error if an invalid title is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            title: '',
            price: 10
        })

        .expect(400);
    await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            price: 10
        })
        .expect(400);

})

it('returns an error if an invalid price is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            title: 'test book',
            price: -10
        })

        .expect(400);
    await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            title: 'test book',
        })
        .expect(400);

})

it('creates a ticket with a valid input', async () => {

    let ticket = await Ticket.find({});
    expect(ticket.length).toEqual(0);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            title: 'adsfdsgs',
            price: 20
        })
        .expect(201);

    ticket = await Ticket.find({});
    expect(ticket.length).toEqual(1);
    expect(ticket[0].price).toEqual(20)
})

it('publishes an event', async () => {
    let ticket = await Ticket.find({});
    expect(ticket.length).toEqual(0);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            title: 'adsfdsgs',
            price: 20
        })
        .expect(201);
    expect(natsWarpper.client.publish).toHaveBeenCalled()

})