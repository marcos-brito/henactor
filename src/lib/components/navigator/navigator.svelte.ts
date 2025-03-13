export interface Navigator {
    selected: number;
    last(): void;
    first(): void;
}

export class GridNavigator implements Navigator {
    private col = $state(0);
    private row = $state(0);
    public selected = $derived.by(() => {
        if (!this.columns) return 0;
        return this.row * this.columns + this.col;
    });

    constructor(
        readonly rows: number,
        readonly columns: number,
    ) { }

    public right(): void {
        if (this.col == this.columns - 1) return;
        if (this.rightCellIsEmpty()) return;
        this.col++;
    }

    public left(): void {
        if (this.col == 0) return;
        this.col--;
    }

    public up(): void {
        if (this.row == 0) return;
        this.row--;
    }

    public down(): void {
        if (this.row == this.rows) return;
        if (this.belowCellIsEmpty()) this.col = 0;
        this.row++;
    }

    public first(): void {
        this.col = 0;
        this.row = 0;
    }

    public last(): void {
        this.col = this.columns;
        this.row = this.rows;
    }

    private belowCellIsEmpty(): boolean {
        return this.selected + this.columns >= this.rows;
    }

    private rightCellIsEmpty(): boolean {
        return this.selected + 1 >= this.rows;
    }
}

export class RegularNavigator implements Navigator {
    public selected = $state(0);

    constructor(readonly length: number) { }

    public previous(): void {
        if (this.selected == 0) return;
        this.selected--;
    }

    public next(): void {
        if (this.selected == this.length) return;
        this.selected++;
    }

    public first(): void {
        this.selected = 0;
    }

    public last(): void {
        this.selected = this.length;
    }
}
