import {
  DecisionEvaluationRecordValue,
  DecisionRecordValue,
  DecisionRequirementsRecordValue,
  DeploymentDistributionRecordValue,
  DeploymentRecordValue,
  ErrorRecordValue,
  IncidentRecordValue,
  JobRecordValue,
  MessageRecordValue,
  MessageStartEventSubscriptionRecordValue,
  MessageSubscriptionRecordValue,
  Process,
  ProcessEventRecordValue,
  ProcessInstanceCreationRecordValue,
  VariableRecordValue,
  ProcessInstanceRecordValue,
  ProcessInstanceResultRecordValue,
  ProcessInstanceModificationRecordValue,
  TimerRecordValue,
  ProcessMessageSubscriptionRecordValue,
  VariableDocumentRecordValue,
  EscalationRecordValue, JobBatchRecordValue, ValueType
} from "@hauptmedia/zeebe-exporter-types";
import {ZeebeRecord, ZeebeRecordHandlerInterface} from "@hauptmedia/zeebe-exporter-types";

export class TablePrintRecordHandler implements ZeebeRecordHandlerInterface {
  protected _buffer: any = [];
  protected _timer: any;

  protected _fields: string[] = [];
  protected _sampleRate: number;

  /**
   * This handler will collect records for a given time and print them out into a table on the console
   * @param fields Fields from value object which should be included in the table
   * @param sampleRate Sample rate in ms
   */
  constructor(fields: string[], sampleRate: number) {
    this._fields = fields;
    this._sampleRate = sampleRate;
  }

  protected _prettyPrintTable() {
      this._timer = null;
      console.table(
        this._buffer,
        ['timestamp', 'valueType', 'intent', ...this._fields]
      );
      this._buffer.length = 0;
  }

  protected _prettyPrint(record: ZeebeRecord<ValueType>) {
    this._buffer.push({
      timestamp: new Date(record.timestamp).toISOString(),
      recordType: record.recordType,
      valueType: record.valueType,
      intent: record.intent,
      ...record.value
    });

     if(!this._timer)
       this._timer = setTimeout(this._prettyPrintTable.bind(this), this._sampleRate);
  }

  decision(record: ZeebeRecord<DecisionRecordValue>): void {
    this._prettyPrint(record);
  }

  decisionEvaluation(record: ZeebeRecord<DecisionEvaluationRecordValue>): void {
    this._prettyPrint(record);
  }

  decisionRequirements(record: ZeebeRecord<DecisionRequirementsRecordValue>): void {
    this._prettyPrint(record);
  }

  deployment(record: ZeebeRecord<DeploymentRecordValue>): void {
    this._prettyPrint(record);
  }

  deploymentDistribution(record: ZeebeRecord<DeploymentDistributionRecordValue>): void {
    this._prettyPrint(record);
  }

  error(record: ZeebeRecord<ErrorRecordValue>): void {
    this._prettyPrint(record);
  }

  escalation(record: ZeebeRecord<EscalationRecordValue>): void {
     this._prettyPrint(record);
  }

  incident(record: ZeebeRecord<IncidentRecordValue>): void {
    this._prettyPrint(record);
  }

  job(record: ZeebeRecord<JobRecordValue>): void {
    this._prettyPrint(record);
  }

  jobBatch(record: ZeebeRecord<JobBatchRecordValue>): void {
    this._prettyPrint(record);
  }

  message(record: ZeebeRecord<MessageRecordValue>): void {
    this._prettyPrint(record);
  }

  messageStartEventSubscription(record: ZeebeRecord<MessageStartEventSubscriptionRecordValue>): void {
    this._prettyPrint(record);
  }

  messageSubscription(record: ZeebeRecord<MessageSubscriptionRecordValue>): void {
     this._prettyPrint(record);
  }

  process(record: ZeebeRecord<Process>): void {
    this._prettyPrint(record);
  }

  processEvent(record: ZeebeRecord<ProcessEventRecordValue>): void {
    this._prettyPrint(record)
  }

  processInstance(record: ZeebeRecord<ProcessInstanceRecordValue>): void {
    this._prettyPrint(record);
  }

  processInstanceCreation(record: ZeebeRecord<ProcessInstanceCreationRecordValue>): void {
    this._prettyPrint(record);
  }

  processInstanceModification(record: ZeebeRecord<ProcessInstanceModificationRecordValue>): void {
    this._prettyPrint(record);
  }

  processInstanceResult(record: ZeebeRecord<ProcessInstanceResultRecordValue>): void {
    this._prettyPrint(record);
  }

  processMessageSubscription(record: ZeebeRecord<ProcessMessageSubscriptionRecordValue>): void {
    this._prettyPrint(record);
  }

  timer(record: ZeebeRecord<TimerRecordValue>): void {
    this._prettyPrint(record);
  }

  variable(record: ZeebeRecord<VariableRecordValue>): void {
    this._prettyPrint(record);
  }

  variableDocument(record: ZeebeRecord<VariableDocumentRecordValue>): void {
    this._prettyPrint(record);
  }
}
