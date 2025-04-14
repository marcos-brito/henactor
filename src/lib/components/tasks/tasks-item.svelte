<script lang="ts">
    import { type Task } from "$lib/services/task_manager.svelte";
    import { taskIsRunning } from "$lib/utils";
    import { XIcon } from "lucide-svelte";
    import IconWithFallback from "../icon/icon-with-fallback.svelte";
    import { configManager, i18n } from "$lib";

    let { task }: { task: Task<any> } = $props();
</script>

<article class="flex items-center justify-between gap-4">
    <div class="flex flex-col gap-2">
        <h1 class="flex items-end gap-2">
            <span>{task.name}</span>
            {#if taskIsRunning(task)}
                <span class="text-xs opacity-70"
                    >{i18n.t("item.started", {
                        ns: "tasks",
                        time: new Date(task.timer.startedAt!).toLocaleString(
                            configManager.config.options.lang,
                            {
                                hour: "2-digit",
                                minute: "2-digit",
                            },
                        ),
                    })}</span
                >
            {:else}
                <span class="text-xs opacity-70">{i18n.t("item.notStarted", { ns: "tasks" })}</span>
            {/if}
        </h1>
        <p class="text-sm opacity-70">{task.desc}</p>
    </div>
    <div class="item-center flex gap-2">
        <div
            class="tooltip tooltip-bottom"
            data-tip={taskIsRunning(task)
                ? i18n.t("tasks.elapsed", {
                      ns: "tooltip",
                      time: new Date(task.timer.elapsed!).toLocaleString(
                          configManager.config.options.lang,
                          {
                              minute: "2-digit",
                              second: "2-digit",
                          },
                      ),
                  })
                : i18n.t("tasks.waiting", { ns: "tooltip" })}
        >
            <span class="loading loading-spinner loading-sm size-8"></span>
        </div>
        <div class="tooltip tooltip-left" data-tip={i18n.t("tasks.kill", { ns: "tooltip" })}>
            <button
                type="button"
                onclick={() => task.kill()}
                class="btn btn-ghost btn-sm btn-circle opacity-70"
            >
                <IconWithFallback size={16} iconName="x">
                    <XIcon size={16} />
                </IconWithFallback>
            </button>
        </div>
    </div>
</article>
