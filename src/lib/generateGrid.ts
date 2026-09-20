import type { CellState } from "./types";

export default function generateGrid() {
  const board: CellState[][] = Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => ({
      value: null,
      notes: new Set(),
    })),
  );

  fillBoard(board);

  return board;
}

function fillBoard(board: CellState[][]): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c].value === null) {
        const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"].sort(
          () => Math.random() - 0.5,
        );

        for (const val of numbers) {
          if (isValidPlacement(board, r, c, val)) {
            board[r][c].value = val;
            if (fillBoard(board)) return true;

            board[r][c].value = null;
          }
        }
        return false;
      }
    }
  }

  return true;
}

function isValidPlacement(
  board: CellState[][],
  row: number,
  col: number,
  val: string,
): boolean {
  const startBlockRow = Math.floor(row / 3) * 3;
  const startBlockCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 9; i++) {
    if (board[row][i].value === val) return false;
    if (board[i][col].value === val) return false;

    const br = startBlockRow + Math.floor(i / 3);
    const bc = startBlockCol + (i % 3);

    if (board[br][bc].value === val) return false;
  }

  return true;
}
