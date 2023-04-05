import { OrderCancelledEvent } from "@ylticketingworld/common";
import { Message } from 'node-nats-streaming'
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWarpper } from "../../../nats-warpper"
import { OrderCancelledListener } from "../order-cancelled-listener";


const setup = async () => {

    const listener = new OrderCancelledListener(natsWarpper.client);

    const orderId = new mongoose.Types.ObjectId().toHexString()
    const ticket = Ticket.build(
        { title: 'concert', price: 99, userId: 'adsdf', }
    );
    ticket.set({ orderId });
    await ticket.save();


    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id,
        }
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { msg, data, ticket, orderId, listener }
}

it('updates the ticket , published an event , and acks the message', async () => {
    const { msg, data, ticket, orderId, listener } = await setup();

    await listener.onMessage(data, msg);

    const upticket = await Ticket.findById(ticket.id);
    expect(upticket!.orderId).toBeUndefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWarpper.client.publish).toHaveBeenCalled();
})
