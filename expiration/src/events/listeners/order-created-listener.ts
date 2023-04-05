import { Listener, Subjects } from "@ylticketingworld/common";
import { OrderCreatedEvent } from "@ylticketingworld/common/build/events/order-created-event";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";
import { queueGroupName } from "./queueGroupName";


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log('Waiting this many milliseconds',delay)

        const queJob = await expirationQueue.add({
            orderId: data.id
        },{
            delay: delay
        });
        msg.ack();
    }
}