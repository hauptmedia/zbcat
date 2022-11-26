import {Client} from "hazelcast-client";
import {Ringbuffer} from "hazelcast-client/lib/proxy";
import {HazelcastClient} from "hazelcast-client/lib/HazelcastClient";
import {SubscriberInterface} from "./SubscriberInterface";

type HazelcastSubscriberOptions = {
    fromBeginning: boolean
    ringbufferName: string
    clusterName: string
    clusterMembers: string[]
}

export class HazelcastSubscriber implements SubscriberInterface {
    protected client: HazelcastClient | null = null;

    protected ringbuffer: Ringbuffer<string> | null = null;

    protected options: HazelcastSubscriberOptions;

    constructor(options: HazelcastSubscriberOptions) {
        this.options = options;
    }

    async connect() {
        this.client = await Client.newHazelcastClient({
            clusterName: this.options.clusterName,
            network: {
                clusterMembers: this.options.clusterMembers
            }
        });
        this.ringbuffer = await this.client.getRingbuffer<string>(this.options.ringbufferName);
    }

    async run(fn: (data: string) => void) {
        if(this.ringbuffer === null)
            throw "Not connected";

        let sequence;

        if(this.options.fromBeginning) {
            sequence = await this.ringbuffer.headSequence();
        } else {
            sequence = await this.ringbuffer.tailSequence();
            sequence = sequence.add(1);
        }

        while(true){
            // readOne blocks if no item is available
            const value = await this.ringbuffer.readOne(sequence);
            if(value)
                fn(value.toString());

            sequence = sequence.add(1);
        }
    }

    async disconnect() {
        this.ringbuffer = null;
        await this.client?.shutdown();
        this.client = null;
    }
}