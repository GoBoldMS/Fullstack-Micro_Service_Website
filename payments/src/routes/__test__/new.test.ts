import { OrderStatus } from "@ylticketingworld/common";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app"
import { Order } from "../../models/order";
import { signin } from "../../test/auth-handler";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

it('returns a 404 when purchasing an order that does not exist', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', signin())
        .send({
            token: 'adfdsa',
            orderId: new mongoose.Types.ObjectId().toHexString()
        })
        .expect(404);

})

it('returns a 401 when purchasing an order that does belong to the user', async () => {

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        price: 15,
        version: 0,
        status: OrderStatus.Created
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', signin())
        .send({
            token: 'adfdsa',
            orderId: order.id
        })
        .expect(401);
})

it('returns a 400 when purchasing an order that is cancelled ', async () => {

    const userId = new mongoose.Types.ObjectId().toHexString()

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: userId,
        price: 15,
        version: 0,
        status: OrderStatus.Cancelled
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', signin(userId))
        .send({
            token: 'adfdsa',
            orderId: order.id
        })
        .expect(400);
})

it('returns a 201 with valid inputs', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString()
    const price = Math.floor(Math.random() * 100000)
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: userId,
        price: price,
        version: 0,
        status: OrderStatus.Created
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', signin(userId))
        .send({
            token: 'tok_visa',
            orderId: order.id
        })
        .expect(201);

    const numOfCharges = await stripe.charges.list({ limit: 50 });
    const stripeCharge = numOfCharges.data.find(c => c.amount == price * 100);

    expect(stripeCharge).toBeDefined();
    expect(stripeCharge?.currency).toEqual('usd');

    const payment = await Payment.findOne({ stripeId: stripeCharge?.id, orderId: order.id });
    expect(payment).not.toBeNull();
})