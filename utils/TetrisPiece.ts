import { TetrisGameConstants } from "./TetrisConstants";
import { TetrisGrid } from "./TetrisGrid";

export enum TetrisPieceType {
    T,
    L,
    ReverseL,
    I,
    Cube,
    N,
    ReverseN
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

function getPiecePositions(orientation: PieceOrientation, position: number, type: TetrisPieceType) {
    if (type === TetrisPieceType.Cube) {
        return [position, position + 1, position - TetrisGameConstants.GRID_WIDTH, position - TetrisGameConstants.GRID_WIDTH + 1];
    }
    if (type === TetrisPieceType.I) {
        if (orientation === PieceOrientation.MinusNinty || orientation === PieceOrientation.Ninety) {
            return [position, position - 1, position + 1, position + 2];
        }
        else {
            return [position, position - TetrisGameConstants.GRID_WIDTH, position + TetrisGameConstants.GRID_WIDTH, position + 2 * TetrisGameConstants.GRID_WIDTH];
        }
    }
    if (type === TetrisPieceType.T) {
        switch (orientation) {
            case PieceOrientation.Zero:
                return [position, position - 1, position + 1, position + TetrisGameConstants.GRID_WIDTH];
            case PieceOrientation.MinusNinty:
                return [position, position + 1, position - TetrisGameConstants.GRID_WIDTH, position + TetrisGameConstants.GRID_WIDTH];
            case PieceOrientation.Ninety:
                return [position, position - 1, position - TetrisGameConstants.GRID_WIDTH, position + TetrisGameConstants.GRID_WIDTH];
            case PieceOrientation.OneEighty:
                return [position, position - 1, position + 1, position - TetrisGameConstants.GRID_WIDTH];
        }
    }
    if (type === TetrisPieceType.N) {
        switch (orientation) {
            case PieceOrientation.Zero:
            case PieceOrientation.OneEighty:
                return [position, position - 1, position - TetrisGameConstants.GRID_WIDTH - 1, position - TetrisGameConstants.GRID_WIDTH];
            case PieceOrientation.MinusNinty:
            case PieceOrientation.Ninety:
                return [position, position - 1, position + TetrisGameConstants.GRID_WIDTH, position + TetrisGameConstants.GRID_WIDTH + 1];
        }
    }

    if (type === TetrisPieceType.ReverseN) {
        switch (orientation) {
            case PieceOrientation.Zero:
            case PieceOrientation.OneEighty:
                return [position, position + 1, position - TetrisGameConstants.GRID_WIDTH, position + TetrisGameConstants.GRID_WIDTH + 1];
            case PieceOrientation.MinusNinty:
            case PieceOrientation.Ninety:
                return [position, position + 1, position + TetrisGameConstants.GRID_WIDTH, position + TetrisGameConstants.GRID_WIDTH - 1];
        }
    }

    if (type === TetrisPieceType.L) {
        switch (orientation) {
            case PieceOrientation.Zero:
                return [position, position + 1, position - TetrisGameConstants.GRID_WIDTH, position - 2 * TetrisGameConstants.GRID_WIDTH];
            case PieceOrientation.OneEighty:
                return [position, position - 1, position + TetrisGameConstants.GRID_WIDTH, position + 2 * TetrisGameConstants.GRID_WIDTH];
            case PieceOrientation.MinusNinty:
                return [position, position - 1, position - 2, position - TetrisGameConstants.GRID_WIDTH];
            case PieceOrientation.Ninety:
                return [position, position + 1, position + 2, position + TetrisGameConstants.GRID_WIDTH];
        }
    }
    if (type === TetrisPieceType.ReverseL) {
        switch (orientation) {
            case PieceOrientation.Zero:
                return [position, position - 1, position - TetrisGameConstants.GRID_WIDTH, position - 2 * TetrisGameConstants.GRID_WIDTH];
            case PieceOrientation.OneEighty:
                return [position, position + 1, position + TetrisGameConstants.GRID_WIDTH, position + 2 * TetrisGameConstants.GRID_WIDTH];
            case PieceOrientation.MinusNinty:
                return [position, position - 1, position - 2, position + TetrisGameConstants.GRID_WIDTH];
            case PieceOrientation.Ninety:
                return [position, position + 1, position + 2, position - TetrisGameConstants.GRID_WIDTH];
        }
    }
}



export class TetrisPiece {
    readonly type: TetrisPieceType;
    position: number;
    orientation: PieceOrientation;


