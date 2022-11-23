import {Kafka} from 'kafkajs';
import {TablePrintRecordHandler} from "./TablePrintRecordHandler";
import {dispatchZeebeRecordToHandler, ValueType, ZeebeRecord} from "@hauptmedia/zeebe-exporter-types";
import * as uuid from 'uuid';
import { Command } from 'commander';

const program = new Command()
    .description('Command line viewer for events produced by the Zeebe Workflow Automation Engine')
    .option(
        '--fields <fields>',
        'comma seperated list of fields from the record value which should be included',
        'bpmnElementType,elementId,correlationKey,variables,decisionId,errorType,errorMessage'
    )
    .option('--sample-rate <sample_rate>', 'sample rate in ms', "2000")
    .option('--from-beginning', 'reprocess all available events from the beginning', false)
    .option('--kafka-brokers <broker_list>', 'comma seperated list of kafka brokers', 'localhost:9092')
    .option('--kafka-client-id <kafka_client_id>', 'kafka client id', 'zbcat')
    .option('--kafka-group-id <kafka_group_id>', 'kafka group id, will randomly generated if not specified', uuid.v4())
    .option('--kafka-topics <kafka_topics>', 'comma seperated list of kafka topics to subsribe to', 'zeebe');


program.parse();
const options = program.opts();

const
    fields = options['fields'].split(","),
    sampleRate = parseInt(options['sampleRate'], 10),
    kafkaFromBeginning = options['fromBeginning'],
    kafkaBrokers = options['kafkaBrokers'].split(","),
    kafkaClientId = options['kafkaClientId'],
    kafkaGroupId = options['kafkaGroupId'],
    kafkaTopics = options['kafkaTopics'].split(",");

const kafka = new Kafka({
        clientId: kafkaClientId,
        brokers: kafkaBrokers
    }),
    zbRecordHandler = new TablePrintRecordHandler(fields, sampleRate),
    consumer = kafka.consumer({groupId: kafkaGroupId})

process.on('SIGINT', () => {
    consumer.disconnect().then(() => process.exit());
});

const run = async () => {
    await consumer.connect()
    await consumer.subscribe({
        topics: kafkaTopics,
        fromBeginning: kafkaFromBeginning
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

