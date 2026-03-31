# Snake vs Chess

A hybrid game combining classic chess with snake mechanics on a single 8x8 board.

> [Watch the inspiration](https://www.youtube.com/shorts/pOF-uP48eiM)

## Rules

**White (Chess + Snake)**
- Standard chess pieces (no Queen) plus a **Snake** that starts on d2
- The Snake moves one square at a time in any cardinal direction (up, down, left, right)
- The Snake **grows longer** each time it captures a piece
- White wins by having the Snake eat the Black King

**Black (Chess)**
- Full set of standard chess pieces (minus the Queen at start)
- Black pawns can only promote to a Queen
- Black wins by **checkmating the White King**

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Tech Stack

| Layer       | Tool              |
| ----------- | ----------------- |
| Framework   | React 19 + TypeScript |
| Build       | Vite 7            |
| Styling     | Tailwind CSS 3    |
| Chess Logic | chess.js          |

## Project Structure

```
src/
├── components/
│   ├── Board.tsx          # Game board rendering and interaction
│   └── Header.tsx         # Header with rules modal
├── hooks/
│   └── gameLogic.ts       # Core game engine (snake movement, FEN handling)
├── App.tsx                # Root component
├── main.tsx               # Entry point
└── index.css              # Global styles + Tailwind directives

public/
└── Pieces/                # SVG assets (chess pieces, snake segments, apple)
```

## How It Works

The game engine in `src/hooks/gameLogic.ts` bridges **chess.js** with a custom snake implementation:

- Chess.js handles standard piece movement, check, and checkmate detection
- The snake is tracked as a separate array of `[row, col]` segments
- The board state is maintained as an 8x8 string array with a custom FEN-like representation
- On each move, the engine reconstructs valid FEN strings for chess.js while keeping snake state in sync
- Snake moves are filtered through a check-detection pass when the White King is in check, simulating each move to verify legality
