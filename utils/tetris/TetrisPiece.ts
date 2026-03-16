import { TetrisGameConstants } from "./TetrisConstants";
import { TetrisGrid, Coordinate } from "./TetrisGrid";

export enum TetrisPieceType {
  L,
  ReverseL,
  I,
  Cube,
  N,
  ReverseN,
  T,
}

export enum TryFallResult {
  Fell,
  Stuck,
  Lost,
}

enum PieceOrientation {
  Zero,
  Ninety,
  OneEighty,
  MinusNinty,
}
type KickOffsets = Coordinate[];

// For most pieces (T, L, J, S, Z)
const STANDARD_KICK_OFFSETS: { [key: number]: KickOffsets } = {
  0: [
    [0, 0],
    [-1, 0],
    [-1, 1],
    [0, -2],
    [-1, -2],
  ], // 0 -> 90
  1: [
    [0, 0],
    [1, 0],
    [1, -1],
    [0, 2],
    [1, 2],
  ], // 90 -> 180
  2: [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, -2],
    [1, -2],
  ], // 180 -> 270
  3: [
    [0, 0],
    [-1, 0],
    [-1, -1],
    [0, 2],
    [-1, 2],
  ], // 270 -> 0
};

// For I piece (wider, different offsets)
const I_PIECE_KICK_OFFSETS: { [key: number]: KickOffsets } = {
  0: [
    [0, 0],
    [-2, 0],
    [1, 0],
    [-2, -1],
    [1, 2],
  ],
  1: [
    [0, 0],
    [-1, 0],
    [2, 0],
    [-1, 2],
    [2, -1],
  ],
  2: [
    [0, 0],
    [2, 0],
    [-1, 0],
    [2, 1],
    [-1, -2],
  ],
  3: [
    [0, 0],
    [1, 0],
    [-2, 0],
    [1, -2],
    [-2, 1],
  ],
};

// Cube doesn't rotate
const CUBE_KICK_OFFSETS: { [key: number]: KickOffsets } = {
  0: [[0, 0]],
};

export function getRandomEnumValue<T>(enumObj: any): T {
  const values = Object.values(enumObj).filter((v) => typeof v === "number");
  return values[Math.floor(Math.random() * values.length)] as T;
}

