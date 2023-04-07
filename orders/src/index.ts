import mongoose from 'mongoose';
import { app } from './app'
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { natsWarpper } from './nats-warpper';

const start = async () => {

    console.log("starting......")

    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }

    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }

    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID must be defined');
    }

    if (!process.env.NATS_URL) {
        throw new Error('NATS_URL must be defined');
    }

    if (!process.env.NAST_CLUSTER_ID) {
        throw new Error('NAST_CLUSTER_ID must be defined');
    }



    try {
        await natsWarpper.connect(process.env.NAST_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);

        natsWarpper.client.on('close', () => {

            console.log('listener shutting down.')
            process.exit();
        });
        natsWarpper.client.on('SIGINT', () => natsWarpper.client.close());
        natsWarpper.client.on('SIGTERM', () => natsWarpper.client.close());

        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to mongo...");

        new TicketCreatedListener(natsWarpper.client).listen();
        new TicketUpdatedListener(natsWarpper.client).listen();
        new ExpirationCompleteListener(natsWarpper.client).listen();
        new PaymentCreatedListener(natsWarpper.client).listen();

    } catch (error) {
        console.log(error);
    }

    app.listen(3000, () => {
        console.log("App listen to port 3000 <>I<> ")
    })
};

start();