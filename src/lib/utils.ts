export function clickOutside(node: HTMLElement, callback: () => void) {
    const handleClick = (event: Event) => {
        const target = event.target as HTMLElement;
        if (node && !node.contains(target) && !event.defaultPrevented) {
            callback();
        }
    };

    document.addEventListener("click", handleClick, true);
    document.addEventListener("contextmenu", handleClick, true);

    return {
        destroy() {
            document.removeEventListener("click", handleClick, true);
        },
    };
}
