import type { Observer } from "$lib/services/observer";
import { injectable } from "inversify";
import { SvelteMap } from "svelte/reactivity";

export class Timer {
    private handle?: number;
    public startedAt = $state<number>();
    public finishedAt = $state<number>();
    public elapsed = $state<number>();

    start(): void {
        this.startedAt = Date.now();
        this.handle = setInterval(() => {
            this.elapsed = Date.now() - this.startedAt!;
        }, 1000);
    }

    stop(): void {
        clearInterval(this.handle);
        this.finishedAt = Date.now();
    }
}

export type Events<T> = {
    started: void;
    finished: void;
    progress: T;
};

export interface Task<T> {
    name: string;
    desc: string;
    timer: Timer;
    watcher: Observer<Events<T>>;
    do(): Promise<void>;
    kill(): Promise<void>;
}

@injectable()
export class TaskManager {
    public tasks = new SvelteMap<number, Task<any>>();

    public async do(task: Task<any>): Promise<void> {
        const id = Math.random();

        task.watcher.listen("finished", () => {
            this.tasks.delete(id);
        });

        this.tasks.set(id, task);
        await task.do();
    }
}
