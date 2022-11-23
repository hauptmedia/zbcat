zbcat: Command line viewer for Zeebe events
===========================================
![Compatible with: Camunda Platform 8](https://img.shields.io/badge/Compatible%20with-Camunda%20Platform%208-0072Ce)

Connects to Zeebe events Kafka export which can be produced with [zeebe-kafka-exporter](https://github.com/camunda-community-hub/zeebe-kafka-exporter).

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
--fields <fields>                    comma seperated list of fields from the record value which should be included (default: "bpmnElementType,elementId,correlationKey,variables,decisionId,errorType,errorMessage")
--sample-rate <sample_rate>          sample rate in ms (default: "2000")
--from-beginning                     reprocess all available events from the beginning (default: false)
--kafka-brokers <broker_list>        comma seperated list of kafka brokers (default: "localhost:9092")
--kafka-client-id <kafka_client_id>  kafka client id (default: "zbcat")
--kafka-group-id <kafka_group_id>    kafka group id, will randomly generated if not specified (default: "ddb4e421-ad7a-4b68-82ec-a338eadc2fe9")
--kafka-topics <kafka_topics>        comma seperated list of kafka topics to subsribe to (default: "zeebe")
-h, --help                           display help for command
```