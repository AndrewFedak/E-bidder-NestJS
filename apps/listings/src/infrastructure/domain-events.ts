export type Action<T> = (e: T) => void;

export type EventRegister<T> = {
  eventType: new (...args: unknown[]) => T;
  action: Action<T>;
};

export class DomainEvents {
  private static actions = new Map<unknown, Action<unknown>[]>();

  static register<T>({ eventType, action }: EventRegister<T>) {
    if (!DomainEvents.actions.get(eventType)) {
      DomainEvents.actions.set(eventType, []);
    }

    DomainEvents.actions.set(eventType, [
      ...DomainEvents.actions.get(eventType),
      action,
    ]);

    return {
      dispose: () => {
        const index = DomainEvents.actions.get(eventType).indexOf(action);
        if (index !== -1) {
          DomainEvents.actions.get(eventType).splice(index, 1);
        }
      },
    };
  }

  static raise<T extends object>(event: T) {
    const eventConstructor = event.constructor;
    const registeredActions = DomainEvents.actions.get(eventConstructor);
    if (registeredActions) {
      registeredActions.forEach((action) => action(event));
    }
  }
}
