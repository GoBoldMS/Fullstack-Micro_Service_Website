import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { natsWarpper } from './nats-warpper';

const start = async () => {

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

    } catch (error) {
        console.log(error);
    }
};

start();