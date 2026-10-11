import { describe, expect, it } from "vitest";
import type { InitApi } from "@clockwyrks/simple-2d";
import { TURN_COUNT } from "./constants";
import { type CascadeDebugApi, type CascadeState, game } from "./game";

function harness(): [CascadeState, CascadeDebugApi] {
  const api = {
    input: { register() {}, layout: () => null },
    audio: { define() {}, load: async () => {} },
    assets: {
      loadImage: async () => {
        throw new Error("unused");
      },
      loadAudio: async () => {
        throw new Error("unused");
      },
      load: async () => new Blob(),
      resolve: (path: string) => path,
    },
    diagnostics: { register() {} },
    events: { on: () => () => {} },
    viewport: () => ({
      width: 1280,
      height: 720,
      scale: 1,
      offsetX: 0,
      offsetY: 0,
    }),
  } satisfies InitApi<CascadeState>;
  const initialized = game.initialize(api);
  if (initialized instanceof Promise)
    throw new Error("Cascade initializes synchronously");
  return initialized;
}

describe("Cascade rules", () => {
  it("deals a full Klondike board", () => {
    const [state, debug] = harness();
    const dealt = debug.deal(state);
    const snap = debug.snapshot(dealt);

    expect(snap.stock).toHaveLength(24);
    expect(snap.tableau.map((pile) => pile.length)).toEqual([
      1, 2, 3, 4, 5, 6, 7,
    ]);
    expect(snap.tableau.every((pile) => pile[pile.length - 1]?.faceUp)).toBe(
      true,
    );
    expect(snap.tableau.flat().filter((card) => card.faceUp)).toHaveLength(7);
  });

  it("turns draw-three stock sets and recycles in the same order", () => {
    const [initial, debug] = harness();
    let state = initial;
    state = debug.clearTable(state);
    state = debug.addCard(state, "stock", 0, "spades", 1, false);
    state = debug.addCard(state, "stock", 0, "hearts", 2, false);
    state = debug.addCard(state, "stock", 0, "clubs", 3, false);
    state = debug.addCard(state, "stock", 0, "diamonds", 4, false);

    state = debug.turnStock(state);
    expect(debug.snapshot(state).wasteSets).toEqual([TURN_COUNT]);
    expect(debug.snapshot(state).waste.map((card) => card.rank)).toEqual([
      4, 3, 2,
    ]);

    state = debug.turnStock(state);
    expect(debug.snapshot(state).wasteSets).toEqual([3, 1]);

    state = debug.turnStock(state);
    expect(debug.snapshot(state).stock.map((card) => card.rank)).toEqual([
      1, 2, 3, 4,
    ]);
    expect(debug.snapshot(state).waste).toHaveLength(0);
    expect(debug.snapshot(state).wasteSets).toEqual([]);
  });

  it("moves tableau runs and flips the exposed card", () => {
    const [initial, debug] = harness();
    let state = initial;
    state = debug.clearTable(state);
    state = debug.addCard(state, "tableau", 0, "spades", 9, false);
    state = debug.addCard(state, "tableau", 0, "hearts", 8, true);
    state = debug.addCard(state, "tableau", 1, "clubs", 9, true);

    const [moved, accepted] = debug.move(state, "tableau", 0, 1, "tableau", 1);
    const snap = debug.snapshot(moved);

    expect(accepted).toBe(true);
    expect(snap.tableau[0]).toMatchObject([{ rank: 9, faceUp: true }]);
    expect(snap.tableau[1].map((card) => card.rank)).toEqual([9, 8]);
  });

  it("auto-moves a playable card home", () => {
    const [initial, debug] = harness();
    let state = initial;
    state = debug.clearTable(state);
    state = debug.addCard(state, "tableau", 0, "hearts", 1, true);

    const [moved, accepted] = debug.autoMove(state, "tableau", 0);
    const snap = debug.snapshot(moved);

    expect(accepted).toBe(true);
    expect(snap.foundations[0]).toMatchObject([{ suit: "hearts", rank: 1 }]);
    expect(snap.tableau[0]).toHaveLength(0);
  });

  it("advances flyers with gravity and stamps trails", () => {
    const [initial, debug] = harness();
    let state = initial;
    state = debug.addFlyer(state, "clubs", 7, 100, 100, 50, 0);

    const stepped = game.update(state, fakeUpdateApi(), 0.5);
    const snap = debug.snapshot(stepped);

    expect(snap.flyers[0]).toMatchObject({ x: 125, y: 550, vy: 900 });
    expect(snap.trailStamps).toBe(1);
    expect(snap.simTime).toBe(0.5);
  });
});

function fakeUpdateApi() {
  const pressed = () => false;
  return {
    input: {
      value: () => 0,
      pressed,
      pointer: () => ({
        x: 0,
        y: 0,
        down: false,
        device: "mouse" as const,
        buttons: [],
      }),
      pointerPressed: pressed,
      pointerReleased: pressed,
      pointerSamples: () => [],
      pointerContacts: () => [],
      wheel: () => ({ x: 0, y: 0 }),
    },
    audio: {
      play() {},
      loop() {},
      stop() {},
      looping: () => false,
      setMuted() {},
      muted: () => false,
    },
    frame: () => ({ count: 0, timeMs: 0, lastDeltaMs: 0 }),
    viewport: () => ({
      width: 1280,
      height: 720,
      scale: 1,
      offsetX: 0,
      offsetY: 0,
    }),
  };
}
