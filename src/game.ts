import type {
  Game,
  InitApi,
  PointerSample,
  RenderApi,
  UpdateApi,
} from "@clockwyrks/simple-2d";
import type { DeepReadonly } from "ts-essentials";
import {
  BOUNCE_DAMP,
  CARD_H,
  CARD_W,
  CASCADE_DEBUG_VERSION,
  COLUMN_BOTTOM_LIMIT,
  COLUMN_X,
  CUES,
  DEAL_MODE,
  DEAL_MODE_LABEL,
  DECK_SIZE,
  DOUBLE_CLICK_SLOP,
  DOUBLE_CLICK_WINDOW,
  DRAG_THRESHOLD,
  FACE_DOWN_OFFSET,
  FACE_UP_OFFSET,
  FACE_UP_OFFSET_MIN,
  FLOOR_Y,
  FOUNDATION_COUNT,
  FOUNDATION_X,
  GRAVITY,
  HOWTO_BACK_LABEL,
  HUD_H,
  HUD_ITEMS,
  HUD_Y,
  LAUNCH_INTERVAL,
  LAUNCH_VX_MAX,
  LAUNCH_VX_MIN,
  LAUNCH_VY,
  MENU_BACK,
  MENU_BINDINGS,
  MENU_CONFIRM,
  MENU_DOWN,
  MENU_UP,
  RANK_MAX,
  RANK_MIN,
  STAGE_H,
  STAGE_W,
  STOCK_X,
  SUITS,
  TABLEAU_COLUMNS,
  TABLEAU_Y,
  TAGLINE_TEXT,
  TITLE_ITEMS,
  TITLE_TEXT,
  TOP_ROW_Y,
  TURN_COUNT,
  WASTE_FAN,
  WASTE_X,
  WIN_TEXT,
} from "./constants";

export type Screen = "title" | "howto" | "playing" | "won";
export type Suit = "spades" | "hearts" | "diamonds" | "clubs";
export type PileKind = "stock" | "waste" | "foundation" | "tableau";

export interface CardState {
  readonly id: number;
  readonly suit: Suit;
  readonly rank: number;
  readonly faceUp: boolean;
}

export interface DragState {
  readonly cards: readonly CardState[];
  readonly fromPile: "waste" | "foundation" | "tableau";
  readonly fromIndex: number;
  readonly x: number;
  readonly y: number;
}

export interface DropTargetState {
  readonly pile: "foundation" | "tableau";
  readonly index: number;
}

export interface PointerState {
  readonly x: number;
  readonly y: number;
  readonly down: boolean;
}

export interface PressState {
  readonly x: number;
  readonly y: number;
  readonly at: number;
}

export interface FlyerState {
  readonly id: number;
  readonly suit: Suit;
  readonly rank: number;
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
}

export interface CascadeState {
  readonly screen: Screen;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly stock: readonly CardState[];
  readonly waste: readonly CardState[];
  readonly wasteSets: readonly number[];
  readonly foundations: readonly (readonly CardState[])[];
  readonly tableau: readonly (readonly CardState[])[];
  readonly drag: DragState | null;
  readonly dropTarget: DropTargetState | null;
  readonly pointer: PointerState;
  readonly lastPress: PressState | null;
  readonly autoFlip: boolean;
  readonly winDetect: boolean;
  readonly launching: boolean;
  readonly trailPainting: boolean;
  readonly launchClock: number;
  readonly launched: number;
  readonly flyers: readonly FlyerState[];
  readonly cascadeDone: boolean;
  readonly trailStamps: number;
  readonly nextId: number;
  readonly simTime: number;
  readonly muted: boolean;
}

type CardColor = "red" | "black";

export interface SnapshotCard extends CardState {
  readonly color: CardColor;
}

