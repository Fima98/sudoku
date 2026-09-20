import type { CellState } from "./types";

export function generateGrid() {
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

export function pokeHoles(solvedGrid: CellState[][], holesToPoke = 40) {
  const puzzle: CellState[][] = solvedGrid.map((row) =>
    row.map((cell) => ({ value: cell.value, notes: new Set(cell.notes) })),
  );

  const positions: { r: number; c: number }[] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      // const val = puzzle[r][c].value;
      // puzzle[r][c].value = null;
      // const solutions = countSolution(puzzle);
      // if (solutions >= 2) puzzle[r][c].value = val;
      positions.push({ r, c });
    }
  }
  positions.sort(() => Math.random() - 0.5);

  let holesMade = 0;
  for (const pos of positions) {
    if (holesMade >= holesToPoke) break;

    const { r, c } = pos;
    const val = puzzle[r][c].value;
    puzzle[r][c].value = null;
    const solutions = countSolution(puzzle, { value: 0 });
    if (solutions >= 2) {
      puzzle[r][c].value = val;
    } else {
      holesMade++;
    }
  }

  return puzzle;
}

function countSolution(board: CellState[][], count = { value: 0 }) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c].value === null) {
        for (let i = 1; i <= 9; i++) {
          const val = i.toString();

          if (isValidPlacement(board, r, c, val)) {
            board[r][c].value = val;

            countSolution(board, count);

            board[r][c].value = null;

            if (count.value >= 2) return count.value;
          }
        }
        return count.value;
      }
    }
  }

  count.value++;
  return count.value;
}
