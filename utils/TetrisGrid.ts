import { TetrisGameConstants } from "./TetrisConstants";


export type Coordinate = [number, number];

export class TetrisGrid {
    grid: Array<Array<boolean>>;

    constructor() {
        this.grid = Array.from({ length: TetrisGameConstants.GRID_HEIGHT }, () => Array(TetrisGameConstants.GRID_WIDTH).fill(false));
    }

    setValue(coord: Coordinate, state: boolean) {
        const x = coord[0];
        const y = coord[1];
        if (x < 0 || y < 0)
            return;
        if (x > TetrisGameConstants.GRID_WIDTH || y > TetrisGameConstants.GRID_HEIGHT)
            return;

        this.grid[y][x] = state;
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

        return this.grid[y][x];
    }

    verifyCompleteLines() {
        let completedLine = 0;
        for (let j = TetrisGameConstants.GRID_HEIGHT - 1; j >= 0; --j) {
            let full = this.grid[j].every(element => { return element; })

            if (full) {
                completedLine++;
                if (j == 0) {
                    this.grid[j].fill(false);
                } else {
                    for (let j2 = j; j2 > 0; j2--) {
                        let lineAbove = j2 - 1;
                        this.grid[j2] = this.grid[lineAbove].slice();
                    }
                }
                j++;
            }
        }
        return completedLine;
    }


    areCellsFree(itemIndexes: Array<Coordinate>) {
        return itemIndexes.every(coordinates => { return this.grid[coordinates[1]][coordinates[0]] == false; });
    }

    resetGrid() {
        this.grid = Array.from({ length: TetrisGameConstants.GRID_HEIGHT }, () => Array(TetrisGameConstants.GRID_WIDTH).fill(false));
    }

}
