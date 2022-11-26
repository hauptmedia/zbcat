import {Consumer, Kafka} from "kafkajs";
import {SubscriberInterface} from "./SubscriberInterface";

type KafkaSubcriberOptions = {
    clientId: string,
    groupId: string,
    brokers: string[],
    topics: string[],
    fromBeginning: boolean
}
export class KafkaSubscriber implements SubscriberInterface {
    protected kafka: Kafka | null = null;
    protected consumer: Consumer | null = null;
    protected options: KafkaSubcriberOptions;

    constructor(options: KafkaSubcriberOptions) {
        this.options = options;
    }

    async connect() {
        this.kafka = new Kafka({
            clientId: this.options.clientId,
            brokers: this.options.brokers
        });

        this.consumer = this.kafka.consumer({groupId: this.options.groupId});
        await this.consumer.connect();

        await this.consumer.subscribe({
            topics: this.options.topics,
            fromBeginning: this.options.fromBeginning
        });
    }

    async run(fn: (data: string) => void) {

        await this.consumer?.run({
            eachMessage: async ({topic, partition, message, heartbeat, pause}) => {
                if (!message.value)
                    return;

                fn(message.value.toString());
            },
        })
    }

    async disconnect() {
        return this.consumer?.disconnect();
    }
}