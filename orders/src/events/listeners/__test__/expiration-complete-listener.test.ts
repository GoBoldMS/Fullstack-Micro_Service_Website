import { ExpirationCompleteEvent } from "@ylticketingworld/common";
import { Message } from 'node-nats-streaming';
import mongoose from "mongoose";
import { Order, OrderStatus } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import { natsWarpper } from "../../../nats-warpper"
import { ExpirationCompleteListener } from "../expiration-complete-listener"


const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWarpper.client);


    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });
    await ticket.save();
    const order = Order.build({
        expiresAt: new Date(),
        ticket: ticket,
        status: OrderStatus.Created,
        userId: "dsfdsfas"
    });
    await order.save();


    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { msg, data, order, ticket, listener }

};

it('updates the order status to cancelled', async () => {


    const { msg, data, order, listener } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);

});

it('emit an order cancelled event', async () => {
    const { msg, data, order,  listener } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWarpper.client.publish).toHaveBeenCalled();
    const eventData = JSON.parse((natsWarpper.client.publish as jest.Mock).mock.calls[0][1]);

    expect(eventData.id).toEqual(order.id)

})
it('ack the message', async () => {
    const { msg, data, listener } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled()
})