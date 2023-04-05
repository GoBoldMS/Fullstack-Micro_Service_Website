import { Publisher, Subjects, TicketCreatedEvent } from "@ylticketingworld/common"

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}