import { OrderCreatedEvent, OrderStatus } from "@ylticketingworld/common";
import { Message } from 'node-nats-streaming'
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWarpper } from "../../../nats-warpper"
import { OrderCreatedListener } from "../order-created-listener"


const setup = async () => {

    const listener = new OrderCreatedListener(natsWarpper.client);

    const ticket = Ticket.build(
        { title: 'concert', price: 99, userId: 'adsdf' }

    );

    await ticket.save();


    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'dgf',
        expiresAt: "dfd",
        ticket: {
            id: ticket.id,
            price: ticket.price,
        }
    }
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { msg, data, ticket, listener }
}


it('sets the userId of the ticket', async () => {
    const { msg, data, ticket, listener } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id);

});

it('acks the message', async () => {
    const { msg, data, ticket, listener } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})


it('publish a ticket update event', async () => {
    const { msg, data, ticket, listener } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWarpper.client.publish).toHaveBeenCalled();

    const ticketUpdatedData = JSON.parse((natsWarpper.client.publish as jest.Mock).mock.calls[0][1]);

    expect(data.id).toEqual(ticketUpdatedData.orderId);
});