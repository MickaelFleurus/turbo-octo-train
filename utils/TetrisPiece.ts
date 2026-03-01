import { TetrisGameConstants } from "./TetrisConstants";
import { TetrisGrid, Coordinate } from "./TetrisGrid";

export enum TetrisPieceType {
    L,
    ReverseL,
    I,
    Cube,
    N,
    ReverseN,
    Tee,
}

export enum TryFallResult {
    Fell,
    Stuck,
    Lost
}

export function getRandomEnumValue<T>(enumObj: any): T {
    const values = Object.values(enumObj).filter(v => typeof v === 'number');
    return values[Math.floor(Math.random() * values.length)] as T;
}

enum PieceOrientation {
    Zero, Ninety, OneEighty, MinusNinty
}

function getNextRotation(orientation: PieceOrientation, clockwise: boolean) {
    switch (orientation) {
        case PieceOrientation.Zero:
            return clockwise ? PieceOrientation.Ninety : PieceOrientation.MinusNinty;
        case PieceOrientation.Ninety:
            return clockwise ? PieceOrientation.OneEighty : PieceOrientation.Zero;
        case PieceOrientation.OneEighty:
            return clockwise ? PieceOrientation.MinusNinty : PieceOrientation.Ninety;
        case PieceOrientation.MinusNinty:
            return clockwise ? PieceOrientation.Zero : PieceOrientation.OneEighty;
    }
}

