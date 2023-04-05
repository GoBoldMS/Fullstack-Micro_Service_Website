import { Publisher, Subjects, OrderCancelledEvent } from "@ylticketingworld/common";


export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}