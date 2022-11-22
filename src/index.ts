import {Kafka} from 'kafkajs';
import {DebugZeebeRecordHandler} from "./DebugZeebeRecordHandler";
import {dispatchZeebeRecordToHandler, ValueType, ZeebeRecord} from "@hauptmedia/zeebe-exporter-types";
import * as uuid from 'uuid';

const kafka = new Kafka({
    clientId: 'zbcat',
    brokers: ['localhost:9093']
})

const fields = ['bpmnElementType', 'elementId', 'correlationKey', 'variables', 'decisionId', 'errorType', 'errorMessage'],
    sampleRate = 2000,
    zbRecordHandler = new DebugZeebeRecordHandler(fields, sampleRate),
    consumer = kafka.consumer({groupId: uuid.v4()})

process.on('SIGINT', () => {
    consumer.disconnect().then(() => process.exit());
});

const run = async () => {
    await consumer.connect()
    await consumer.subscribe({topic: "zeebe"})

    await consumer.run({
        eachMessage: async ({topic, partition, message, heartbeat, pause}) => {
            if (!message.value)
                return;

            dispatchZeebeRecordToHandler(
                JSON.parse(message.value.toString()) as ZeebeRecord<ValueType>,
                zbRecordHandler
            );
        },
    })
}

run().catch(console.error)

