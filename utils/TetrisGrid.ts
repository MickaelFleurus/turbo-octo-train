export class TetrisGrid {
    GRID_WIDTH = 10;
    GRID_HEIGHT = 20;

    grid: Array<boolean>;

    constructor() {
        this.grid = new Array<boolean>(this.GRID_WIDTH * this.GRID_HEIGHT).fill(false);
    }

    setValue(x: number, y: number, state: boolean) {
        if (x < 0 || y < 0)
            return;
        if (x + y * this.GRID_WIDTH > this.GRID_HEIGHT * this.GRID_WIDTH)
            return;

        this.grid[x + y * this.GRID_WIDTH] = state;
    }

    verifyCompleteLines() {
        for (let j = this.GRID_HEIGHT; j >= 0; --j) {
            let full = true;
            for (let i = 0; i < this.GRID_WIDTH; ++i) {
                if (this.grid[i + j * this.GRID_WIDTH] === false) {
                    break;
                }
            }
            if (full) {
                if (j == 0) {
                    for (let i = 0; i < this.GRID_WIDTH; ++i) {
                        this.grid[i + j * this.GRID_WIDTH] = false;
                    }
                } else {
                    let lineAbove = j - 1;
                    for (let i = 0; i < this.GRID_WIDTH; ++i) {
                        this.grid[i + j * this.GRID_WIDTH] = this.grid[i + lineAbove * this.GRID_WIDTH];
                    }
                }
            }
        }
    }

    canMoveTo(itemIndexes: Array<number>) {
        return itemIndexes.every(index => { return this.grid[index] == false; });
    }

}
