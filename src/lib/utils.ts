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

export function trucate(text: string, maxChars: number): string {
    if (text.length < maxChars) return text;
    const head = text.substring(0, maxChars / 2);
    const tail = text.substring(text.length - maxChars / 2);
    return `${head}…${tail}`
}
