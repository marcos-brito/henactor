export interface Navigator {
    selected: number;
    last(): void;
    first(): void;
    halfPageForward(): void;
    halfPageBackward(): void;
    pageForward(): void;
    pageBackward(): void;
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

function pageSizeFor(total: number): number {
    return Math.log2(Math.ceil(total));
}

export class GridNavigator implements Navigator {
    private rows: number;
    private col = $state(0);
    private row = $state(0);
    private pageSize: number;
    public selected = $derived.by(() => {
        if (!this.columns) return 0;
        return this.row * this.columns + this.col;
    });

    constructor(
        readonly length: number,
        readonly columns: number,
    ) {
        this.pageSize = pageSizeFor(length);
        this.rows = Math.ceil(this.length / this.columns);
    }

    public right(): void {
        if (this.rightCellIsEmpty()) return;
        this.cappedSumCol(1);
    }

    public left(): void {
        this.cappedSumCol(-1);
    }

    public up(): void {
        this.cappedSumRow(-1);
    }

    public down(): void {
        if (this.belowCellIsEmpty()) this.col = 0;
        this.cappedSumRow(1);
    }

    public first(): void {
        this.col = 0;
        this.row = 0;
    }

    public last(): void {
        const itemsInLastRow = this.length % this.columns;
        this.col = itemsInLastRow === 0 ? this.columns - 1 : itemsInLastRow - 1;
        this.row = this.rows - 1;
    }

    public halfPageForward(): void {
        this.cappedSumRow(this.pageSize / 2);
    }

    public halfPageBackward(): void {
        this.cappedSumRow(-(this.pageSize / 2 + 1));
    }

    public pageForward(): void {
        this.cappedSumRow(this.pageSize);
    }

    public pageBackward(): void {
        this.cappedSumRow(-this.pageSize);
    }

    private cappedSumCol(value: number): void {
        this.col = clamp(this.col + Math.ceil(value), 0, this.columns - 1);
    }

    private cappedSumRow(value: number): void {
        this.row = clamp(this.row + Math.ceil(value), 0, this.rows - 1);
    }

    private belowCellIsEmpty(): boolean {
        return this.selected + this.columns >= this.length;
    }

    private rightCellIsEmpty(): boolean {
        return this.selected + 1 == this.length;
    }
}

export class RegularNavigator implements Navigator {
    public selected = $state(0);
    readonly pageSize: number;

    constructor(readonly length: number) {
        this.pageSize = pageSizeFor(length);
    }

    public previous(): void {
        this.cappedSum(-1);
    }

    public next(): void {
        this.cappedSum(1);
    }

    public first(): void {
        this.selected = 0;
    }

    public last(): void {
        this.selected = this.length;
    }

    public halfPageForward(): void {
        this.cappedSum(this.pageSize / 2);
    }

    public halfPageBackward(): void {
        this.cappedSum(-(this.pageSize / 2 + 1));
    }

    public pageForward(): void {
        this.cappedSum(this.pageSize);
    }
    public pageBackward(): void {
        this.cappedSum(-this.pageSize);
    }

    private cappedSum(value: number): void {
        this.selected = clamp(this.selected + Math.ceil(value), 0, this.length);
    }
}
