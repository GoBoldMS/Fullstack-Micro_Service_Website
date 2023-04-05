import mongoose from 'mongoose';
import request from 'supertest'
import {app} from '../../app';
import { Ticket } from '../../models/ticket';
import { signin } from '../../test/auth-handler';

const buildTicket = async () =>{
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString(),
    });
    await ticket.save();

    return ticket;
}

it('fetches orders for a particular user',async () => {
    const ticketOne = await buildTicket();
    const ticketTow = await buildTicket();
    const ticketThree = await buildTicket();

    const userOne = signin();
    const userTow = signin();

    await request(app)
    .post('/api/orders')
    .set('Cookie',userOne)
    .send( {ticketId: ticketOne.id})
    .expect(201);

    const {body: OrderOne} = await request(app)
    .post('/api/orders')
    .set('Cookie', userTow)
    .send( {ticketId: ticketTow.id})
    .expect(201);
    const {body: OrderTow} = await request(app)
    .post('/api/orders')
    .set('Cookie', userTow)
    .send( {ticketId: ticketThree.id})
    .expect(201);

    const res = await request(app)
        .get('/api/orders')
        .set('Cookie',userTow)
        .expect(200);

        expect(res.body.length).toEqual(2);
        expect(res.body[0].id).toEqual(OrderOne.id);
        expect(res.body[1].id).toEqual(OrderTow.id);
        expect(res.body[0].ticket.id).toEqual(ticketTow.id);
        expect(res.body[1].ticket.id).toEqual(ticketThree.id);
});