export interface Rect {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

export interface CascadeSnapshot {
  readonly version: number;
  readonly screen: Screen;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly dealMode: string;
  readonly turnCount: number;
  readonly dealModeLabel: string;
  readonly muted: boolean;
  readonly autoFlip: boolean;
  readonly winDetect: boolean;
  readonly launching: boolean;
  readonly trailPainting: boolean;
  readonly stock: readonly SnapshotCard[];
  readonly waste: readonly SnapshotCard[];
  readonly wasteSets: readonly number[];
  readonly wasteVisibleCount: number;
  readonly foundations: readonly (readonly SnapshotCard[])[];
  readonly tableau: readonly (readonly SnapshotCard[])[];
  readonly drag: null | {
    readonly cards: readonly SnapshotCard[];
    readonly fromPile: "waste" | "foundation" | "tableau";
    readonly fromIndex: number;
    readonly x: number;
    readonly y: number;
  };
  readonly dropTarget: DropTargetState | null;
  readonly pointer: PointerState;
  readonly lastPress: PressState | null;
  readonly launchClock: number;
  readonly launched: number;
  readonly flyers: readonly FlyerState[];
  readonly cascadeDone: boolean;
  readonly trailStamps: number;
  readonly simTime: number;
}

export interface CascadeDebugApi {
  readonly version: number;
  reset(state: DeepReadonly<CascadeState>): CascadeState;
  snapshot(state: DeepReadonly<CascadeState>): CascadeSnapshot;
  reconcile(state: DeepReadonly<CascadeState>): CascadeState;
  menuItemRect(state: DeepReadonly<CascadeState>, index: number): Rect | null;
  setScreen(state: DeepReadonly<CascadeState>, screen: Screen): CascadeState;
  setMenuIndex(state: DeepReadonly<CascadeState>, index: number): CascadeState;
  setTitleIndex(state: DeepReadonly<CascadeState>, index: number): CascadeState;
  addCard(
    state: DeepReadonly<CascadeState>,
    pile: PileKind,
    index: number,
    suit: Suit,
    rank: number,
    faceUp: boolean,
  ): CascadeState;
  removeCard(state: DeepReadonly<CascadeState>, id: number): CascadeState;
  setCardFaceUp(
    state: DeepReadonly<CascadeState>,
    id: number,
    faceUp: boolean,
  ): CascadeState;
  clearPile(
    state: DeepReadonly<CascadeState>,
    pile: PileKind,
    index: number,
  ): CascadeState;
  clearTable(state: DeepReadonly<CascadeState>): CascadeState;
  addWasteSet(state: DeepReadonly<CascadeState>, count: number): CascadeState;
  clearWasteSets(state: DeepReadonly<CascadeState>): CascadeState;
  deal(state: DeepReadonly<CascadeState>): CascadeState;
  turnStock(state: DeepReadonly<CascadeState>): CascadeState;
  move(
    state: DeepReadonly<CascadeState>,
    fromPile: PileKind,
    fromIndex: number,
    fromRow: number,
    toPile: PileKind,
    toIndex: number,
  ): [CascadeState, boolean];
  autoMove(
    state: DeepReadonly<CascadeState>,
    pile: PileKind,
    index: number,
  ): [CascadeState, boolean];
  pointerDown(
    state: DeepReadonly<CascadeState>,
    x: number,
    y: number,
  ): CascadeState;
  pointerMove(
    state: DeepReadonly<CascadeState>,
    x: number,
    y: number,
  ): CascadeState;
  pointerUp(
    state: DeepReadonly<CascadeState>,
    x: number,
    y: number,
  ): CascadeState;
  setAutoFlip(
    state: DeepReadonly<CascadeState>,
    enabled: boolean,
  ): CascadeState;
  setWinDetect(
    state: DeepReadonly<CascadeState>,
    enabled: boolean,
  ): CascadeState;
  setLaunching(
    state: DeepReadonly<CascadeState>,
    enabled: boolean,
  ): CascadeState;
  setTrailPainting(
    state: DeepReadonly<CascadeState>,
    enabled: boolean,
  ): CascadeState;
  addFlyer(
    state: DeepReadonly<CascadeState>,
    suit: Suit,
    rank: number,
    x: number,
    y: number,
    vx: number,
    vy: number,
  ): CascadeState;
  setFlyerPosition(
    state: DeepReadonly<CascadeState>,
    id: number,
    x: number,
    y: number,
  ): CascadeState;
  setFlyerVelocity(
    state: DeepReadonly<CascadeState>,
    id: number,
    vx: number,
    vy: number,
  ): CascadeState;
  removeFlyer(state: DeepReadonly<CascadeState>, id: number): CascadeState;
  clearFlyers(state: DeepReadonly<CascadeState>): CascadeState;
  setLaunchClock(
    state: DeepReadonly<CascadeState>,
    seconds: number,
  ): CascadeState;
  clearTrail(state: DeepReadonly<CascadeState>): CascadeState;
  drawLaunchVx(): number;
}

export const BACKGROUND = "#124734";

type CuedState = readonly [CascadeState, ReadonlySet<string>];

interface TrailStamp {
  readonly suit: Suit;
  readonly rank: number;
  readonly x: number;
  readonly y: number;
}

const CARD_RADIUS = 9;
const TRAIL_LIMIT = 900;
const RED = "#c73845";
const BLACK = "#20262b";
const CARD_FACE = "#fffaf0";
const CARD_EDGE = "#d4cab6";
const GOLD = "#f3c75f";
const TABLE_DARK = "#0f3a2d";
const PANEL = "rgba(10, 28, 24, 0.82)";
const CONTROL_W = 150;
const CONTROL_H = 28;
const CONTROL_GAP = 18;
const trailLayer: TrailStamp[] = [];

function asState(state: DeepReadonly<CascadeState>): CascadeState {
  return state as CascadeState;
}

function cardColor(card: Pick<CardState, "suit">): CardColor {
  return card.suit === "hearts" || card.suit === "diamonds" ? "red" : "black";
}

function suitGlyph(suit: Suit): string {
  return { spades: "♠", hearts: "♥", diamonds: "♦", clubs: "♣" }[suit];
}

function rankLabel(rank: number): string {
  return { 1: "A", 11: "J", 12: "Q", 13: "K" }[rank] ?? String(rank);
}

function assertSuit(suit: Suit): void {
  if (!(SUITS as readonly string[]).includes(suit))
    throw new Error(`Unknown suit ${suit}`);
}

function assertRank(rank: number): void {
  if (!Number.isInteger(rank) || rank < RANK_MIN || rank > RANK_MAX) {
    throw new Error(`Invalid rank ${rank}`);
  }
}

function assertWhole(value: number, name: string): void {
  if (!Number.isInteger(value) || value < 0)
    throw new Error(`${name} must be whole`);
}

function emptyFoundations(): readonly (readonly CardState[])[] {
  return Array.from(
    { length: FOUNDATION_COUNT },
    () => [] as readonly CardState[],
  );
}

function emptyTableau(): readonly (readonly CardState[])[] {
  return Array.from(
    { length: TABLEAU_COLUMNS },
    () => [] as readonly CardState[],
  );
}

function freshState(muted = false): CascadeState {
  return {
    screen: "title",
    menuIndex: 0,
    titleIndex: 0,
    stock: [],
    waste: [],
    wasteSets: [],
    foundations: emptyFoundations(),
    tableau: emptyTableau(),
    drag: null,
    dropTarget: null,
    pointer: { x: 0, y: 0, down: false },
    lastPress: null,
    autoFlip: true,
    winDetect: true,
    launching: true,
    trailPainting: true,
    launchClock: 0,
    launched: 0,
    flyers: [],
    cascadeDone: false,
    trailStamps: 0,
    nextId: 1,
    simTime: 0,
    muted,
  };
}

function buildDeck(nextId: number): readonly CardState[] {
  const deck: CardState[] = [];
  let id = nextId;
  for (const suit of SUITS) {
    for (let rank = RANK_MIN; rank <= RANK_MAX; rank += 1) {
      deck.push({ id, suit, rank, faceUp: false });
      id += 1;
    }
  }
  return deck;
}

function shuffle(cards: readonly CardState[]): CardState[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}

function dealState(state: DeepReadonly<CascadeState>): CascadeState {
  trailLayer.length = 0;
  const deck = shuffle(buildDeck(state.nextId));
  let cursor = 0;
  const tableau: CardState[][] = [];
  for (let col = 0; col < TABLEAU_COLUMNS; col += 1) {
    const pile: CardState[] = [];
    for (let row = 0; row <= col; row += 1) {
      pile.push({ ...deck[cursor]!, faceUp: row === col });
      cursor += 1;
    }
    tableau.push(pile);
  }
  return {
    ...asState(state),
    stock: deck.slice(cursor).map((card) => ({ ...card, faceUp: false })),
    waste: [],
    wasteSets: [],
    foundations: emptyFoundations(),
    tableau,
    drag: null,
    dropTarget: null,
    launchClock: 0,
    launched: 0,
    flyers: [],
    cascadeDone: false,
    trailStamps: 0,
    nextId: state.nextId + DECK_SIZE,
  };
}

function menuCount(screen: Screen): number {
  if (screen === "title") return TITLE_ITEMS.length;
  if (screen === "howto") return 1;
  if (screen === "playing") return HUD_ITEMS.length;
  return 0;
}

function menuRectFor(screen: Screen, index: number): Rect | null {
  if (!Number.isInteger(index) || index < 0 || index >= menuCount(screen))
    return null;
  if (screen === "title") return { x: 510, y: 382 + index * 64, w: 260, h: 48 };
  if (screen === "howto") return { x: 562, y: 604, w: 156, h: 44 };
  if (screen === "playing") {
    return {
      x: 32 + index * (CONTROL_W + CONTROL_GAP),
      y: HUD_Y + 4,
      w: CONTROL_W,
      h: CONTROL_H,
    };
  }
  return null;
}

function pointInRect(x: number, y: number, rect: Rect): boolean {
  return (
    x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h
  );
}

function menuIndexAt(
  state: DeepReadonly<CascadeState>,
  x: number,
  y: number,
): number | null {
  for (let i = 0; i < menuCount(state.screen); i += 1) {
    const rect = menuRectFor(state.screen, i);
    if (rect && pointInRect(x, y, rect)) return i;
  }
  return null;
}

function stockRect(): Rect {
  return { x: STOCK_X, y: TOP_ROW_Y, w: CARD_W, h: CARD_H };
}

function wasteRect(): Rect {
  return { x: WASTE_X, y: TOP_ROW_Y, w: CARD_W, h: CARD_H };
}

function foundationRect(index: number): Rect {
  return { x: FOUNDATION_X[index]!, y: TOP_ROW_Y, w: CARD_W, h: CARD_H };
}

function tableauOffset(column: readonly CardState[]): number {
  let fixed = 0;
  let faceUpGaps = 0;
  for (let i = 0; i < column.length - 1; i += 1) {
    if (column[i]!.faceUp) faceUpGaps += 1;
    else fixed += FACE_DOWN_OFFSET;
  }
  if (faceUpGaps === 0) return FACE_UP_OFFSET;
  const available = COLUMN_BOTTOM_LIMIT - TABLEAU_Y - CARD_H - fixed;
  return Math.max(
    FACE_UP_OFFSET_MIN,
    Math.min(FACE_UP_OFFSET, available / faceUpGaps),
  );
}

function tableauCardY(column: readonly CardState[], row: number): number {
  let y = TABLEAU_Y;
  const offset = tableauOffset(column);
  for (let i = 0; i < row; i += 1)
    y += column[i]!.faceUp ? offset : FACE_DOWN_OFFSET;
  return y;
}

function tableauRect(state: DeepReadonly<CascadeState>, index: number): Rect {
  const column = state.tableau[index] ?? [];
  if (column.length === 0)
    return { x: COLUMN_X[index]!, y: TABLEAU_Y, w: CARD_W, h: CARD_H };
  const y = tableauCardY(column, column.length - 1);
  return {
    x: COLUMN_X[index]!,
    y: TABLEAU_Y,
    w: CARD_W,
    h: y - TABLEAU_Y + CARD_H,
  };
}

function pileAt(
  state: DeepReadonly<CascadeState>,
  x: number,
  y: number,
): { pile: PileKind; index: number } | null {
  if (pointInRect(x, y, stockRect())) return { pile: "stock", index: 0 };
  if (pointInRect(x, y, wasteRect())) return { pile: "waste", index: 0 };
  for (let i = 0; i < FOUNDATION_COUNT; i += 1) {
    if (pointInRect(x, y, foundationRect(i)))
      return { pile: "foundation", index: i };
  }
  for (let i = 0; i < TABLEAU_COLUMNS; i += 1) {
    if (pointInRect(x, y, tableauRect(state, i)))
      return { pile: "tableau", index: i };
  }
  return null;
}

function wasteVisibleStart(state: DeepReadonly<CascadeState>): {
  start: number;
  count: number;
} {
  const count = state.wasteSets[state.wasteSets.length - 1] ?? 0;
  return { start: Math.max(0, state.waste.length - count), count };
}

function cardPosition(
  state: DeepReadonly<CascadeState>,
  pile: PileKind,
  index: number,
  row: number,
): { x: number; y: number } {
  if (pile === "stock") return { x: STOCK_X, y: TOP_ROW_Y };
  if (pile === "waste") {
    const shown = wasteVisibleStart(state);
    return {
      x: WASTE_X + Math.max(0, row - shown.start) * WASTE_FAN,
      y: TOP_ROW_Y,
    };
  }
  if (pile === "foundation") return { x: FOUNDATION_X[index]!, y: TOP_ROW_Y };
  return {
    x: COLUMN_X[index]!,
    y: tableauCardY(state.tableau[index] ?? [], row),
  };
}

function hitCard(
  state: DeepReadonly<CascadeState>,
  x: number,
  y: number,
): {
  pile: "waste" | "foundation" | "tableau";
  index: number;
  row: number;
} | null {
  for (let col = 0; col < TABLEAU_COLUMNS; col += 1) {
    const column = state.tableau[col] ?? [];
    for (let row = column.length - 1; row >= 0; row -= 1) {
      const pos = cardPosition(state, "tableau", col, row);
      if (pointInRect(x, y, { ...pos, w: CARD_W, h: CARD_H }))
        return { pile: "tableau", index: col, row };
    }
  }
  for (let i = 0; i < FOUNDATION_COUNT; i += 1) {
    if (
      (state.foundations[i]?.length ?? 0) > 0 &&
      pointInRect(x, y, foundationRect(i))
    ) {
      return {
        pile: "foundation",
        index: i,
        row: state.foundations[i]!.length - 1,
      };
    }
  }
  const shown = wasteVisibleStart(state);
  for (let row = state.waste.length - 1; row >= shown.start; row -= 1) {
    const pos = cardPosition(state, "waste", 0, row);
    if (pointInRect(x, y, { ...pos, w: CARD_W, h: CARD_H }))
      return { pile: "waste", index: 0, row };
  }
  return null;
}

function getPile(
  state: DeepReadonly<CascadeState>,
  pile: PileKind,
  index: number,
): readonly CardState[] {
  if (pile === "stock") {
    if (index !== 0) throw new Error("Stock index must be 0");
    return state.stock;
  }
  if (pile === "waste") {
    if (index !== 0) throw new Error("Waste index must be 0");
    return state.waste;
  }
  if (pile === "foundation") {
    if (!state.foundations[index]) throw new Error(`No foundation ${index}`);
    return state.foundations[index]!;
  }
  if (!state.tableau[index]) throw new Error(`No tableau ${index}`);
  return state.tableau[index]!;
}

function replacePile(
  state: DeepReadonly<CascadeState>,
  pile: PileKind,
  index: number,
  cards: readonly CardState[],
): CascadeState {
  if (pile === "stock")
    return index === 0
      ? { ...asState(state), stock: cards }
      : failPile(pile, index);
  if (pile === "waste")
    return index === 0
      ? { ...asState(state), waste: cards }
      : failPile(pile, index);
  if (pile === "foundation") {
    if (index < 0 || index >= FOUNDATION_COUNT) return failPile(pile, index);
    return {
      ...asState(state),
      foundations: state.foundations.map((p, i) => (i === index ? cards : p)),
    };
  }
  if (index < 0 || index >= TABLEAU_COLUMNS) return failPile(pile, index);
  return {
    ...asState(state),
    tableau: state.tableau.map((p, i) => (i === index ? cards : p)),
  };
}

function failPile(pile: PileKind, index: number): never {
  throw new Error(`No ${pile} ${index}`);
}

function isRun(cards: readonly CardState[]): boolean {
  for (let i = 0; i < cards.length - 1; i += 1) {
    if (
      cards[i + 1]!.rank !== cards[i]!.rank - 1 ||
      cardColor(cards[i + 1]!) === cardColor(cards[i]!)
    ) {
      return false;
    }
  }
  return cards.length > 0;
}

function foundationAccepts(
  foundation: readonly CardState[],
  run: readonly CardState[],
): boolean {
  if (run.length !== 1) return false;
  const card = run[0]!;
  const top = foundation[foundation.length - 1];
  return top
    ? top.suit === card.suit && card.rank === top.rank + 1
    : card.rank === RANK_MIN;
}

function tableauAccepts(
  column: readonly CardState[],
  run: readonly CardState[],
): boolean {
  if (!isRun(run)) return false;
  const lead = run[0]!;
  const top = column[column.length - 1];
  return top
    ? top.faceUp &&
        lead.rank === top.rank - 1 &&
        cardColor(lead) !== cardColor(top)
    : lead.rank === RANK_MAX;
}

function targetAccepts(
  state: DeepReadonly<CascadeState>,
  target: { pile: PileKind; index: number } | null,
  run: readonly CardState[],
): target is DropTargetState {
  if (!target) return false;
  if (target.pile === "foundation")
    return foundationAccepts(state.foundations[target.index] ?? [], run);
  if (target.pile === "tableau")
    return tableauAccepts(state.tableau[target.index] ?? [], run);
  return false;
}

function computeDropTarget(
  state: DeepReadonly<CascadeState>,
  drag: DeepReadonly<DragState> | null,
): DropTargetState | null {
  if (!drag) return null;
  const target = pileAt(state, drag.x + CARD_W / 2, drag.y + CARD_H / 2);
  return targetAccepts(state, target, drag.cards) ? target : null;
}

function removeFromWasteSet(sets: readonly number[]): readonly number[] {
  const next = [...sets];
  for (let i = next.length - 1; i >= 0; i -= 1) {
    if (next[i]! > 0) {
      next[i] -= 1;
      break;
    }
  }
  return next.filter((count) => count > 0);
}

function maybeFlipSource(
  state: DeepReadonly<CascadeState>,
  fromPile: PileKind,
  fromIndex: number,
): { state: CascadeState; flipped: boolean } {
  if (!state.autoFlip || fromPile !== "tableau")
    return { state: asState(state), flipped: false };
  const column = state.tableau[fromIndex] ?? [];
  const top = column[column.length - 1];
  if (!top || top.faceUp) return { state: asState(state), flipped: false };
  return {
    state: replacePile(
      state,
      "tableau",
      fromIndex,
      column.map((card, i) =>
        i === column.length - 1 ? { ...card, faceUp: true } : card,
      ),
    ),
    flipped: true,
  };
}

function maybeWin(state: DeepReadonly<CascadeState>): {
  state: CascadeState;
  won: boolean;
} {
  const home = state.foundations.reduce((sum, pile) => sum + pile.length, 0);
  if (!state.winDetect || home !== DECK_SIZE)
    return { state: asState(state), won: false };
  return {
    state: {
      ...asState(state),
      screen: "won",
      drag: null,
      dropTarget: null,
      launchClock: LAUNCH_INTERVAL,
      launched: 0,
      cascadeDone: false,
    },
    won: true,
  };
}

function attemptMove(
  state: DeepReadonly<CascadeState>,
  fromPile: PileKind,
  fromIndex: number,
  fromRow: number,
  toPile: PileKind,
  toIndex: number,
): [CascadeState, boolean, ReadonlySet<string>] {
  if (!Number.isInteger(fromRow) || fromRow < 0)
    throw new Error(`Invalid fromRow ${fromRow}`);
  const source = getPile(state, fromPile, fromIndex);
  if (fromRow >= source.length) throw new Error(`No card at row ${fromRow}`);
  if (fromPile === "stock" || (toPile !== "foundation" && toPile !== "tableau"))
    return [asState(state), false, new Set()];
  const run = source.slice(fromRow);
  if (
    fromPile === "waste" &&
    (fromRow !== source.length - 1 ||
      (state.wasteSets[state.wasteSets.length - 1] ?? 0) === 0)
  ) {
    return [asState(state), false, new Set()];
  }
  if (fromPile === "foundation" && fromRow !== source.length - 1)
    return [asState(state), false, new Set()];
  if (fromPile === "tableau" && (!run[0]?.faceUp || !isRun(run)))
    return [asState(state), false, new Set()];
  if (!targetAccepts(state, { pile: toPile, index: toIndex }, run))
    return [asState(state), false, new Set()];

  let next = replacePile(state, fromPile, fromIndex, source.slice(0, fromRow));
  if (fromPile === "waste")
    next = { ...next, wasteSets: removeFromWasteSet(next.wasteSets) };
  next = replacePile(next, toPile, toIndex, [
    ...getPile(next, toPile, toIndex),
    ...run,
  ]);
  const cues = new Set<string>([CUES.drop]);
  if (toPile === "foundation") cues.add(CUES.home);
  const flipped = maybeFlipSource(next, fromPile, fromIndex);
  next = flipped.state;
  if (flipped.flipped) cues.add(CUES.flip);
  const win = maybeWin(next);
  next = win.state;
  if (win.won) cues.add(CUES.win);
  return [next, true, cues];
}

function findHomeFoundation(
  state: DeepReadonly<CascadeState>,
  card: CardState,
): number | null {
  for (let i = 0; i < FOUNDATION_COUNT; i += 1) {
    if (foundationAccepts(state.foundations[i] ?? [], [card])) return i;
  }
  return null;
}

function autoMoveCard(
  state: DeepReadonly<CascadeState>,
  pile: PileKind,
  index: number,
): [CascadeState, boolean, ReadonlySet<string>] {
  if (pile !== "waste" && pile !== "tableau")
    return [asState(state), false, new Set()];
  const source = getPile(state, pile, index);
  const card = source[source.length - 1];
  if (
    !card?.faceUp ||
    (pile === "waste" &&
      (state.wasteSets[state.wasteSets.length - 1] ?? 0) === 0)
  ) {
    return [asState(state), false, new Set()];
  }
  const foundation = findHomeFoundation(state, card);
  return foundation === null
    ? [asState(state), false, new Set()]
    : attemptMove(
        state,
        pile,
        index,
        source.length - 1,
        "foundation",
        foundation,
      );
}

function liftAt(
  state: DeepReadonly<CascadeState>,
  x: number,
  y: number,
): { state: CascadeState; drag: DragState } | null {
  const hit = hitCard(state, x, y);
  if (!hit) return null;
  const pile = getPile(state, hit.pile, hit.index);
  const card = pile[hit.row]!;
  if (!card.faceUp) return null;
  if (
    hit.pile === "waste" &&
    (hit.row !== pile.length - 1 ||
      (state.wasteSets[state.wasteSets.length - 1] ?? 0) === 0)
  ) {
    return null;
  }
  if (hit.pile === "foundation" && hit.row !== pile.length - 1) return null;
  const cards = pile.slice(hit.row);
  if (hit.pile === "tableau" && !isRun(cards)) return null;
  const pos = cardPosition(state, hit.pile, hit.index, hit.row);
  return {
    state: replacePile(state, hit.pile, hit.index, pile.slice(0, hit.row)),
    drag: {
      cards,
      fromPile: hit.pile,
      fromIndex: hit.index,
      x: pos.x,
      y: pos.y,
    },
  };
}

function returnDrag(state: DeepReadonly<CascadeState>): CascadeState {
  if (!state.drag) return { ...asState(state), dropTarget: null };
  const pile = getPile(state, state.drag.fromPile, state.drag.fromIndex);
  return {
    ...replacePile(state, state.drag.fromPile, state.drag.fromIndex, [
      ...pile,
      ...state.drag.cards,
    ]),
    drag: null,
    dropTarget: null,
  };
}

function applyDragDrop(
  state: DeepReadonly<CascadeState>,
): [CascadeState, boolean, ReadonlySet<string>] {
  if (!state.drag) return [asState(state), false, new Set()];
  const target = computeDropTarget(state, state.drag);
  if (!targetAccepts(state, target, state.drag.cards))
    return [returnDrag(state), false, new Set([CUES.reject])];
  let next = replacePile(state, target.pile, target.index, [
    ...getPile(state, target.pile, target.index),
    ...state.drag.cards,
  ]);
  if (state.drag.fromPile === "waste")
    next = { ...next, wasteSets: removeFromWasteSet(next.wasteSets) };
  const cues = new Set<string>([CUES.drop]);
  if (target.pile === "foundation") cues.add(CUES.home);
  next = { ...next, drag: null, dropTarget: null };
  const flipped = maybeFlipSource(
    next,
    state.drag.fromPile,
    state.drag.fromIndex,
  );
  next = flipped.state;
  if (flipped.flipped) cues.add(CUES.flip);
  const win = maybeWin(next);
  next = win.state;
  if (win.won) cues.add(CUES.win);
  return [next, true, cues];
}

function turnStockState(
  state: DeepReadonly<CascadeState>,
): [CascadeState, ReadonlySet<string>] {
  if (state.stock.length > 0) {
    const stock = [...state.stock];
    const turned: CardState[] = [];
    const count = Math.min(TURN_COUNT, stock.length);
    for (let i = 0; i < count; i += 1)
      turned.push({ ...stock.pop()!, faceUp: true });
    return [
      {
        ...asState(state),
        stock,
        waste: [...state.waste, ...turned],
        wasteSets: [...state.wasteSets, count],
      },
      new Set([CUES.turn]),
    ];
  }
  if (state.waste.length > 0) {
    return [
      {
        ...asState(state),
        stock: [...state.waste]
          .reverse()
          .map((card) => ({ ...card, faceUp: false })),
        waste: [],
        wasteSets: [],
      },
      new Set([CUES.recycle]),
    ];
  }
  return [asState(state), new Set()];
}

function activateMenu(
  state: DeepReadonly<CascadeState>,
  index: number,
): CuedState {
  if (state.screen === "title") {
    if (index === 0)
      return [
        { ...dealState(state), screen: "playing", menuIndex: 0, titleIndex: 0 },
        new Set([CUES.deal]),
      ];
    if (index === 1)
      return [
        { ...asState(state), screen: "howto", menuIndex: 0, titleIndex: 1 },
        new Set(),
      ];
  }
  if (state.screen === "howto")
    return [
      { ...asState(state), screen: "title", menuIndex: state.titleIndex },
      new Set(),
    ];
  if (state.screen === "playing") {
    if (index === 0)
      return [
        { ...dealState(state), screen: "playing", menuIndex: 0 },
        new Set([CUES.deal]),
      ];
    if (index === 1)
      return [
        { ...asState(state), screen: "title", menuIndex: state.titleIndex },
        new Set(),
      ];
    if (index === 2) return [asState(state), new Set(["toggle-mute"])];
  }
  return [asState(state), new Set()];
}

function pointerDownState(
  state: DeepReadonly<CascadeState>,
  x: number,
  y: number,
): CuedState {
  let next: CascadeState = {
    ...asState(state),
    pointer: { x, y, down: true },
    lastPress: { x, y, at: state.simTime },
  };
  const hover = menuIndexAt(next, x, y);
  if (hover !== null) next = { ...next, menuIndex: hover };
  if (next.screen === "won")
    return [
      { ...dealState(next), screen: "playing", menuIndex: 0 },
      new Set([CUES.deal]),
    ];
  if (next.screen !== "playing") return [next, new Set()];

  const hit = hitCard(next, x, y);
  const doubleClick =
    state.lastPress !== null &&
    next.simTime - state.lastPress.at <= DOUBLE_CLICK_WINDOW &&
    Math.hypot(x - state.lastPress.x, y - state.lastPress.y) <=
      DOUBLE_CLICK_SLOP &&
    hit !== null &&
    (hit.pile === "waste" || hit.pile === "tableau");
  if (doubleClick && hit) {
    const [moved, accepted, cues] = autoMoveCard(next, hit.pile, hit.index);
    return [accepted ? moved : next, cues];
  }

  const lift = liftAt(next, x, y);
  if (!lift) return [next, new Set()];
  const drag = { ...lift.drag };
  return [
    {
      ...lift.state,
      pointer: next.pointer,
      lastPress: next.lastPress,
      drag,
      dropTarget: computeDropTarget(lift.state, drag),
    },
    new Set([CUES.lift]),
  ];
}

function dragOrigin(
  state: DeepReadonly<CascadeState>,
  drag: DeepReadonly<DragState>,
): { x: number; y: number } {
  const restored = returnDrag({ ...asState(state), drag: drag as DragState });
  const row =
    getPile(restored, drag.fromPile, drag.fromIndex).length - drag.cards.length;
  return cardPosition(restored, drag.fromPile, drag.fromIndex, row);
}

function pointerMoveState(
  state: DeepReadonly<CascadeState>,
  x: number,
  y: number,
): CascadeState {
  const hover = menuIndexAt(state, x, y);
  let next: CascadeState = {
    ...asState(state),
    pointer: { x, y, down: state.pointer.down },
    menuIndex: hover ?? state.menuIndex,
  };
  if (state.drag) {
    const origin = dragOrigin(state, state.drag);
    const drag = {
      ...state.drag,
      x: origin.x + (state.lastPress ? x - state.lastPress.x : 0),
      y: origin.y + (state.lastPress ? y - state.lastPress.y : 0),
    };
    next = { ...next, drag, dropTarget: computeDropTarget(next, drag) };
  }
  return next;
}

function pointerUpState(
  state: DeepReadonly<CascadeState>,
  x: number,
  y: number,
): CuedState {
  const next = {
    ...pointerMoveState(state, x, y),
    pointer: { x, y, down: false },
  };
  const pressMenu = state.lastPress
    ? menuIndexAt(next, state.lastPress.x, state.lastPress.y)
    : null;
  const releaseMenu = menuIndexAt(next, x, y);
  if (pressMenu !== null && pressMenu === releaseMenu) {
    return activateMenu(
      { ...returnDrag(next), pointer: next.pointer, menuIndex: pressMenu },
      pressMenu,
    );
  }
  const click = state.lastPress
    ? Math.hypot(x - state.lastPress.x, y - state.lastPress.y) <= DRAG_THRESHOLD
    : false;
  if (click) {
    const returned = returnDrag(next);
    if (
      state.lastPress &&
      pointInRect(state.lastPress.x, state.lastPress.y, stockRect())
    )
      return turnStockState(returned);
    return [returned, new Set()];
  }
  const [dropped, , cues] = applyDragDrop(next);
  return [dropped, cues];
}

function nextLaunchFoundation(
  foundations: readonly (readonly CardState[])[],
  launched: number,
): number | null {
  for (let offset = 0; offset < FOUNDATION_COUNT; offset += 1) {
    const index = (launched + offset) % FOUNDATION_COUNT;
    if ((foundations[index]?.length ?? 0) > 0) return index;
  }
  return null;
}

function drawLaunchVx(): number {
  const magnitude =
    LAUNCH_VX_MIN + Math.random() * (LAUNCH_VX_MAX - LAUNCH_VX_MIN);
  return Math.random() < 0.5 ? -magnitude : magnitude;
}

function stepCascade(state: DeepReadonly<CascadeState>, dt: number): CuedState {
  const cues = new Set<string>();
  const flyers: FlyerState[] = [];
  let trailStamps = state.trailStamps;
  for (const flyer of state.flyers) {
    let vy = flyer.vy + GRAVITY * dt;
    const x = flyer.x + flyer.vx * dt;
    let y = flyer.y + vy * dt;
    if (y >= FLOOR_Y && vy > 0) {
      y = FLOOR_Y;
      vy = -vy * BOUNCE_DAMP;
    }
    if (state.trailPainting) {
      trailLayer.push({ suit: flyer.suit, rank: flyer.rank, x, y });
      if (trailLayer.length > TRAIL_LIMIT) trailLayer.shift();
      trailStamps += 1;
    }
    if (!(x + CARD_W < 0 || x > STAGE_W)) flyers.push({ ...flyer, x, y, vy });
  }

  const foundations = state.foundations.map((pile) => [...pile]);
  let launchClock = state.launchClock;
  let launched = state.launched;
  if (state.screen === "won" && state.launching && launched < DECK_SIZE) {
    launchClock += dt;
    while (launchClock >= LAUNCH_INTERVAL && launched < DECK_SIZE) {
      const launchIndex = nextLaunchFoundation(foundations, launched);
      if (launchIndex === null) break;
      launchClock -= LAUNCH_INTERVAL;
      const card = foundations[launchIndex]!.pop()!;
      flyers.push({
        id: card.id,
        suit: card.suit,
        rank: card.rank,
        x: FOUNDATION_X[launchIndex]!,
        y: TOP_ROW_Y,
        vx: drawLaunchVx(),
        vy: LAUNCH_VY,
      });
      launched += 1;
      cues.add(CUES.launch);
    }
  }
  return [
    {
      ...asState(state),
      foundations,
      flyers,
      launchClock,
      launched,
      trailStamps,
      cascadeDone:
        launched >= DECK_SIZE && flyers.length === 0 ? true : state.cascadeDone,
    },
    cues,
  ];
}

function mapCard(card: DeepReadonly<CardState>): SnapshotCard {
  return {
    id: card.id,
    suit: card.suit,
    rank: card.rank,
    color: cardColor(card),
    faceUp: card.faceUp,
  };
}

function snapshot(state: DeepReadonly<CascadeState>): CascadeSnapshot {
  return {
    version: CASCADE_DEBUG_VERSION,
    screen: state.screen,
    menuIndex: state.menuIndex,
    titleIndex: state.titleIndex,
    dealMode: DEAL_MODE,
    turnCount: TURN_COUNT,
    dealModeLabel: DEAL_MODE_LABEL,
    muted: state.muted,
    autoFlip: state.autoFlip,
    winDetect: state.winDetect,
    launching: state.launching,
    trailPainting: state.trailPainting,
    stock: state.stock.map(mapCard),
    waste: state.waste.map(mapCard),
    wasteSets: [...state.wasteSets],
    wasteVisibleCount: state.wasteSets[state.wasteSets.length - 1] ?? 0,
    foundations: state.foundations.map((pile) => pile.map(mapCard)),
    tableau: state.tableau.map((pile) => pile.map(mapCard)),
    drag: state.drag
      ? {
          cards: state.drag.cards.map(mapCard),
          fromPile: state.drag.fromPile,
          fromIndex: state.drag.fromIndex,
          x: state.drag.x,
          y: state.drag.y,
        }
      : null,
    dropTarget: computeDropTarget(state, state.drag),
    pointer: { ...state.pointer },
    lastPress: state.lastPress ? { ...state.lastPress } : null,
    launchClock: state.launchClock,
    launched: state.launched,
    flyers: state.flyers.map((flyer) => ({ ...flyer })),
    cascadeDone: state.cascadeDone,
    trailStamps: state.trailStamps,
    simTime: state.simTime,
  };
}

function findCard(
  state: DeepReadonly<CascadeState>,
  id: number,
): { pile: PileKind; index: number; cards: readonly CardState[] } | null {
  const piles: Array<{
    pile: PileKind;
    index: number;
    cards: readonly CardState[];
  }> = [
    { pile: "stock", index: 0, cards: state.stock },
    { pile: "waste", index: 0, cards: state.waste },
    ...state.foundations.map((cards, index) => ({
      pile: "foundation" as const,
      index,
      cards,
    })),
    ...state.tableau.map((cards, index) => ({
      pile: "tableau" as const,
      index,
      cards,
    })),
  ];
  return (
    piles.find((entry) => entry.cards.some((card) => card.id === id)) ?? null
  );
}

function debugApi(): CascadeDebugApi {
  return {
    version: CASCADE_DEBUG_VERSION,
    reset(state) {
      trailLayer.length = 0;
      return freshState(state.muted);
    },
    snapshot,
    reconcile(state) {
      return {
        ...asState(state),
        dropTarget: computeDropTarget(state, state.drag),
      };
    },
    menuItemRect(state, index) {
      return menuRectFor(state.screen, index);
    },
    setScreen(state, screen) {
      return { ...asState(state), screen };
    },
    setMenuIndex(state, index) {
      return { ...asState(state), menuIndex: index };
    },
    setTitleIndex(state, index) {
      return { ...asState(state), titleIndex: index };
    },
    addCard(state, pile, index, suit, rank, faceUp) {
      assertSuit(suit);
      assertRank(rank);
      const card = { id: state.nextId, suit, rank, faceUp };
      return {
        ...replacePile(state, pile, index, [
          ...getPile(state, pile, index),
          card,
        ]),
        nextId: state.nextId + 1,
      };
    },
    removeCard(state, id) {
      const found = findCard(state, id);
      if (!found) throw new Error(`No card ${id}`);
      let next = replacePile(
        state,
        found.pile,
        found.index,
        found.cards.filter((card) => card.id !== id),
      );
      if (found.pile === "waste")
        next = { ...next, wasteSets: removeFromWasteSet(next.wasteSets) };
      return next;
    },
    setCardFaceUp(state, id, faceUp) {
      const found = findCard(state, id);
      if (!found) throw new Error(`No card ${id}`);
      return replacePile(
        state,
        found.pile,
        found.index,
        found.cards.map((card) =>
          card.id === id ? { ...card, faceUp } : card,
        ),
      );
    },
    clearPile(state, pile, index) {
      const next = replacePile(state, pile, index, []);
      return pile === "waste" ? { ...next, wasteSets: [] } : next;
    },
    clearTable(state) {
      return {
        ...asState(state),
        stock: [],
        waste: [],
        wasteSets: [],
        foundations: emptyFoundations(),
        tableau: emptyTableau(),
        drag: null,
        dropTarget: null,
      };
    },
    addWasteSet(state, count) {
      assertWhole(count, "count");
      return { ...asState(state), wasteSets: [...state.wasteSets, count] };
    },
    clearWasteSets(state) {
      return { ...asState(state), wasteSets: [] };
    },
    deal: dealState,
    turnStock(state) {
      return turnStockState(state)[0];
    },
    move(state, fromPile, fromIndex, fromRow, toPile, toIndex) {
      const [next, accepted] = attemptMove(
        state,
        fromPile,
        fromIndex,
        fromRow,
        toPile,
        toIndex,
      );
      return [next, accepted];
    },
    autoMove(state, pile, index) {
      const [next, accepted] = autoMoveCard(state, pile, index);
      return [next, accepted];
    },
    pointerDown(state, x, y) {
      return pointerDownState(state, x, y)[0];
    },
    pointerMove: pointerMoveState,
    pointerUp(state, x, y) {
      return pointerUpState(state, x, y)[0];
    },
    setAutoFlip(state, enabled) {
      return { ...asState(state), autoFlip: enabled };
    },
    setWinDetect(state, enabled) {
      return { ...asState(state), winDetect: enabled };
    },
    setLaunching(state, enabled) {
      return { ...asState(state), launching: enabled };
    },
    setTrailPainting(state, enabled) {
      return { ...asState(state), trailPainting: enabled };
    },
    addFlyer(state, suit, rank, x, y, vx, vy) {
      assertSuit(suit);
      assertRank(rank);
      return {
        ...asState(state),
        flyers: [
          ...state.flyers,
          { id: state.nextId, suit, rank, x, y, vx, vy },
        ],
        nextId: state.nextId + 1,
      };
    },
    setFlyerPosition(state, id, x, y) {
      if (!state.flyers.some((flyer) => flyer.id === id))
        throw new Error(`No flyer ${id}`);
      return {
        ...asState(state),
        flyers: state.flyers.map((flyer) =>
          flyer.id === id ? { ...flyer, x, y } : flyer,
        ),
      };
    },
    setFlyerVelocity(state, id, vx, vy) {
      if (!state.flyers.some((flyer) => flyer.id === id))
        throw new Error(`No flyer ${id}`);
      return {
        ...asState(state),
        flyers: state.flyers.map((flyer) =>
          flyer.id === id ? { ...flyer, vx, vy } : flyer,
        ),
      };
    },
    removeFlyer(state, id) {
      if (!state.flyers.some((flyer) => flyer.id === id))
        throw new Error(`No flyer ${id}`);
      return {
        ...asState(state),
        flyers: state.flyers.filter((flyer) => flyer.id !== id),
      };
    },
    clearFlyers(state) {
      return { ...asState(state), flyers: [] };
    },
    setLaunchClock(state, seconds) {
      return { ...asState(state), launchClock: seconds };
    },
    clearTrail(state) {
      trailLayer.length = 0;
      return { ...asState(state), trailStamps: 0 };
    },
    drawLaunchVx,
  };
}

function playCues(api: UpdateApi, cues: ReadonlySet<string>): void {
  if (cues.has("toggle-mute")) api.audio.setMuted(!api.audio.muted());
  for (const cue of cues) if (cue !== "toggle-mute") api.audio.play(cue);
}

function mergeCues(
  ...sets: readonly ReadonlySet<string>[]
): ReadonlySet<string> {
  const cues = new Set<string>();
  for (const set of sets) for (const cue of set) cues.add(cue);
  return cues;
}

function processPointerSample(
  state: DeepReadonly<CascadeState>,
  sample: PointerSample,
): CuedState {
  if (!sample.primary) return [asState(state), new Set()];
  if (sample.type === "down")
    return pointerDownState(state, sample.x, sample.y);
  if (sample.type === "up") return pointerUpState(state, sample.x, sample.y);
  return [pointerMoveState(state, sample.x, sample.y), new Set()];
}

function processKeyboard(
  state: DeepReadonly<CascadeState>,
  api: UpdateApi,
): CuedState {
  if (state.screen === "won") return [asState(state), new Set()];
  const count = menuCount(state.screen);
  if (count === 0) return [asState(state), new Set()];
  const up = api.input.pressed(MENU_UP);
  const down = api.input.pressed(MENU_DOWN);
  const confirm = api.input.pressed(MENU_CONFIRM);
  const back = api.input.pressed(MENU_BACK);
  if (up)
    return [
      { ...asState(state), menuIndex: (state.menuIndex + count - 1) % count },
      new Set(),
    ];
  if (down)
    return [
      { ...asState(state), menuIndex: (state.menuIndex + 1) % count },
      new Set(),
    ];
  if (confirm || (back && state.screen === "howto"))
    return activateMenu(state, state.menuIndex);
  return [asState(state), new Set()];
}

function defineAudio(api: InitApi<CascadeState>): void {
  api.audio.define(CUES.deal, {
    wave: "triangle",
    freq: 260,
    freqTo: 440,
    durationMs: 120,
    gain: 0.16,
  });
  api.audio.define(CUES.turn, {
    wave: "square",
    freq: 330,
    freqTo: 260,
    durationMs: 70,
    gain: 0.08,
  });
  api.audio.define(CUES.recycle, {
    wave: "sawtooth",
    freq: 180,
    freqTo: 320,
    durationMs: 140,
    gain: 0.1,
  });
  api.audio.define(CUES.lift, {
    wave: "sine",
    freq: 520,
    durationMs: 45,
    gain: 0.08,
  });
  api.audio.define(CUES.drop, {
    wave: "triangle",
    freq: 420,
    freqTo: 300,
    durationMs: 80,
    gain: 0.12,
  });
  api.audio.define(CUES.reject, {
    wave: "square",
    freq: 130,
    freqTo: 90,
    durationMs: 110,
    gain: 0.09,
  });
  api.audio.define(CUES.flip, {
    wave: "triangle",
    freq: 600,
    freqTo: 760,
    durationMs: 75,
    gain: 0.09,
  });
  api.audio.define(CUES.home, {
    wave: "sine",
    freq: 660,
    freqTo: 880,
    durationMs: 110,
    gain: 0.12,
  });
  api.audio.define(CUES.launch, {
    wave: "sawtooth",
    freq: 360,
    freqTo: 180,
    durationMs: 90,
    gain: 0.07,
  });
  api.audio.define(CUES.win, {
    wave: "triangle",
    freq: 440,
    freqTo: 880,
    durationMs: 320,
    gain: 0.14,
  });
}

function registerInput(api: InitApi<CascadeState>): void {
  for (const [name, keys] of Object.entries(MENU_BINDINGS))
    api.input.register(name, { keys: [...keys] });
}

function registerDiagnostics(api: InitApi<CascadeState>): void {
  api.diagnostics.register("screen", (state) => state.screen);
  api.diagnostics.register("deal", () => DEAL_MODE);
  api.diagnostics.register("stock", (state) => state.stock.length);
  api.diagnostics.register("waste", (state) => state.waste.length);
  for (let i = 0; i < FOUNDATION_COUNT; i += 1) {
    api.diagnostics.register(
      `foundation-${i}`,
      (state) => state.foundations[i]?.length ?? 0,
    );
  }
  for (let i = 0; i < TABLEAU_COLUMNS; i += 1) {
    api.diagnostics.register(
      `column-${i}`,
      (state) => state.tableau[i]?.length ?? 0,
    );
  }
  api.diagnostics.register("hand", (state) => state.drag?.cards.length ?? 0);
  api.diagnostics.register("launched", (state) =>
    state.screen === "won" ? state.launched : 0,
  );
  api.diagnostics.register("flyers", (state) =>
    state.screen === "won" ? state.flyers.length : 0,
  );
}

export const game: Game<CascadeState, CascadeDebugApi> = {
  initialize(api: InitApi<CascadeState>): [CascadeState, CascadeDebugApi] {
    registerInput(api);
    defineAudio(api);
    registerDiagnostics(api);
    return [freshState(), debugApi()];
  },

  update(
    state: DeepReadonly<CascadeState>,
    api: UpdateApi,
    dt: number,
  ): CascadeState {
    let next: CascadeState = { ...asState(state), simTime: state.simTime + dt };
    let cues = new Set<string>();
    const [keyState, keyCues] = processKeyboard(next, api);
    next = keyState;
    cues = mergeCues(cues, keyCues) as Set<string>;
    for (const sample of api.input.pointerSamples()) {
      const [sampleState, sampleCues] = processPointerSample(next, sample);
      next = sampleState;
      cues = mergeCues(cues, sampleCues) as Set<string>;
    }
    const [cascadeState, cascadeCues] = stepCascade(next, dt);
    next = cascadeState;
    cues = mergeCues(cues, cascadeCues) as Set<string>;
    playCues(api, cues);
    return { ...next, muted: api.audio.muted() };
  },

  render(state: DeepReadonly<CascadeState>, api: RenderApi): void {
    draw(api.ctx, state);
  },
};

function draw(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CascadeState>,
): void {
  drawTable(ctx);
  if (state.screen === "playing" || state.screen === "won")
    drawPiles(ctx, state);
  if (state.screen === "title") drawTitle(ctx, state);
  if (state.screen === "howto") drawHowto(ctx, state);
  if (state.screen === "won") drawWon(ctx, state);
}

function drawTable(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  ctx.fillStyle = TABLE_DARK;
  ctx.globalAlpha = 0.16;
  for (let x = -STAGE_H; x < STAGE_W; x += 58) ctx.fillRect(x, 0, 12, STAGE_H);
  ctx.globalAlpha = 1;
}

function drawPiles(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CascadeState>,
): void {
  for (const stamp of trailLayer)
    drawCard(ctx, { ...stamp, id: 0, faceUp: true }, stamp.x, stamp.y, 0.38);
  drawSlot(ctx, STOCK_X, TOP_ROW_Y, "STOCK");
  drawSlot(ctx, WASTE_X, TOP_ROW_Y, "WASTE");
  for (let i = 0; i < FOUNDATION_COUNT; i += 1)
    drawSlot(ctx, FOUNDATION_X[i]!, TOP_ROW_Y, "A");
  for (let i = 0; i < TABLEAU_COLUMNS; i += 1)
    if (state.tableau[i]!.length === 0)
      drawSlot(ctx, COLUMN_X[i]!, TABLEAU_Y, "K");
  if (state.dropTarget)
    drawHighlight(
      ctx,
      state.dropTarget.pile === "foundation"
        ? foundationRect(state.dropTarget.index)
        : tableauRect(state, state.dropTarget.index),
    );
  if (state.stock.length > 0)
    drawCard(ctx, state.stock[state.stock.length - 1]!, STOCK_X, TOP_ROW_Y);
  drawWaste(ctx, state);
  for (let i = 0; i < FOUNDATION_COUNT; i += 1) {
    const foundation = state.foundations[i];
    const card = foundation ? foundation[foundation.length - 1] : undefined;
    if (card) drawCard(ctx, card, FOUNDATION_X[i]!, TOP_ROW_Y);
  }
  for (let i = 0; i < TABLEAU_COLUMNS; i += 1) {
    const column = state.tableau[i]!;
    for (let row = 0; row < column.length; row += 1)
      drawCard(ctx, column[row]!, COLUMN_X[i]!, tableauCardY(column, row));
  }
  if (state.drag) drawDrag(ctx, state.drag);
  for (const flyer of state.flyers)
    drawCard(ctx, { ...flyer, faceUp: true }, flyer.x, flyer.y);
  if (state.screen === "playing") drawHud(ctx, state);
}

function drawWaste(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CascadeState>,
): void {
  const shown = wasteVisibleStart(state);
  for (let row = shown.start; row < state.waste.length; row += 1) {
    const pos = cardPosition(state, "waste", 0, row);
    drawCard(ctx, state.waste[row]!, pos.x, pos.y);
  }
}

function drawDrag(
  ctx: CanvasRenderingContext2D,
  drag: DeepReadonly<DragState>,
): void {
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 10;
  for (let i = 0; i < drag.cards.length; i += 1)
    drawCard(ctx, drag.cards[i]!, drag.x, drag.y + i * FACE_UP_OFFSET);
  ctx.restore();
}

function drawHighlight(ctx: CanvasRenderingContext2D, rect: Rect): void {
  ctx.save();
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 5;
  roundedRect(
    ctx,
    rect.x - 4,
    rect.y - 4,
    rect.w + 8,
    rect.h + 8,
    CARD_RADIUS + 4,
  );
  ctx.stroke();
  ctx.restore();
}

function drawSlot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  label: string,
): void {
  ctx.save();
  ctx.globalAlpha = 0.28;
  ctx.strokeStyle = "#d9eadc";
  ctx.lineWidth = 2;
  roundedRect(ctx, x, y, CARD_W, CARD_H, CARD_RADIUS);
  ctx.stroke();
  ctx.fillStyle = "#d9eadc";
  ctx.font = "700 20px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, x + CARD_W / 2, y + CARD_H / 2);
  ctx.restore();
}

