import nats from 'node-nats-streaming';

class NatsWarpper {

    private _client?: nats.Stan;

    get client() {
        if (!this._client) {
            throw new Error("Cannot access NATS client befor connecting");

        }
        return this._client
    }

    connect(clusterId: string, clientId: string, url: string) {
        this._client = nats.connect(clusterId, clientId, { url: url });

        return new Promise<void>((resolve, reject) => {
            this.client!.on('connect', () => {
                console.log('Connected to NATS');
                resolve();
            });
            this.client?.on('error', (err) => {
                reject(err)
            })
        })
    }
}

export const natsWarpper = new NatsWarpper()