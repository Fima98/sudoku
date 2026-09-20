import "./style.css";
import { createBoard, renderBoard } from "./components/Board";
import { createKeypad } from "./components/Keypad";
import generateGrid from "./lib/generateGrid";
import type { CellState } from "./lib/types";

const app = document.querySelector<HTMLDivElement>("#app");

if (app) {
  app.replaceChildren();

  // type GameState = "menu" | "game";

  // let currentState: GameState = "menu";

  let gridState: CellState[][] = [];
  for (let r = 0; r < 9; r++) {
    const row: CellState[] = [];
    for (let c = 0; c < 9; c++) {
      row.push({ value: null, notes: new Set() });
    }
    gridState.push(row);
  }

  const solvedGrid = generateGrid();

  gridState = solvedGrid;

  let currentTool: { value: string | null; isNote: boolean } = {
    value: null,
    isNote: false,
  };

  const keyPad = createKeypad((val, isNote) => {
    currentTool = { value: val, isNote };
  });

  const board = createBoard((cell) => {
    if (!currentTool.value) return;

    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    const cellData = gridState[row][col];

    const val = currentTool.value;

    if (currentTool.isNote) {
      cellData.value = null;

      if (cellData.notes.has(val)) {
        cellData.notes.delete(val);
      } else {
        cellData.notes.add(val);
      }

      let notesGrid = cell.querySelector<HTMLDivElement>(".notes-grid");

      if (!notesGrid) {
        cell.replaceChildren();
        notesGrid = document.createElement("div");
        notesGrid.className =
          "notes-grid absolute inset-0 grid grid-cols-3 grid-rows-3 text-[8px] leading-none text-[var(--border)] opacity-70 p-0.5 pointer-events-none";

        for (let i = 1; i <= 9; i++) {
          const span = document.createElement("span");
          span.className = "flex items-center justify-center";
          span.dataset.note = i.toString();
          notesGrid.appendChild(span);
        }
        cell.appendChild(notesGrid);
      }

      const noteSpan = notesGrid.querySelector<HTMLSpanElement>(
        `[data-note="${val}"]`,
      );
      if (noteSpan) {
        noteSpan.textContent = cellData.notes.has(val) ? val : "";
      }
    } else {
      if (cellData.value === val) {
        cellData.value = null;
      } else {
        cellData.value = val;
        cellData.notes.clear();
      }

      cell.replaceChildren();
      cell.style.color = "var(--text)";
      cell.style.fontSize = "18px";

      if (cellData.value) {
        cell.textContent = cellData.value;
      }
    }
  });

  renderBoard(board, gridState);

  app.appendChild(board);
  app.appendChild(keyPad);
}
