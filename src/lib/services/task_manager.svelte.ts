import { i18n } from "$lib";
import { commands, events, type Entry, type SearchEvent } from "$lib/bindings";
import { Channel } from "@tauri-apps/api/core";
import { SvelteMap } from "svelte/reactivity";

type Handler<T> = (message?: T) => void;

type Event = "started" | "progress" | "finished";

class Watcher<T> {
    private handlers = new Map<Event, Array<Handler<T>>>();

    public emit(ev: Event, message?: T): void {
        if (!this.handlers.has(ev)) this.handlers.set(ev, []);
        for (const handler of this.handlers.get(ev)!) handler(message);
    }

    public listen(ev: Event, handler: Handler<T>): void {
        if (!this.handlers.has(ev)) this.handlers.set(ev, []);
        this.handlers.get(ev)!.push(handler);
    }
}

class Timer {
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

export interface Task<T> {
    name: string;
    desc: string;
    timer: Timer;
    watcher: Watcher<T>;
    do(): Promise<void>;
    kill(): Promise<void>;
}

export class Search implements Task<Entry> {
    public name = i18n.t("search.name", { ns: "tasks" });
    public desc: string;
    private taskId?: number;
    private channel = new Channel<SearchEvent>();
    public watcher = new Watcher<Entry>();
    public timer = new Timer();

    constructor(
        private path: string,
        private query: string,
    ) {
        this.desc = i18n.t("search.desc", { ns: "tasks", query: this.query, path: this.path });
    }

    public async do(): Promise<void> {
        this.channel.onmessage = (m) => {
            if (m.event == "Started") {
                this.taskId = m.data;
                this.timer.start();
                this.watcher.emit("started");
                return;
            }

            if (m.event == "Finished") {
                this.timer.stop();
                this.watcher.emit("finished");
                return;
            }

            this.watcher.emit("progress", m.data);
        };

        await commands.search(this.path, this.query, this.channel);
    }

    public async kill(): Promise<void> {
        if (this.taskId) events.taskKillEvent.emit(this.taskId);
    }
}

export class TaskManager {
    public tasks = $state(new SvelteMap<number, Task<any>>());

    public async do(task: Task<any>): Promise<void> {
        const id = Math.random();
        task.watcher.listen("finished", () => {
            this.tasks.delete(id);
        });
        this.tasks.set(id, task);
        task.do();
    }
}
