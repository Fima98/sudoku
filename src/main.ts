import "./style.css";
import { createBoard, renderBoard } from "./components/Board";
import { createKeypad } from "./components/Keypad";
import { generateGrid, pokeHoles } from "./lib/generateGrid";
import { createMenu } from "./components/Menu";
import { createSolvedModal } from "./components/Solved";

const SAVE_KEY = "sudoku_game_save";

function saveGame() {
  if (!gridState || !solvedGrid) return;
  const serializedGrid = gridState.map((row) =>
    row.map((cell) => ({
      value: cell.value,
      notes: Array.from(cell.notes),
    })),
  );
  localStorage.setItem(
    SAVE_KEY,
    JSON.stringify({ solvedGrid, gridState: serializedGrid, currentHoles }),
  );
}

function loadGame(): boolean {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return false;
  try {
    const data = JSON.parse(raw);
    solvedGrid = data.solvedGrid;
    currentHoles = data.currentHoles;
    gridState = data.gridState.map((row: any[]) =>
      row.map((cell: any) => ({
        value: cell.value,
        notes: new Set(cell.notes),
      })),
    );
    return true;
  } catch {
    return false;
  }
}

function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}

const app = document.querySelector<HTMLDivElement>("#app");
type GameState = "menu" | "game" | "victory";
let currentState: GameState = "menu";
let currentHoles: number;

let solvedGrid: ReturnType<typeof generateGrid>;
let gridState: ReturnType<typeof pokeHoles>;

function render() {
  if (!app) return;
  app.replaceChildren();

  if (currentState === "menu") {
    const hasSave = localStorage.getItem(SAVE_KEY) !== null;
    const menu = createMenu(
      (holes) => {
        clearSave();
        currentHoles = holes;
        solvedGrid = generateGrid();
        gridState = pokeHoles(solvedGrid, holes);
        saveGame();

        currentState = "game";
        render();
      },
      () => {
        if (loadGame()) {
          currentState = "game";
          render();
        }
      },
      hasSave,
    );
    app.appendChild(menu);
  }

  if (currentState === "game") {
    const header = document.createElement("div");
    header.className =
      "flex justify-between items-center w-full max-w-[288px] mb-2";

    const pauseBtn = document.createElement("button");
    pauseBtn.className =
      "px-3 py-1 text-xs font-bold bg-[var(--bg-cell)] border-2 border-[var(--border)] text-[var(--text)] uppercase cursor-pointer active:bg-[var(--border)] active:text-[var(--bg-cell)]";
    pauseBtn.textContent = "PAUSE";
    pauseBtn.onclick = () => {
      saveGame();
      currentState = "menu";
      render();
    };

    header.appendChild(pauseBtn);
    app.appendChild(header);

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
          currentState = "victory";
          render();
        }
      }
    });

    renderBoard(board, gridState);
    app.appendChild(board);
    app.appendChild(keyPad);
  }

  if (currentState === "victory") {
    const solvedModal = createSolvedModal(
      () => {
        solvedGrid = generateGrid();
        gridState = pokeHoles(solvedGrid, currentHoles);
        currentState = "game";
        render();
      },
      () => {
        currentState = "menu";
        render();
      },
    );
    app.appendChild(solvedModal);
  }
}

render();
