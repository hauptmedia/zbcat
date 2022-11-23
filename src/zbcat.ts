import {Kafka} from 'kafkajs';
import {TablePrintRecordHandler} from "./TablePrintRecordHandler";
import {dispatchZeebeRecordToHandler, ValueType, ZeebeRecord} from "@hauptmedia/zeebe-exporter-types";
import * as uuid from 'uuid';
import { Command } from 'commander';

const program = new Command()
    .option('--fields <fields>')
    .option('--sample-rate <sample_rate>')
    .option('--from-beginning')
    .option('--kafka-brokers <broker_list>')
    .option('--kafka-client-id <kafka_client_id>')
    .option('--kafka-group-id <kafka_group_id>')
    .option('--kafka-topics <kafka_topics>');


program.parse();
const options = program.opts();

const
    fields = options['fields'] || process.env.ZBCAT_FIELDS || 'bpmnElementType,elementId,correlationKey,variables,decisionId,errorType,errorMessage',
    sampleRate = options['sampleRate'] || process.env.ZBCAT_SAMPLE_RATE || 2000,
    kafkaFromBeginning = options['fromBeginning'] || process.env.ZBCAT_KAFKA_FROM_BEGINNING || false,
    kafkaBrokers = options['kafkaBrokers'] || process.env.ZBCAT_KAFKA_BROKERS || 'localhost:9092',
    kafkaClientId = options['kafkaClientId'] || process.env.ZBCAT_KAFKA_CLIENT_ID || 'zbcat',
    kafkaGroupId = options['kafkaGroupId'] || process.env.ZBCAT_KAFKA_GROUP_ID || uuid.v4(),
    kafkaTopics = options['kafkaTopics'] || process.env.ZBCAT_KAFKA_TOPICS || 'zeebe';

const kafka = new Kafka({
        clientId: kafkaClientId,
        brokers: kafkaBrokers.split(",")
    }),
    zbRecordHandler = new TablePrintRecordHandler(fields.split(","), parseInt(sampleRate, 10)),
    consumer = kafka.consumer({groupId: kafkaGroupId})

process.on('SIGINT', () => {
    consumer.disconnect().then(() => process.exit());
});

const run = async () => {
    await consumer.connect()
    await consumer.subscribe({
        topics: kafkaTopics.split(","),
        fromBeginning: !!kafkaFromBeginning
    })

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

