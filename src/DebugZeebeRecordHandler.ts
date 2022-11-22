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

export class DebugZeebeRecordHandler implements ZeebeRecordHandlerInterface {
  protected printBuffer: any = [];
  protected printTimeout: any;

  protected _prettyPrintTable() {
      this.printTimeout = null;
      console.table(
        this.printBuffer,
        ['valueType', 'bpmnElementType', 'elementId', 'intent', 'correlationKey', 'variables', 'decisionId', 'errorType', 'errorMessage']
      );
      this.printBuffer.length = 0;
  }

  protected _prettyPrint(record: ZeebeRecord<ValueType>) {
    this.printBuffer.push({
      timestamp: record.timestamp,
      valueType: record.valueType,
      intent: record.intent,
      ...record.value
    });

     if(!this.printTimeout)
       this.printTimeout = setTimeout(this._prettyPrintTable.bind(this), 2000);
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
