
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/auth-handler';
import { natsWarpper } from '../../nats-warpper';
import { Ticket } from '../../models/ticket';
import { response } from 'express';


it('returns a 404 if the provided id dose not exist', async () => {

    const id = new mongoose.Types.ObjectId().toHexString();
    const res = await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', signin())
        .send({
            title: 'aslkdfj',
            price: 20,
        })
        .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {

    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'adfsad',
            price: 20,
        })
        .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            title: 'dafdgs',
            price: 20
        });

    const id = res.body.id;

    const re = await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', signin())
        .send({
            title: 'dsfsdasdsssf',
            price: 324,
        });

    expect(re.status).toEqual(401);

});

it('returns a 400 if the user provides an invalid title or price', async () => {
    const cookie = signin()

    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'dafdgs',
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 324,
        }).expect(400);

    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'title',
            price: -10,
        }).expect(400);

});

it('update the ticket provided valid input', async () => {
    const cookie = signin()

    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'dafdgs',
            price: 20
        });

    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'title',
            price: 20,
        }).expect(200);

    const ticketRes = await request(app)
        .get(`/api/tickets/${res.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'title',
            price: 20,
        }).expect(200);

    expect(ticketRes.body.title).toEqual('title');
});

it('publishes an event', async () => {
    const cookie = signin()

    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'dafdgs',
            price: 20
        });


    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'title',
            price: 100,
        }).expect(200);
    expect(natsWarpper.client.publish).toHaveBeenCalled()
})

it('rejects updates if the ticket is reserved', async () => {

    const cookie = signin()

    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'dafdgs',
            price: 20
        });


    const ticket = await Ticket.findById(res.body.id);
    ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() })
    ticket?.save()


    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'title',
            price: 20,
        }).expect(400);


});