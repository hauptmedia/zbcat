import {TablePrintRecordHandler} from "./TablePrintRecordHandler";
import {dispatchZeebeRecordToHandler, ValueType, ZeebeRecord} from "@hauptmedia/zeebe-exporter-types";
import * as uuid from 'uuid';
import { Command } from 'commander';
import {KafkaSubscriber} from "./KafkaSubscriber";
import {HazelcastSubscriber} from "./HazelcastSubscriber";
import {SubscriberInterface} from "./SubscriberInterface";

const program = new Command()
    .description('Command line viewer for events produced by the Zeebe Workflow Automation Engine')
    .option(
        '--fields <fields>',
        'comma seperated list of fields from the record value which should be included',
        'bpmnElementType,elementId,correlationKey,variables,decisionId,errorType,errorMessage'
    )
    .option('--sample-rate <sample_rate>', 'sample rate in ms', "2000")
    .option('--from-beginning', 'reprocess all available events from the beginning', false)

    .option('--kafka', 'use kafka', true)
    .option('--kafka-brokers <broker_list>', 'comma seperated list of kafka brokers', 'localhost:9092')
    .option('--kafka-client-id <kafka_client_id>', 'kafka client id', 'zbcat')
    .option('--kafka-group-id <kafka_group_id>', 'kafka group id, will randomly generated if not specified', uuid.v4())
    .option('--kafka-topics <kafka_topics>', 'comma seperated list of kafka topics to subscribe to', 'zeebe')

    .option('--hazelcast', 'use hazelcast', false)
    .option('--hazelcast-ringbuffer-name <hazelcast_ringbuffer_name>', 'name of ringbuffer used in hazelcast', 'zeebe')
    .option('--hazelcast-cluster-name <hazelcast_cluster_name>', 'name of cluster used in hazelcast', 'dev')
    .option('--hazelcast-cluster-members <hazelcast_cluster_members>', 'comma seperated list of hazelcast cluster members', 'localhost:5701');

program.parse();
const options = program.opts();

const
    fields = options['fields'].split(","),
    sampleRate = parseInt(options['sampleRate'], 10),
    zbRecordHandler = new TablePrintRecordHandler(fields, sampleRate);


let subscriber: SubscriberInterface;

console.log(options['hazelcastClusterMembers']);

if(options['hazelcast']) {
    subscriber = new HazelcastSubscriber({
        fromBeginning: options['fromBeginning'],
        ringbufferName: options['hazelcastRingbufferName'],
        clusterName: options['hazelcastClusterName'],
        clusterMembers: options['hazelcastClusterMembers'].split(",")
    });

} else {
    subscriber = new KafkaSubscriber({
        brokers: options['kafkaBrokers'].split(","),
        clientId: options['kafkaClientId'],
        groupId: options['kafkaGroupId'],
        topics: options['kafkaTopics'].split(","),
        fromBeginning: options['fromBeginning']
    });
}


process.on('SIGINT', () => {
    subscriber.disconnect().then(() =>  process.exit(0));
});


const run = async () => {
    await subscriber.connect();

    subscriber.run((data) => {
        dispatchZeebeRecordToHandler(
            JSON.parse(data) as ZeebeRecord<ValueType>,
            zbRecordHandler
        );
    });

}

run().catch((e) => {
    console.error(e);
    process.exit(1);
})