    constructor(type: TetrisPieceType) {
        this.type = type;
        this.orientation = PieceOrientation.Zero;
        this.position = -TetrisGameConstants.GRID_WIDTH / 2;
    }

    canRotate(clockwise: boolean, grid: TetrisGrid) {
        let nextRotation = getNextRotation(this.orientation, clockwise);

    }

    rotate(clockwise: boolean) {


    }
}


/* 

switch (type) {
    case TetrisPieceType.Cube:
        this.positions.push(-TetrisGameConstants.GRID_WIDTH / 2);
        this.positions.push(-TetrisGameConstants.GRID_WIDTH / 2 + 1);
        this.positions.push(TetrisGameConstants.GRID_WIDTH / 2);
        this.positions.push(TetrisGameConstants.GRID_WIDTH / 2 + 1);
        break;

    case TetrisPieceType.I:
        this.positions.push(TetrisGameConstants.GRID_WIDTH / 2);
        this.positions.push(-TetrisGameConstants.GRID_WIDTH / 2);
        this.positions.push(-TetrisGameConstants.GRID_WIDTH / 2 - TetrisGameConstants.GRID_HEIGHT);
        this.positions.push(-TetrisGameConstants.GRID_WIDTH / 2 - TetrisGameConstants.GRID_HEIGHT * 2);
        break;
    // TODO: Nexts pieces are not correct
    case TetrisPieceType.T:
        this.positions.push(TetrisGameConstants.GRID_WIDTH / 2);
        this.positions.push(-TetrisGameConstants.GRID_WIDTH / 2);
        this.positions.push(-TetrisGameConstants.GRID_WIDTH / 2 - TetrisGameConstants.GRID_HEIGHT);
        this.positions.push(-TetrisGameConstants.GRID_WIDTH / 2 - TetrisGameConstants.GRID_HEIGHT * 2);
        break;
    case TetrisPieceType.L:
        this.positions.push(TetrisGameConstants.GRID_WIDTH / 2);
        this.positions.push(-TetrisGameConstants.GRID_WIDTH / 2);
        this.positions.push(-TetrisGameConstants.GRID_WIDTH / 2 - TetrisGameConstants.GRID_HEIGHT);
        this.positions.push(-TetrisGameConstants.GRID_WIDTH / 2 - TetrisGameConstants.GRID_HEIGHT * 2);
        break;
    case TetrisPieceType.N:
        this.positions.push(TetrisGameConstants.GRID_WIDTH / 2);
        this.positions.push(-TetrisGameConstants.GRID_WIDTH / 2);
        this.positions.push(-TetrisGameConstants.GRID_WIDTH / 2 - TetrisGameConstants.GRID_HEIGHT);
        this.positions.push(-TetrisGameConstants.GRID_WIDTH / 2 - TetrisGameConstants.GRID_HEIGHT * 2);
        break;
    case TetrisPieceType.ReverseL:
        this.positions.push(TetrisGameConstants.GRID_WIDTH / 2);
        this.positions.push(-TetrisGameConstants.GRID_WIDTH / 2);
        this.positions.push(-TetrisGameConstants.GRID_WIDTH / 2 - TetrisGameConstants.GRID_HEIGHT);
        this.positions.push(-TetrisGameConstants.GRID_WIDTH / 2 - TetrisGameConstants.GRID_HEIGHT * 2);
        break;
    case TetrisPieceType.ReverseN:
        this.positions.push(TetrisGameConstants.GRID_WIDTH / 2);
        this.positions.push(-TetrisGameConstants.GRID_WIDTH / 2);
        this.positions.push(-TetrisGameConstants.GRID_WIDTH / 2 - TetrisGameConstants.GRID_HEIGHT);
        this.positions.push(-TetrisGameConstants.GRID_WIDTH / 2 - TetrisGameConstants.GRID_HEIGHT * 2);
        break;
}

*/
