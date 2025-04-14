<script lang="ts">
    import { modalManager, taskManager } from "$lib";
    import Modal from "$lib/components/modal.svelte";
    import TasksItem from "./tasks-item.svelte";
</script>

<Modal name="tasks" class="h-4/5 max-w-3xl" {modalManager}>
    <h1 class="mb-6 text-2xl font-bold">Tasks</h1>
    {#each taskManager.tasks.values() as task}
        <TasksItem {task} />
        <div class="divider m-0"></div>
    {/each}
</Modal>
