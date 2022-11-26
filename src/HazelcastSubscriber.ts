import {Client} from "hazelcast-client";
import {Ringbuffer} from "hazelcast-client/lib/proxy";
import {HazelcastClient} from "hazelcast-client/lib/HazelcastClient";
import {SubscriberInterface} from "./SubscriberInterface";

type HazelcastOptions = {
    fromBeginning: boolean
}

export class HazelcastSubscriber implements SubscriberInterface {
    protected client: HazelcastClient | null = null;

    protected ringbuffer: Ringbuffer<string> | null = null;

    protected options: HazelcastOptions;

    constructor(options: HazelcastOptions) {
        this.options = options;
    }

    async connect() {
        this.client = await Client.newHazelcastClient();
        this.ringbuffer = await this.client.getRingbuffer<string>('zeebe');
    }

    async run(fn: (data: string) => void) {
        if(this.ringbuffer === null)
            throw "Not connected";

        let sequence = this.options.fromBeginning ? await this.ringbuffer.headSequence() : await this.ringbuffer.tailSequence();

        while(true){
            sequence = sequence.add(1);

            // readOne blocks if no item is available
            const value = await this.ringbuffer.readOne(sequence);
            if(value)
                fn(value.toString());
        }
    }

    async disconnect() {
        this.ringbuffer = null;
        await this.client?.shutdown();
        this.client = null;
    }
}