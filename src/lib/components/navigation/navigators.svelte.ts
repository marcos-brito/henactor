export type GridNavigator = ReturnType<typeof gridNavigator>;
export type RegularNavigator = ReturnType<typeof regularNavigation>;

export function gridNavigator<T>(childrens: Array<T>, numberOfColumns: number) {
    const maxrow = Math.ceil(childrens.length / numberOfColumns)
    let col = $state(0);
    let row = $state(0);
    let selected = $derived((row * numberOfColumns) + col);

    function right(): void {
        if (col == numberOfColumns - 1) return
        if (rightCellIsEmpty()) return
        col++;
    }
    function left(): void {
        if (col == 0) return
        col--;
    }

    function up(): void {
        if (row == 0) return;
        row--;
    }

    function down(): void {
        if (row == maxrow - 1) return;
        if (belowCellIsEmpty()) col = 0;
        row++
    }

    function belowCellIsEmpty(): boolean {
        return selected + numberOfColumns >= childrens.length;
    }

    function rightCellIsEmpty(): boolean {
        return selected + 1 >= childrens.length;
    }

    return {
        get selected() { return selected },
        up,
        down,
        left,
        right,
    };
}

export function regularNavigation<T>(childrens: Array<T>) {
    let selected = $state(0);

    function previous(): void {
        if (selected == 0) return;
        selected--;
    }

    function next(): void {
        if (selected == childrens.length - 1) return;
        selected++;
    }

    return {
        get selected() { return selected },
        previous,
        next,
    };
}
