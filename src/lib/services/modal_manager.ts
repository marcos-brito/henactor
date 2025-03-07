export type Hook<T> = (arg: T) => Promise<void>;

export interface Modal<T = void> {
    name: string;
    show(params?: T, hook?: Hook<T>): void;
}

export class ModalManager {
    private modals = new Map<string, Modal>();

    public register(modal: Modal): ModalManager {
        this.modals.set(modal.name, modal);
        return this;
    }

    public show(name: string, params?: any, hook?: Hook<any>): void {
        const modal = this.modals.get(name);
        if (modal) {
            modal.show(params, hook);
        }
    }
}
