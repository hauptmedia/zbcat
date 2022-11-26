export interface SubscriberInterface {
    connect(): Promise<void>;
    run(fn: (data: string) => void): Promise<void>;
    disconnect(): Promise<void>;
}