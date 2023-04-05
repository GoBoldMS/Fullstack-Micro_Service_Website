import { Listener, NotFoundError, OrderStatus, paymentCreatedEvent, Subjects } from "@ylticketingworld/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";


export class PaymentCreatedListener extends Listener<paymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: paymentCreatedEvent['data'], msg: Message) {

        const order = await Order.findById(data.orderId);

        if (!order) {
            throw new NotFoundError();
        }
        order.set({status: OrderStatus.Complete})
        await order.save();

        msg.ack();
    }
}