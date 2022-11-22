import {Kafka} from 'kafkajs';
import {DebugZeebeRecordHandler} from "./DebugZeebeRecordHandler";
import {createZeebeRecordHandlerMap, ValueType, ZeebeRecord} from "@hauptmedia/zeebe-exporter-types";

const kafka = new Kafka({
    clientId: 'zeebe-connector',
    brokers: ['localhost:9093']
})

const zbRecordHandler = new DebugZeebeRecordHandler(),
    handlerMap = createZeebeRecordHandlerMap(zbRecordHandler);

const consumer = kafka.consumer({groupId: 'zeebe-connector'})

const run = async () => {
    await consumer.connect()
    await consumer.subscribe({topic: "zeebe"})

    await consumer.run({
        eachMessage: async ({topic, partition, message, heartbeat, pause}) => {
            if (!message.value)
                return;

            const payloadAsString = message.value.toString(),
                zbRecord = JSON.parse(payloadAsString) as ZeebeRecord<ValueType>;

            if(zbRecord.valueType in handlerMap)
                handlerMap[zbRecord.valueType].apply(zbRecordHandler, [zbRecord]);
            else
                console.error(`Ignoring unknown zeebe valueType ${zbRecord.valueType}`);
        },
    })
}

run().catch(console.error)

