import { describe, expect, it } from "vitest";
import {
  cellEntryCost,
  createGridMap,
  isWalkable,
  type GridPoint,
} from "../../src/domain/model/grid";
import { findPathAStar, findPathBfs } from "../../src/domain/navigation/search";

const START: GridPoint = { x: 0, y: 0 };
const GOAL: GridPoint = { x: 4, y: 0 };
const DETOUR_MAP = createGridMap(5, 5, [
  { x: 2, y: 0 },
  { x: 2, y: 1 },
  { x: 2, y: 2 },
  { x: 2, y: 3 },
]);
const BASE_START: GridPoint = { x: 0, y: 1 };
const BASE_GOAL: GridPoint = { x: 4, y: 1 };
const BASE_MAP = createGridMap(5, 3, []);
const SLOW_TERRAIN_MAP = createGridMap(5, 3, [], [
  { point: { x: 1, y: 1 }, cost: 5 },
  { point: { x: 2, y: 1 }, cost: 5 },
  { point: { x: 3, y: 1 }, cost: 5 },
]);

describe.each([
  ["BFS", findPathBfs],
  ["A*", findPathAStar],
] as const)("%s", (_name, findPath) => {
  it("finds an optimal walkable route", () => {
    const result = findPath(DETOUR_MAP, START, GOAL);

    expect(result.status).toBe("success");
    expect(result.totalCost).toBe(12);
    expect(result.path[0]).toEqual(START);
    expect(result.path.at(-1)).toEqual(GOAL);
    expect(result.path.every((point) => isWalkable(DETOUR_MAP, point))).toBe(true);
    expect(result.expandedNodes).toBeGreaterThan(0);
    expect(result.maximumFrontier).toBeGreaterThan(0);
  });

  it("returns a one-cell path when start equals goal", () => {
    const result = findPath(DETOUR_MAP, START, START);

    expect(result.status).toBe("success");
    expect(result.path).toEqual([START]);
    expect(result.totalCost).toBe(0);
    expect(result.explored).toEqual([START]);
    expect(result.expandedNodes).toBe(1);
    expect(result.maximumFrontier).toBe(1);
  });

  it("reports invalid endpoints without exploring", () => {
    const invalidStart = findPath(DETOUR_MAP, { x: -1, y: 0 }, GOAL);
    const invalidGoal = findPath(DETOUR_MAP, START, { x: 2, y: 0 });

    expect(invalidStart.status).toBe("invalid-start");
    expect(invalidGoal.status).toBe("invalid-goal");
    expect(invalidGoal.expandedNodes).toBe(0);
  });

  it("reports an unreachable goal explicitly", () => {
    const splitMap = createGridMap(3, 3, [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
    ]);
    const result = findPath(splitMap, { x: 0, y: 1 }, { x: 2, y: 1 });

    expect(result.status).toBe("unreachable");
    expect(result.path).toEqual([]);
    expect(result.totalCost).toBeNull();
    expect(result.expandedNodes).toBe(3);
    expect(result.maximumFrontier).toBe(2);
    expect(result.explored).toEqual([
      { x: 0, y: 1 },
      { x: 0, y: 0 },
      { x: 0, y: 2 },
    ]);
  });
});

describe("algorithm comparison", () => {
  it("A* preserves optimal cost while expanding no more nodes than BFS", () => {
    const bfs = findPathBfs(DETOUR_MAP, START, GOAL);
    const astar = findPathAStar(DETOUR_MAP, START, GOAL);

    expect(astar.totalCost).toBe(bfs.totalCost);
    expect(astar.expandedNodes).toBeLessThanOrEqual(bfs.expandedNodes);
  });

  it("compares BFS and A* on the common 5x3 unit-cost fixture", () => {
    const bfs = findPathBfs(BASE_MAP, BASE_START, BASE_GOAL);
    const astar = findPathAStar(BASE_MAP, BASE_START, BASE_GOAL);

    for (const result of [bfs, astar]) {
      expect(result.status).toBe("success");
      expect(result.path[0]).toEqual(BASE_START);
      expect(result.path.at(-1)).toEqual(BASE_GOAL);
      expect(result.path.length - 1).toBe(4);
      expect(result.totalCost).toBe(4);
      expect(result.path.every((point) => isWalkable(BASE_MAP, point))).toBe(true);
    }
    expect(bfs.expandedNodes).toBe(12);
    expect(bfs.maximumFrontier).toBe(4);
    expect(astar.expandedNodes).toBe(5);
    expect(astar.maximumFrontier).toBe(9);
  });

  it("distinguishes the common fixture's unreachable and invalid endpoint cases", () => {
    const splitMap = createGridMap(5, 3, [
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
    ]);

    for (const findPath of [findPathBfs, findPathAStar]) {
      const sameCell = findPath(BASE_MAP, BASE_START, BASE_START);
      const unreachable = findPath(splitMap, BASE_START, BASE_GOAL);
      const invalidStart = findPath(BASE_MAP, { x: -1, y: 1 }, BASE_GOAL);
      const invalidGoal = findPath(BASE_MAP, BASE_START, { x: 5, y: 1 });

      expect(sameCell.status).toBe("success");
      expect(sameCell.path).toEqual([BASE_START]);
      expect(sameCell.totalCost).toBe(0);
      expect(unreachable.status).toBe("unreachable");
      expect(unreachable.path).toEqual([]);
      expect(unreachable.totalCost).toBeNull();
      expect(invalidStart.status).toBe("invalid-start");
      expect(invalidGoal.status).toBe("invalid-goal");
    }
  });

  it("uses entry costs in A* while BFS remains unit-cost", () => {
    const bfs = findPathBfs(SLOW_TERRAIN_MAP, BASE_START, BASE_GOAL);
    const astar = findPathAStar(SLOW_TERRAIN_MAP, BASE_START, BASE_GOAL);
    const directCost = [1, 2, 3, 4].reduce(
      (cost, x) => cost + (x < 4 ? 5 : 1),
      0,
    );

    expect(directCost).toBe(16);
    expect(bfs.path.length - 1).toBe(4);
    expect(bfs.totalCost).toBe(4);
    expect(astar.status).toBe("success");
    expect(astar.path.length - 1).toBe(6);
    expect(astar.totalCost).toBe(6);
    expect(astar.path).not.toContainEqual({ x: 1, y: 1 });
    expect(astar.path).not.toContainEqual({ x: 2, y: 1 });
    expect(astar.path).not.toContainEqual({ x: 3, y: 1 });
    expect(
      astar.path.slice(1).reduce((cost, point) => cost + cellEntryCost(SLOW_TERRAIN_MAP, point), 0),
    ).toBe(astar.totalCost);
  });

  it("uses fresh unit costs when the slow-terrain map is replaced", () => {
    const restoredMap = createGridMap(5, 3, []);
    const result = findPathAStar(restoredMap, BASE_START, BASE_GOAL);

    expect(result.status).toBe("success");
    expect(result.path.length - 1).toBe(4);
    expect(result.totalCost).toBe(4);
  });
});
