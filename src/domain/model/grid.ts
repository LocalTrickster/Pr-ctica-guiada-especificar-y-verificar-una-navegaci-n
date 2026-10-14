export interface GridPoint {
  readonly x: number;
  readonly y: number;
}

export interface GridMap {
  readonly width: number;
  readonly height: number;
  readonly blocked: ReadonlySet<string>;
  readonly entryCosts: ReadonlyMap<string, number>;
}

export interface GridCellEntryCost {
  readonly point: GridPoint;
  readonly cost: number;
}

export function cellKey(point: GridPoint): string {
  return `${point.x},${point.y}`;
}

export function createGridMap(
  width: number,
  height: number,
  blockedCells: Iterable<GridPoint>,
  entryCosts: Iterable<GridCellEntryCost> = [],
): GridMap {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
    throw new Error("Grid dimensions must be positive integers.");
  }

  const blocked = new Set<string>();
  for (const point of blockedCells) {
    if (!isInside({ width, height }, point)) {
      throw new Error(`Blocked cell is outside the grid: ${cellKey(point)}.`);
    }
    blocked.add(cellKey(point));
  }

  const costs = new Map<string, number>();
  for (const { point, cost } of entryCosts) {
    const key = cellKey(point);
    if (!isInside({ width, height }, point) || blocked.has(key)) {
      throw new Error(`Entry cost cell must be walkable and inside the grid: ${key}.`);
    }
    if (!Number.isFinite(cost) || cost <= 0) {
      throw new Error(`Entry cost must be finite and positive for cell ${key}.`);
    }
    if (costs.has(key)) {
      throw new Error(`Entry cost is configured more than once for cell ${key}.`);
    }
    costs.set(key, cost);
  }

  return { width, height, blocked, entryCosts: costs };
}

export function cellEntryCost(map: GridMap, point: GridPoint): number {
  return map.entryCosts.get(cellKey(point)) ?? 1;
}

export function minimumCellEntryCost(map: GridMap): number {
  let minimum = 1;
  for (const cost of map.entryCosts.values()) {
    minimum = Math.min(minimum, cost);
  }
  return minimum;
}

export function isInside(
  map: Pick<GridMap, "width" | "height">,
  point: GridPoint,
): boolean {
  return Number.isInteger(point.x)
    && Number.isInteger(point.y)
    && point.x >= 0
    && point.y >= 0
    && point.x < map.width
    && point.y < map.height;
}

export function isWalkable(map: GridMap, point: GridPoint): boolean {
  return isInside(map, point) && !map.blocked.has(cellKey(point));
}

export function cellCenter(point: GridPoint, tileSize: number): GridPoint {
  assertValidTileSize(tileSize);
  if (!Number.isInteger(point.x) || !Number.isInteger(point.y)) {
    throw new Error("Grid coordinates must be integers.");
  }
  return {
    x: point.x * tileSize + tileSize / 2,
    y: point.y * tileSize + tileSize / 2,
  };
}

export function worldToCell(point: GridPoint, tileSize: number): GridPoint {
  assertValidTileSize(tileSize);
  if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
    throw new Error("World coordinates must be finite.");
  }
  return {
    x: Math.floor(point.x / tileSize),
    y: Math.floor(point.y / tileSize),
  };
}

function assertValidTileSize(tileSize: number): void {
  if (!Number.isFinite(tileSize) || tileSize <= 0) {
    throw new Error("Tile size must be finite and positive.");
  }
}
