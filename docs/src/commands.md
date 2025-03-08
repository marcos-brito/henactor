# Commands

In order to minimize the need for mouse usage, **Henactor** heavily relies on a command system. Roughly,
a command is just an interaction that can be made using the _Command pallet_ or a _Keybind_.

When you look at `Settings -> Keybinds`, you'll see a huge list of commands. Each one of them
is followed by a list of keyboard shortcuts. You can change them as you like. If all the key binds are removed,
the only way to call the command is by using the _Command pallet_.

> If you also removed binds for the _Command pallet_ you can find a button in the `Tools` section of the sidebar 👍

## Using the same shortcuts

Using the same keyboard shortcuts for different commands is allowed, but can sometimes be problematic.
Internally **Henactor** keeps track of the context in which a command can be executed. If multiples commands can be executed
in a given context, the first one that can will be executed. That simple. In order to never have to worry about that, always use
different binds to each command.

> The default configuration includes a few commands that share key binds. We carefully select those and is safe to keep them.