function getKickOffsetsForPiece(
  type: TetrisPieceType,
  fromRotation: PieceOrientation,
  toRotation: PieceOrientation,
): KickOffsets {
  // Map rotations to indices (0-3)
  const rotationIndex = fromRotation; // Already 0-3

  const offsetMap =
    type === TetrisPieceType.I
      ? I_PIECE_KICK_OFFSETS
      : type === TetrisPieceType.Cube
        ? CUBE_KICK_OFFSETS
        : STANDARD_KICK_OFFSETS;

  return offsetMap[rotationIndex] || [[0, 0]];
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

function getPiecePositions(
  orientation: PieceOrientation,
  position: Coordinate,
  type: TetrisPieceType,
): Coordinate[] {
  let x = position[0];
  let y = position[1];
  if (type === TetrisPieceType.Cube) {
    return [position, [x + 1, y], [x, y + 1], [x + 1, y + 1]];
  } else if (type === TetrisPieceType.I) {
    if (
      orientation === PieceOrientation.MinusNinty ||
      orientation === PieceOrientation.Ninety
    ) {
      if (x >= TetrisGameConstants.GRID_WIDTH - 2)
        x = TetrisGameConstants.GRID_WIDTH - 3;
      if (x == 0) x = 1;
      return [
        [x, y],
        [x - 1, y],
        [x + 1, y],
        [x + 2, y],
      ];
    } else {
      if (y >= TetrisGameConstants.GRID_HEIGHT - 2)
        y = TetrisGameConstants.GRID_HEIGHT - 3;
      return [
        [x, y],
        [x, y - 1],
        [x, y + 1],
        [x, y + 2],
      ];
    }
  } else if (type === TetrisPieceType.T) {
    switch (orientation) {
      case PieceOrientation.Zero:
        if (x + 1 >= TetrisGameConstants.GRID_WIDTH)
          x = TetrisGameConstants.GRID_WIDTH - 2;
        if (y + 1 >= TetrisGameConstants.GRID_HEIGHT)
          y = TetrisGameConstants.GRID_HEIGHT - 2;
        return [
          [x, y],
          [x + 1, y],
          [x, y - 1],
          [x, y + 1],
        ];

      case PieceOrientation.Ninety:
        if (x + 1 >= TetrisGameConstants.GRID_WIDTH)
          x = TetrisGameConstants.GRID_WIDTH - 2;
        if (x == 0) x = 1;
        if (y + 1 >= TetrisGameConstants.GRID_HEIGHT)
          y = TetrisGameConstants.GRID_HEIGHT - 2;
        return [
          [x, y],
          [x - 1, y],
          [x + 1, y],
          [x, y + 1],
        ];

      case PieceOrientation.OneEighty:
        if (x == 0) x = 1;
        if (y + 1 >= TetrisGameConstants.GRID_HEIGHT)
          y = TetrisGameConstants.GRID_HEIGHT - 2;
        return [
          [x, y],
          [x - 1, y],
          [x, y - 1],
          [x, y + 1],
        ];

      case PieceOrientation.MinusNinty:
        if (x + 1 >= TetrisGameConstants.GRID_WIDTH)
          x = TetrisGameConstants.GRID_WIDTH - 2;
        if (x == 0) x = 1;
        return [
          [x, y],
          [x - 1, y],
          [x + 1, y],
          [x, y - 1],
        ];
    }
  } else if (type === TetrisPieceType.N) {
    switch (orientation) {
      case PieceOrientation.Zero:
      case PieceOrientation.OneEighty: {
        if (x == 0) x = 1;
        return [
          [x, y],
          [x, y - 1],
          [x - 1, y],
          [x - 1, y + 1],
        ];
      }
      case PieceOrientation.MinusNinty:
      case PieceOrientation.Ninety: {
        if (x == 0) x = 1;
        if (x + 1 >= TetrisGameConstants.GRID_WIDTH)
          x = TetrisGameConstants.GRID_WIDTH - 2;
        if (y + 1 >= TetrisGameConstants.GRID_HEIGHT)
          y = TetrisGameConstants.GRID_HEIGHT - 2;
        return [
          [x, y],
          [x - 1, y],
          [x, y + 1],
          [x + 1, y + 1],
        ];
      }
    }
  } else if (type === TetrisPieceType.ReverseN) {
    switch (orientation) {
      case PieceOrientation.Zero:
      case PieceOrientation.OneEighty: {
        if (x + 1 >= TetrisGameConstants.GRID_WIDTH)
          x = TetrisGameConstants.GRID_WIDTH - 2;
        if (y + 1 >= TetrisGameConstants.GRID_HEIGHT)
          y = TetrisGameConstants.GRID_HEIGHT - 2;
        return [
          [x, y],
          [x, y - 1],
          [x + 1, y],
          [x + 1, y + 1],
        ];
      }
      case PieceOrientation.MinusNinty:
      case PieceOrientation.Ninety: {
        if (x == 0) x = 1;
        if (x + 1 >= TetrisGameConstants.GRID_WIDTH)
          x = TetrisGameConstants.GRID_WIDTH - 2;
        if (y + 1 >= TetrisGameConstants.GRID_HEIGHT)
          y = TetrisGameConstants.GRID_HEIGHT - 2;
        return [
          [x, y],
          [x + 1, y],
          [x, y + 1],
          [x - 1, y + 1],
        ];
      }
    }
  } else if (type === TetrisPieceType.L) {
    switch (orientation) {
      case PieceOrientation.Zero:
        if (x >= TetrisGameConstants.GRID_WIDTH - 1)
          x = TetrisGameConstants.GRID_WIDTH - 2;
        return [
          [x, y],
          [x + 1, y],
          [x, y - 1],
          [x, y - 2],
        ];

      case PieceOrientation.OneEighty:
        if (x == 0) x = 1;
        if (y >= TetrisGameConstants.GRID_HEIGHT - 2)
          y = TetrisGameConstants.GRID_HEIGHT - 3;
        return [
          [x, y],
          [x - 1, y],
          [x, y + 1],
          [x, y + 2],
        ];

      case PieceOrientation.MinusNinty:
        if (x < 2) x = 2;

        return [
          [x, y],
          [x - 1, y],
          [x - 2, y],
          [x, y - 1],
        ];

      case PieceOrientation.Ninety:
        if (x >= TetrisGameConstants.GRID_WIDTH - 2)
          x = TetrisGameConstants.GRID_WIDTH - 3;
        if (y + 1 >= TetrisGameConstants.GRID_HEIGHT)
          y = TetrisGameConstants.GRID_HEIGHT - 2;
        return [
          [x, y],
          [x + 1, y],
          [x + 2, y],
          [x, y + 1],
        ];
    }
  } else {
    //if (type === TetrisPieceType.ReverseL) {
    switch (orientation) {
      case PieceOrientation.Zero:
        if (x == 0) x = 1;
        return [
          [x, y],
          [x - 1, y],
          [x, y - 1],
          [x, y - 2],
        ];

      case PieceOrientation.OneEighty:
        if (x >= TetrisGameConstants.GRID_WIDTH - 1)
          x = TetrisGameConstants.GRID_WIDTH - 2;
        if (y >= TetrisGameConstants.GRID_HEIGHT - 2)
          y = TetrisGameConstants.GRID_HEIGHT - 3;

        return [
          [x, y],
          [x + 1, y],
          [x, y + 1],
          [x, y + 2],
        ];

      case PieceOrientation.MinusNinty:
        if (x <= 1) x = 2;
        return [
          [x, y],
          [x - 1, y],
          [x - 2, y],
          [x, y + 1],
        ];

      case PieceOrientation.Ninety:
        if (x >= TetrisGameConstants.GRID_WIDTH - 2)
          x = TetrisGameConstants.GRID_WIDTH - 3;
        return [
          [x, y],
          [x + 1, y],
          [x + 2, y],
          [x, y - 1],
        ];
    }
  }
}

export function getPieceColor(type: TetrisPieceType): string {
  switch (type) {
    case TetrisPieceType.Cube:
      return "#00e5ff";
    case TetrisPieceType.I:
      return "#ffff00";
    case TetrisPieceType.L:
      return "#ff0000";
    case TetrisPieceType.N:
      return "#0033ff";
    case TetrisPieceType.ReverseL:
      return "#00ff15";
    case TetrisPieceType.ReverseN:
      return "#f700ff";
    case TetrisPieceType.T:
      return "#00ffcc";
  }
}

export class TetrisPiece {
  readonly type: TetrisPieceType;
  position: Coordinate;
  orientation: PieceOrientation;
  private grid: TetrisGrid;
  readonly color: string;

  constructor(type: TetrisPieceType, grid: TetrisGrid) {
    this.type = type;
    this.grid = grid;
    this.orientation = PieceOrientation.Zero;
    this.position = [TetrisGameConstants.GRID_WIDTH / 2, -2];
    this.color = getPieceColor(type);
  }

  rotate(clockwise: boolean) {
    const nextRotation = getNextRotation(this.orientation, clockwise);
    const currentPositions = getPiecePositions(
      this.orientation,
      this.position,
      this.type,
    );

    if (!currentPositions) return false;

    // Clear current piece
    currentPositions.forEach((index) => {
      this.grid.setValue(index, false);
    });

    // Get kick offsets to try
    const kickOffsets = getKickOffsetsForPiece(
      this.type,
      this.orientation,
      nextRotation,
    );

    // Try each kick offset
    for (const [offsetX, offsetY] of kickOffsets) {
      const testPosition: Coordinate = [
        this.position[0] + offsetX,
        this.position[1] + offsetY,
      ];

      const rotatedPositions = getPiecePositions(
        nextRotation,
        testPosition,
        this.type,
      );

      if (rotatedPositions && this.canOccupyPositions(rotatedPositions)) {
        // Success! Apply the rotation
        rotatedPositions.forEach((index) => {
          this.grid.setValue(index, true, this.color);
        });
        this.position = testPosition;
        this.orientation = nextRotation;
        return true;
      }
    }

    // No kick offset worked, restore original piece
    currentPositions.forEach((index) => {
      this.grid.setValue(index, true, this.color);
    });
    return false;
  }

  tryFall() {
    const currentPositions = getPiecePositions(
      this.orientation,
      this.position,
      this.type,
    );
    currentPositions?.forEach((coord) => {
      this.grid.setValue(coord, false);
    });

    let nextPositions = currentPositions?.map(
      (coord) => [coord[0], coord[1] + 1] as Coordinate,
    );
    let canFall = nextPositions?.every((index) => {
      return !this.grid.value(index);
    });
    if (canFall) {
      nextPositions?.forEach((index) => {
        this.grid.setValue(index, true, this.color);
      });
      this.position[1]++;
      return TryFallResult.Fell;
    } else {
      currentPositions?.forEach((index) => {
        this.grid.setValue(index, true, this.color);
      });
      let isAboveGrid = currentPositions?.some((index) => {
        return index[1] < 0;
      });
      if (isAboveGrid) return TryFallResult.Lost;
      else return TryFallResult.Stuck;
    }
  }

  tryMoveLeft() {
    let currentPositions = getPiecePositions(
      this.orientation,
      this.position,
      this.type,
    );
    if (currentPositions) return this.tryMove(-1, currentPositions);
    return false;
  }

  tryMoveRight() {
    let currentPositions = getPiecePositions(
      this.orientation,
      this.position,
      this.type,
    );
    if (currentPositions) return this.tryMove(1, currentPositions);
    return false;
  }

  tryMove(direction: number, currentPositions: Array<Coordinate>) {
    if (currentPositions) {
      let currentPositionActive = currentPositions.some((index) => {
        return this.grid.value(index);
      });
      if (currentPositionActive)
        currentPositions.forEach((index) => {
          this.grid.setValue(index, false);
        });
      let nextPositions = currentPositions.map(
        (coord) => [coord[0] + 1 * direction, coord[1]] as Coordinate,
      );
      const canMove = nextPositions.every((coord) => {
        return !this.grid.value(coord);
      });
      if (canMove) {
        if (currentPositionActive)
          nextPositions.forEach((index) => {
            this.grid.setValue(index, true, this.color);
          });
        this.position = nextPositions[0];
        return true;
      } else {
        if (currentPositionActive)
          currentPositions.forEach((index) => {
            this.grid.setValue(index, true, this.color);
          });
        return false;
      }
    }
  }

  placeAtBottom() {
    const initalPosition = getPiecePositions(
      this.orientation,
      this.position,
      this.type,
    );
    initalPosition.forEach((index) => {
      this.grid.setValue(index, false);
    });

    let lowestPosition: Coordinate = [
      this.position[0],
      TetrisGameConstants.GRID_HEIGHT - 1,
    ];
    let positions = getPiecePositions(
      this.orientation,
      lowestPosition,
      this.type,
    );
    while (!this.canOccupyPositions(positions)) {
      lowestPosition[1]--;
      positions = getPiecePositions(
        this.orientation,
        lowestPosition,
        this.type,
      );
    }

    if (lowestPosition[1] < this.position[1]) {
      initalPosition.forEach((index) => {
        this.grid.setValue(index, true);
      });
      return;
    }

    positions.forEach((index) => {
      this.grid.setValue(index, true, this.color);
    });
    this.position = lowestPosition;
  }

  getActiveColumns(): number[] {
    const positions = getPiecePositions(
      this.orientation,
      this.position,
      this.type,
    );
    const columns = new Set(positions.map((value) => value[0]));
    console.log(`Active columns:${Array.from(columns)}`);
    return Array.from(columns);
  }

  private canOccupyPositions(positions: Coordinate[]): boolean {
    return positions.every((coord) => !this.grid.value(coord));
  }
}