function getPiecePositions(orientation: PieceOrientation, position: Coordinate, type: TetrisPieceType): Coordinate[] {
    let x = position[0];
    let y = position[1];
    if (type === TetrisPieceType.Cube) {
        return [position, [x + 1, y], [x, y + 1], [x + 1, y + 1]];
    }
    else if (type === TetrisPieceType.I) {
        if (orientation === PieceOrientation.MinusNinty || orientation === PieceOrientation.Ninety) {
            if (x >= TetrisGameConstants.GRID_WIDTH - 2)
                x = TetrisGameConstants.GRID_WIDTH - 3;
            if (x == 0)
                x = 1;
            return [[x, y], [x - 1, y], [x + 1, y], [x + 2, y]];
        }
        else {
            if (y >= TetrisGameConstants.GRID_HEIGHT - 2)
                y = TetrisGameConstants.GRID_HEIGHT - 3;
            return [[x, y], [x, y - 1], [x, y + 1], [x, y + 2]];
        }
    }
    else if (type === TetrisPieceType.Tee) {
        switch (orientation) {
            case PieceOrientation.Zero:
                if (x + 1 >= TetrisGameConstants.GRID_WIDTH)
                    x = TetrisGameConstants.GRID_WIDTH - 2;
                if (x == 0)
                    x = 1;
                if (y + 1 >= TetrisGameConstants.GRID_HEIGHT)
                    y = TetrisGameConstants.GRID_HEIGHT - 2;
                return [[x, y], [x - 1, y], [x + 1, y], [x, y + 1]];

            case PieceOrientation.MinusNinty:
                if (x + 1 >= TetrisGameConstants.GRID_WIDTH)
                    x = TetrisGameConstants.GRID_WIDTH - 2;
                if (y + 1 >= TetrisGameConstants.GRID_HEIGHT)
                    y = TetrisGameConstants.GRID_HEIGHT - 2;
                return [[x, y], [x + 1, y], [x, y - 1], [x, y + 1]];

            case PieceOrientation.Ninety:
                if (x == 0)
                    x = 1;
                if (y + 1 >= TetrisGameConstants.GRID_HEIGHT)
                    y = TetrisGameConstants.GRID_HEIGHT - 2;
                return [[x, y], [x - 1, y], [x, y - 1], [x, y + 1]];

            case PieceOrientation.OneEighty:
                if (x + 1 >= TetrisGameConstants.GRID_WIDTH)
                    x = TetrisGameConstants.GRID_WIDTH - 2;
                if (x == 0)
                    x = 1;
                return [[x, y], [x - 1, y], [x + 1, y], [x, y - 1]];
        }
    }
    else if (type === TetrisPieceType.N) {
        switch (orientation) {
            case PieceOrientation.Zero:
            case PieceOrientation.OneEighty: {
                if (x == 0)
                    x = 1;
                return [[x, y], [x, y - 1], [x - 1, y], [x - 1, y + 1]];
            }
            case PieceOrientation.MinusNinty:
            case PieceOrientation.Ninety: {
                if (x == 0)
                    x = 1;
                if (x + 1 >= TetrisGameConstants.GRID_WIDTH)
                    x = TetrisGameConstants.GRID_WIDTH - 2;
                if (y + 1 >= TetrisGameConstants.GRID_HEIGHT)
                    y = TetrisGameConstants.GRID_HEIGHT - 2;
                return [[x, y], [x - 1, y], [x, y + 1], [x + 1, y + 1]];
            }
        }
    }

    else if (type === TetrisPieceType.ReverseN) {
        switch (orientation) {
            case PieceOrientation.Zero:
            case PieceOrientation.OneEighty: {
                if (x + 1 >= TetrisGameConstants.GRID_WIDTH)
                    x = TetrisGameConstants.GRID_WIDTH - 2;
                if (y + 1 >= TetrisGameConstants.GRID_HEIGHT)
                    y = TetrisGameConstants.GRID_HEIGHT - 2;
                return [[x, y], [x, y - 1], [x + 1, y], [x + 1, y + 1]];
            }
            case PieceOrientation.MinusNinty:
            case PieceOrientation.Ninety: {
                if (x == 0)
                    x = 1;
                if (x + 1 >= TetrisGameConstants.GRID_WIDTH)
                    x = TetrisGameConstants.GRID_WIDTH - 2;
                if (y + 1 >= TetrisGameConstants.GRID_HEIGHT)
                    y = TetrisGameConstants.GRID_HEIGHT - 2;
                return [[x, y], [x + 1, y], [x, y + 1], [x - 1, y + 1]];
            }
        }
    }

    else if (type === TetrisPieceType.L) {
        switch (orientation) {
            case PieceOrientation.Zero:
                if (x >= TetrisGameConstants.GRID_WIDTH - 1)
                    x = TetrisGameConstants.GRID_WIDTH - 2;
                return [[x, y], [x + 1, y], [x, y - 1], [x, y - 2]];

            case PieceOrientation.OneEighty:
                if (x == 0)
                    x = 1;
                if (y >= TetrisGameConstants.GRID_HEIGHT - 2)
                    y = TetrisGameConstants.GRID_HEIGHT - 3;
                return [[x, y], [x - 1, y], [x, y + 1], [x, y + 2]];

            case PieceOrientation.MinusNinty:
                if (x < 2)
                    x = 2;

                return [[x, y], [x - 1, y], [x - 2, y], [x, y - 1]];

            case PieceOrientation.Ninety:
                if (x >= TetrisGameConstants.GRID_WIDTH - 2)
                    x = TetrisGameConstants.GRID_WIDTH - 3;
                if (y + 1 >= TetrisGameConstants.GRID_HEIGHT)
                    y = TetrisGameConstants.GRID_HEIGHT - 2;
                return [[x, y], [x + 1, y], [x + 2, y], [x, y + 1]];
        }
    }
    else { //if (type === TetrisPieceType.ReverseL) {
        switch (orientation) {
            case PieceOrientation.Zero:
                if (x == 0)
                    x = 1;
                return [[x, y], [x - 1, y], [x, y - 1], [x, y - 2]];

            case PieceOrientation.OneEighty:
                if (x >= TetrisGameConstants.GRID_WIDTH - 1)
                    x = TetrisGameConstants.GRID_WIDTH - 2;
                if (y >= TetrisGameConstants.GRID_HEIGHT - 2)
                    y = TetrisGameConstants.GRID_HEIGHT - 3;

                return [[x, y], [x + 1, y], [x, y + 1], [x, y + 2]];

            case PieceOrientation.MinusNinty:

                if (x <= 1)
                    x = 2;
                return [[x, y], [x - 1, y], [x - 2, y], [x, y + 1]];

            case PieceOrientation.Ninety:

                if (x >= TetrisGameConstants.GRID_WIDTH - 2)
                    x = TetrisGameConstants.GRID_WIDTH - 3;
                return [[x, y], [x + 1, y], [x + 2, y], [x, y - 1]];
        }
    }
}



export class TetrisPiece {
    readonly type: TetrisPieceType;
    position: Coordinate;
    orientation: PieceOrientation;
    private grid: TetrisGrid;


