export type Action<T> = (e: T) => void;

export type EventRegister<T> = {
  event: new (...args: unknown[]) => T;
  action: Action<T>;
};

export class DomainEvents {
  private static actions = new Map<unknown, Action<unknown>[]>();

  static register<T>({ event, action }: EventRegister<T>) {
    if (!DomainEvents.actions.get(event)) {
      DomainEvents.actions.set(event, []);
    }

    DomainEvents.actions.set(event, [
      ...DomainEvents.actions.get(event),
      action,
    ]);

    return {
      dispose: () => {
        const index = DomainEvents.actions.get(event).indexOf(action);
        if (index !== -1) {
          DomainEvents.actions.get(event).splice(index, 1);
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
