import { Channel } from "@tauri-apps/api/core";
import type { Entry, SearchEvent } from "$lib/bindings";
import { Timer, type Events, type Task } from "./manager.svelte";
import { Observer } from "$lib/services/observer";

export class Search implements Task<Entry> {
    public name = i18n.t("search.name", { ns: "tasks" });
    public desc: string;
    private taskId?: number;
    private channel = new Channel<SearchEvent>();
    public watcher = new Observer<Events<Entry>>();
    public timer = new Timer();

    constructor(
        private path: string,
        private query: string,
    ) {
        this.desc = i18n.t("search.desc", {
            ns: "tasks",
            query: this.query,
            path: this.path,
        });
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
        if (this.taskId) await events.taskKillEvent.emit(this.taskId);
    }
}
