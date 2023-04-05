import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";
import { natsWarpper } from "../nats-warpper";

interface Payload {
    orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
    redis: { host: process.env.REDIS_HOST }
});


expirationQueue.process(async (job) => {
    new ExpirationCompletePublisher(natsWarpper.client).publish({ orderId: job.data.orderId });
});


export { expirationQueue };