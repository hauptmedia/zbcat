import {Client} from "hazelcast-client";
import {Ringbuffer} from "hazelcast-client/lib/proxy";
import {HazelcastClient} from "hazelcast-client/lib/HazelcastClient";
import {SubscriberInterface} from "./SubscriberInterface";

export class HazelcastSubscriber implements SubscriberInterface {
    protected client: HazelcastClient | null = null;

    protected ringbuffer: Ringbuffer<string> | null = null;

    async connect() {
        this.client = await Client.newHazelcastClient();
        this.ringbuffer = await this.client.getRingbuffer<string>('zeebe');
    }

    async run(fn: (data: string) => void) {
        while(true && this.ringbuffer !== null){
            const tailSequence = await this.ringbuffer.tailSequence();

            // readOne blocks if no item is available
            const value = await this.ringbuffer.readOne(tailSequence.add(1));
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