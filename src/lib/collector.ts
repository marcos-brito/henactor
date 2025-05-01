/**
 * This exposes two functions to handle adding and fetching constructors from a collection.
 * The objective is to avoid manually calling methods such as `register` and `add`
 * for each item without injecting any dependencies
 */
import type { Command } from "./services/command";
import type { StatusProvider } from "./services/status";

type Class<T> = new (...args: any[]) => T;

type Collections = {
    command: Class<Command>;
    status: Class<StatusProvider>;
};

const collections: {
    [T in keyof Collections]: Set<Collections[T]>;
} = {
    command: new Set(),
    status: new Set(),
};

export function collect<T extends keyof Collections>(collection: T) {
    return (target: Collections[T]) => {
        collections[collection].add(target);
    };
}

export function allOf<T extends keyof Collections>(collection: T): Array<Collections[T]> {
    return Array.from(collections[collection]);
}
