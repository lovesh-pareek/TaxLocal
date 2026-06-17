export interface DomainEvent<T = unknown> {
  type: string;
  payload: T;
  occurredAt: Date;
}

export interface EventHandler<T = unknown> {
  handle(event: DomainEvent<T>): Promise<void>;
}

export class EventBus {
  private handlers = new Map<string, EventHandler[]>();

  subscribe(type: string, handler: EventHandler) {
    const existing = this.handlers.get(type) ?? [];
    existing.push(handler);
    this.handlers.set(type, existing);
  }

  async publish(event: DomainEvent) {
    const handlers = this.handlers.get(event.type) ?? [];
    await Promise.all(handlers.map(h => h.handle(event)));
  }
}
