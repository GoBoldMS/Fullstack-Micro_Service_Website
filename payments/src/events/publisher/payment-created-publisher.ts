import { paymentCreatedEvent, Publisher, Subjects } from "@ylticketingworld/common";




export class PaymentCreatedPublisher extends Publisher<paymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}