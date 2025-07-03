import { injectable } from "inversify";

// eslint-disable-next-line
export interface CoreEvents {}

type Listener<T> = (payload: T) => void | Promise<void>;

@injectable()
export class Observer<Events extends Record<string, any> = CoreEvents> {
    private listeners: {
        [K in keyof Events]?: Set<Listener<Events[K]>>;
    } = {};

    public emit<K extends keyof Events>(event: K, payload: Events[K]): void {
        const listeners = this.listeners[event];

        if (listeners) for (const listener of listeners) listener(payload);
    }

    public listen<K extends keyof Events>(event: K, listener: Listener<Events[K]>): void {
        if (!this.listeners[event]) this.listeners[event] = new Set();
        this.listeners[event].add(listener);
    }

    public unlisten<K extends keyof Events>(event: K, listener: Listener<Events[K]>): void {
        this.listeners[event]?.delete(listener);
    }
}
