import { injectable } from "inversify";

export type Hook<T> = (arg: T) => Promise<void>;

export interface Modal<T = void> {
    name: string;
    show(params?: T, hook?: Hook<T>): void;
    hide(): void;
}

@injectable()
export class ModalManager {
    private modals = new Map<string, Modal>();
    private opened = new Array<string>();

    public register(modal: Modal): ModalManager {
        this.modals.set(modal.name, modal);
        return this;
    }

    public show(name: string, params?: any, hook?: Hook<any>): void {
        const modal = this.modals.get(name);
        if (modal && !this.isOpen(modal.name)) {
            modal.show(params, hook);
            this.opened.push(modal.name);
        }
    }

    public hide(name: string): void {
        const modal = this.modals.get(name);
        if (modal && this.isOpen(modal.name)) {
            modal.hide();
            this.opened = this.opened.filter((name) => name != modal.name);
        }
    }

    public allClosed(): boolean {
        return this.opened.length == 0;
    }

    public allClosedExcept(...names: Array<string>): boolean {
        return this.opened.every((name) => names.includes(name));
    }

    public isOpen(name: string): boolean {
        return this.opened.includes(name);
    }
}
