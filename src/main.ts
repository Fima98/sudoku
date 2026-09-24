import "./style.css";
import { createBoard, renderBoard } from "./components/Board";
import { createKeypad } from "./components/Keypad";
import { generateGrid, pokeHoles } from "./lib/generateGrid";

const app = document.querySelector<HTMLDivElement>("#app");

if (app) {
  app.replaceChildren();

  // type GameState = "menu" | "game" | "victory";

  // let currentState: GameState = "menu";

  const solvedGrid = generateGrid();
  const gridState = pokeHoles(solvedGrid, 40);

  let selectedCell: {
    row: number;
    col: number;
    element: HTMLElement;
  } | null = null;

  const board = createBoard((cell) => {
    if (selectedCell?.element) {
      selectedCell.element.style.backgroundColor = "";
    }

    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);

    selectedCell = { row, col, element: cell };
    cell.style.backgroundColor = "var(--bg-selected)";
  });

  const keyPad = createKeypad((val, isNote) => {
    if (!selectedCell || !val) return;

    const { row, col, element: cell } = selectedCell;
    const cellData = gridState[row][col];

    if (cellData.value === solvedGrid[row][col].value) return;

    if (isNote) {
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
      cell.style.fontSize = "18px";
      const isError =
        cellData.value !== null &&
        cellData.value !== solvedGrid[row][col].value;

      if (isError) {
        cell.style.backgroundColor = "var(--bg-error, #8b0f0f)";
        cell.style.color = "var(--text-error, #cadc82)";
      } else {
        cell.style.backgroundColor = "var(--bg-selected)";
        cell.style.color = "var(--text)";
      }

      if (cellData.value) {
        cell.textContent = cellData.value;
      }

      const isVictory = gridState.every((row, r) =>
        row.every((cell, c) => cell.value === solvedGrid[r][c].value),
      );

      if (isVictory) {
        console.log("VICTORY");
      }
    }
  });

  renderBoard(board, gridState);

  app.appendChild(board);
  app.appendChild(keyPad);
}
