# Cascade

Cascade is a browser-only Klondike solitaire built on the Simple 2D engine. It
plays Draw Three: each stock turn reveals up to three fanned waste cards, with
only the front card playable. Build the four foundations from Ace to King, free
buried tableau cards, and finish the board to trigger the victory cascade.

## Install

```sh
npm ci
```

## Development

```sh
npm run dev
```

Vite serves the game with hot reload. Open the printed local URL in a browser.

## Production Build

```sh
npm run build
```

The static site is written to `dist/` and can be served from any static host.

## Controls

Use a mouse, pen, or touch pointer to play. Drag face-up cards or valid runs
between tableau columns, foundations, and the waste. Click the stock to turn
three cards; when the stock is empty, click it again to recycle the waste.
Double-click a playable waste card or exposed tableau card to send it to its
foundation when legal.

Menus and HUD controls can also be driven with the keyboard: `ArrowUp`/`W`,
`ArrowDown`/`S`, `Enter`/`Space`, and `Escape`.

## Checks

```sh
npm run typecheck
npm run lint
npm run format
npm test
```
