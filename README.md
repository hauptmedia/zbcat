zbcat: Command line viewer for Zeebe events
===========================================
![Compatible with: Camunda Platform 8](https://img.shields.io/badge/Compatible%20with-Camunda%20Platform%208-0072Ce)

Displays Zeebe events from Kafka or Hazelcast export which can be produced with
[zeebe-kafka-exporter](https://github.com/camunda-community-hub/zeebe-kafka-exporter) or
[zeebe-hazelcast-exporter](https://github.com/camunda-community-hub/zeebe-hazelcast-exporter).

Currently only the JSON serialization format is supported!

You can use the Docker Images from [Zeebe with exporters](https://github.com/hauptmedia/docker-zeebe-with-exporters) to
kickstart a Zeebe instance with a configured Kafka or Hazelcast exporter.

## Usage

![Usage](http://g.recordit.co/CBiIK3mvqb.gif)

## Installation

### Using npx

```shell
npx @hauptmedia/zbcat
```

### Install globally

```shell
npm install -g @hauptmedia/zbcat
```

## Synopsis
```shell
Usage: zbcat [options]

Command line viewer for events produced by the Zeebe Workflow Automation Engine

Options:
  --fields <fields>                                        comma seperated list of fields from the record value which should be included (default:
                                                           "bpmnElementType,elementId,correlationKey,variables,decisionId,errorType,errorMessage")
  --sample-rate <sample_rate>                              sample rate in ms (default: "2000")
  --from-beginning                                         reprocess all available events from the beginning (default: false)
  --kafka                                                  use kafka (default: true)
  --kafka-brokers <broker_list>                            comma seperated list of kafka brokers (default: "localhost:9092")
  --kafka-client-id <kafka_client_id>                      kafka client id (default: "zbcat")
  --kafka-group-id <kafka_group_id>                        kafka group id, will randomly generated if not specified (default: "8ca558a6-4765-4137-90d9-f622f7171a45")
  --kafka-topics <kafka_topics>                            comma seperated list of kafka topics to subscribe to (default: "zeebe")
  --hazelcast                                              use hazelcast (default: false)
  --hazelcast-ringbuffer-name <hazelcast_ringbuffer_name>  name of ringbuffer used in hazelcast (default: "zeebe")
  --hazelcast-cluster-name <hazelcast_cluster_name>        name of cluster used in hazelcast (default: "dev")
  --hazelcast-cluster-members <hazelcast_cluster_members>  comma seperated list of hazelcast cluster members (default: "localhost:5701")
  -h, --help                                               display help for command
```