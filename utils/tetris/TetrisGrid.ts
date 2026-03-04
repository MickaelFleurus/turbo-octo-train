import { TetrisGameConstants } from "./TetrisConstants";


export type Coordinate = [number, number];
export type GridCell = {
    filled: boolean;
    color: string;
};

export class TetrisGrid {
    grid: Array<Array<GridCell>>;
    readonly defaultColor = '#1a1a1a';

    constructor() {
        this.grid = Array.from({ length: TetrisGameConstants.GRID_HEIGHT }, () => Array(TetrisGameConstants.GRID_WIDTH).fill({ filled: false, color: '#1a1a1a' }));
    }

    setValue(coord: Coordinate, state: boolean, color: string = this.defaultColor) {
        const x = coord[0];
        const y = coord[1];
        if (x < 0 || y < 0)
            return;
        if (x > TetrisGameConstants.GRID_WIDTH || y > TetrisGameConstants.GRID_HEIGHT)
            return;

        this.grid[y][x] = { filled: state, color: color };
    }

    value(coord: Coordinate) {
        const x = coord[0];
        const y = coord[1];
        if (x < 0)
            return true;
        if (x >= TetrisGameConstants.GRID_WIDTH || y >= TetrisGameConstants.GRID_HEIGHT)
            return true;
        if (y < 0)
            return false;

        return this.grid[y][x].filled;
    }

    verifyCompleteLines() {
        let completedLine = 0;
        for (let j = TetrisGameConstants.GRID_HEIGHT - 1; j >= 0; --j) {
            let full = this.grid[j].every(element => { return element.filled; })

            if (full) {
                completedLine++;
                if (j == 0) {
                    this.grid[j].fill({ filled: false, color: this.defaultColor });
                } else {
                    for (let j2 = j; j2 > 0; j2--) {
                        let lineAbove = j2 - 1;
                        this.grid[j2] = this.grid[lineAbove].map(cell => ({ ...cell }));
                    }
                }
                j++;
            }
        }
        return completedLine;
    }


    resetGrid() {
        this.grid = Array.from({ length: TetrisGameConstants.GRID_HEIGHT }, () => Array(TetrisGameConstants.GRID_WIDTH).fill({ filled: false, color: '#1a1a1a' }));
    }

}