function drawCard(
  ctx: CanvasRenderingContext2D,
  card: DeepReadonly<CardState>,
  x: number,
  y: number,
  alpha = 1,
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  roundedRect(ctx, x, y, CARD_W, CARD_H, CARD_RADIUS);
  ctx.fillStyle = card.faceUp ? CARD_FACE : "#244f7a";
  ctx.fill();
  ctx.strokeStyle = CARD_EDGE;
  ctx.lineWidth = 2;
  ctx.stroke();
  if (card.faceUp) {
    ctx.fillStyle = cardColor(card) === "red" ? RED : BLACK;
    ctx.font = "700 22px Georgia, serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(rankLabel(card.rank), x + 10, y + 8);
    ctx.fillText(suitGlyph(card.suit), x + 10, y + 34);
    ctx.font = "48px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(suitGlyph(card.suit), x + CARD_W / 2, y + CARD_H / 2 + 12);
  } else {
    ctx.strokeStyle = "#b8d3ef";
    ctx.lineWidth = 3;
    for (let i = 0; i < 4; i += 1) {
      roundedRect(
        ctx,
        x + 15 + i * 7,
        y + 18 + i * 6,
        CARD_W - 30 - i * 14,
        CARD_H - 36 - i * 12,
        5,
      );
      ctx.stroke();
    }
  }
  ctx.restore();
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawTitle(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CascadeState>,
): void {
  ctx.fillStyle = PANEL;
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  ctx.fillStyle = CARD_FACE;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "800 94px Georgia, serif";
  ctx.fillText(TITLE_TEXT, STAGE_W / 2, 196);
  ctx.font = "700 22px system-ui, sans-serif";
  ctx.fillText(TAGLINE_TEXT, STAGE_W / 2, 268);
  ctx.fillStyle = GOLD;
  ctx.fillText(DEAL_MODE_LABEL, STAGE_W / 2, 312);
  TITLE_ITEMS.forEach((label, index) =>
    drawControl(
      ctx,
      menuRectFor("title", index)!,
      label,
      state.menuIndex === index,
    ),
  );
}

function drawHowto(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CascadeState>,
): void {
  ctx.fillStyle = PANEL;
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  ctx.fillStyle = CARD_FACE;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "800 46px Georgia, serif";
  ctx.fillText("HOW TO PLAY", STAGE_W / 2, 104);
  [
    "Build all four foundations from ACE to KING.",
    "Columns build downward in alternating colors.",
    "Only a KING can move into an empty column.",
    "Turn the STOCK to reveal the waste, then recycle it when it runs out.",
    "Drag cards or runs to move them. DOUBLE-CLICK a playable card to send it home.",
  ].forEach((line, i) => {
    ctx.font = "500 25px system-ui, sans-serif";
    ctx.fillText(line, STAGE_W / 2, 218 + i * 54);
  });
  drawControl(
    ctx,
    menuRectFor("howto", 0)!,
    HOWTO_BACK_LABEL,
    state.menuIndex === 0,
  );
}

function drawHud(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CascadeState>,
): void {
  ctx.fillStyle = "rgba(7, 19, 17, 0.72)";
  ctx.fillRect(0, HUD_Y, STAGE_W, HUD_H);
  HUD_ITEMS.forEach((label, index) =>
    drawControl(
      ctx,
      menuRectFor("playing", index)!,
      label,
      state.menuIndex === index,
    ),
  );
  ctx.fillStyle = CARD_FACE;
  ctx.font = "700 16px system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillText(
    `${DEAL_MODE_LABEL}${state.muted ? " / MUTED" : ""}`,
    STAGE_W - 34,
    HUD_Y + HUD_H / 2,
  );
}

function drawControl(
  ctx: CanvasRenderingContext2D,
  rect: Rect,
  label: string,
  selected: boolean,
): void {
  ctx.save();
  roundedRect(ctx, rect.x, rect.y, rect.w, rect.h, 7);
  ctx.fillStyle = selected ? GOLD : "rgba(255, 250, 240, 0.14)";
  ctx.fill();
  ctx.strokeStyle = selected ? "#fff3b0" : "rgba(255,255,255,0.38)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = selected ? "#17352d" : CARD_FACE;
  ctx.font = "800 17px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, rect.x + rect.w / 2, rect.y + rect.h / 2);
  ctx.restore();
}

function drawWon(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CascadeState>,
): void {
  if (!state.cascadeDone) return;
  ctx.fillStyle = "rgba(5, 17, 14, 0.35)";
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  ctx.fillStyle = CARD_FACE;
  ctx.font = "900 84px Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(WIN_TEXT, STAGE_W / 2, 338);
}
