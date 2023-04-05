import { Publisher, Subjects, TicketUpdatedEvent } from "@ylticketingworld/common"

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}