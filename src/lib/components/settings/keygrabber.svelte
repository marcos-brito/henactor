<script lang="ts">
    import { commandRegister, configManager, i18n } from "$lib";
    import type { Command } from "$lib/services";
    import { clickOutside } from "$lib/utils";

    let {
        grabbing = $bindable(false),
        callback,
    }: {
        grabbing: boolean;
        callback: (grabbed: string) => void;
    } = $props();

    let grabber: HTMLElement;
    let grabbed = $state<Array<string>>([]);

    function close(): void {
        grabbed = [];
        grabbing = false;
    }

    class QuitKeyGrabber implements Command {
        public identifier = "QuitKeyGrabber";
        public name = i18n.t("keygrabber.QuitKeygrabber.name", { ns: "commands" });
        public desc = i18n.t("keygrabber.QuitKeygrabber.desc", { ns: "commands" });
        public keybinds = ["Control+Enter"];

        public async canExecute(): Promise<boolean> {
            return grabbing;
        }

        public async canTrigger(): Promise<boolean> {
            return grabbing;
        }

        public async execute(): Promise<void> {
            const grabbedStr = grabbed.join("+");
            close();

            for (const keybind of configManager.config.keybinds[this.identifier]) {
                if (grabbedStr == keybind) return;
                if (grabbedStr.endsWith(keybind))
                    return callback(grabbedStr.slice(0, grabbedStr.length - keybind.length - 1));
            }
        }
    }

    function handleKeyDown(e: KeyboardEvent): void {
        e.preventDefault();
        grabbed.push(e.key);
    }

    $effect(() => {
        if (grabbing) {
            grabber.focus();
            commandRegister.register(new QuitKeyGrabber());
        }
    });

    $effect(() => {
        commandRegister.register(new QuitKeyGrabber());
    });
</script>

<button
    class:hidden={!grabbing}
    bind:this={grabber}
    type="button"
    onkeydown={handleKeyDown}
    use:clickOutside={close}
>
    <p class="text-xs">
        {i18n.t("keygrabber.message", {
            ns: "ui",
            keys: configManager.config.keybinds["QuitKeyGrabber"],
        })}
    </p>
</button>
