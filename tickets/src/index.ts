import mongoose from 'mongoose';
import { app } from './app'
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { natsWarpper } from './nats-warpper';

const start = async () => {

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


        new OrderCreatedListener(natsWarpper.client).listen();
        new OrderCancelledListener(natsWarpper.client).listen();


        mongoose.set('strictQuery', false)
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to mongo...")

    } catch (error) {
        console.log(error);
    }

    app.listen(3000, () => {
        console.log("App listen to port 3000 <>I<> ")
    })
};

start();