import { ExpirationCompleteEvent, Publisher, Subjects } from "@ylticketingworld/common";


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.expirationComplete = Subjects.expirationComplete;

}