import mongoose from 'mongoose';
import request from 'supertest'
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { signin } from '../../test/auth-handler';

it('fetches the order', async () => {
    const ticket = Ticket.build({
        price: 20,
        title: 'concert',
        id: new mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();

    const user = signin();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);

});

it('throw not authorized if user try to fetch other user order', async () => {
    const ticket = Ticket.build({
        price: 20,
        title: 'concert',
        id: new mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();

    const user = signin();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', signin())
        .send()
        .expect(401);
});

it('returns not found if an order not found',async () => {

    const orderId = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Cookie', signin())
        .send()
        .expect(404);
});