    constructor(type: TetrisPieceType, grid: TetrisGrid) {
        this.type = type;
        this.grid = grid;
        this.orientation = PieceOrientation.Zero;
        this.position = [TetrisGameConstants.GRID_WIDTH / 2, 0];
    }

    canRotate(clockwise: boolean) {
        let canRotate = false;
        let currentPositions = getPiecePositions(this.orientation, this.position, this.type);
        let nextRotation = getNextRotation(this.orientation, clockwise);
        let rotatedPosition = getPiecePositions(nextRotation, this.position, this.type);
        if (rotatedPosition && currentPositions) {
            currentPositions.forEach(index => {
                this.grid.setValue(index, false);
            });
            canRotate = rotatedPosition?.every(index => { return this.grid.value(index) == false; });
            currentPositions.forEach(index => {
                this.grid.setValue(index, true);
            });
        }
        return canRotate;
    }

    rotate(clockwise: boolean) {
        let nextRotation = getNextRotation(this.orientation, clockwise);
        let rotatedPositions = getPiecePositions(nextRotation, this.position, this.type);
        let currentPositions = getPiecePositions(this.orientation, this.position, this.type);

        if (rotatedPositions && currentPositions) {
            currentPositions.forEach(index => { this.grid.setValue(index, false) });

            let canRotate = rotatedPositions?.every(index => { return this.grid.value(index) == false; });
            if (!canRotate) {
                if (!this.tryMove(-1, rotatedPositions)) {
                    if (!this.tryMove(1, rotatedPositions)) {
                        currentPositions.forEach(index => { this.grid.setValue(index, true) });
                        return false;
                    }
                }
                rotatedPositions = getPiecePositions(nextRotation, this.position, this.type);
                if (!rotatedPositions) {
                    currentPositions.forEach(index => { this.grid.setValue(index, true) });
                    return false;
                }
            }
            rotatedPositions.forEach(index => { this.grid.setValue(index, true) });
            this.orientation = nextRotation;
            if (rotatedPositions) {
                this.position = rotatedPositions[0];
            }
        }
    }

    tryFall() {
        let currentPositions = getPiecePositions(this.orientation, this.position, this.type);
        console.log(currentPositions);
        currentPositions?.forEach(coord => {
            this.grid.setValue(coord, false);
        });

        let nextPositions = currentPositions?.map(coord => [coord[0], coord[1] + 1] as Coordinate);
        let canFall = nextPositions?.every(index => {
            return !this.grid.value(index);
        });
        if (canFall) {
            nextPositions?.forEach(index => { this.grid.setValue(index, true) });
            this.position[1]++;
            return TryFallResult.Fell;

        } else {
            currentPositions?.forEach(index => {
                this.grid.setValue(index, true);
            });
            let isAboveGrid = currentPositions?.some(index => { return index[1] < 0; })
            if (isAboveGrid)
                return TryFallResult.Lost;
            else
                return TryFallResult.Stuck;
        }
    }

    tryMoveLeft() {
        let currentPositions = getPiecePositions(this.orientation, this.position, this.type);
        if (currentPositions)
            return this.tryMove(-1, currentPositions);
        return false;
    }

    tryMoveRight() {
        let currentPositions = getPiecePositions(this.orientation, this.position, this.type);
        if (currentPositions)
            return this.tryMove(1, currentPositions);
        return false;
    }

    tryMove(direction: number, currentPositions: Array<Coordinate>) {
        if (currentPositions) {
            let currentPositionActive = currentPositions.some(index => { return this.grid.value(index); });
            if (currentPositionActive)
                currentPositions.forEach(index => { this.grid.setValue(index, false) });
            let nextPositions = currentPositions.map(coord => [coord[0] + 1 * direction, coord[1]] as Coordinate);
            const canMove = nextPositions.every(coord => {
                return !this.grid.value(coord);
            });
            if (canMove) {
                if (currentPositionActive)
                    nextPositions.forEach(index => { this.grid.setValue(index, true) });
                this.position = nextPositions[0];
                return true;
            }
            else {
                if (currentPositionActive)
                    currentPositions.forEach(index => { this.grid.setValue(index, true) });
                return false;
            }
        }
    }
}
