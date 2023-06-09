import { EventDispatcherInterface } from './event-dispatcher.interface';
import { EventInterface } from './event.interface';
import { EventHandlerInterface } from './event-handler.interface';

type EventHandlers = {
  [eventName: string]: EventHandlerInterface[]
}

export class EventDispatcher implements EventDispatcherInterface {
  private eventHandlers: EventHandlers = {}

  get getEventHandlers(): EventHandlers {
    return this.eventHandlers
  }

  register(eventName: string, eventHandler: EventHandlerInterface): void {
    if (!this.eventHandlers[eventName]) {
      this.eventHandlers[eventName] = []
    }
    this.eventHandlers[eventName].push(eventHandler)
  }

  unregister(eventName: string, eventHandler: EventHandlerInterface): void {
    if (this.eventHandlers[eventName]) {
      this.eventHandlers[eventName] = this.eventHandlers[eventName].filter(
        handler => handler !== eventHandler
      )
    }
  }

  unregisterAll(): void {
    this.eventHandlers = {}
  }

  notify(event: EventInterface): void {
    const eventName = event.constructor.name
    if (this.eventHandlers[eventName]) {
      this.eventHandlers[eventName].forEach(eventHandler => {
        eventHandler.handle(event)
      })
    }
  }
}