import { OrderCreatedEvent, Publisher,   Subjects } from "@ylticketingworld/common";


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;

}