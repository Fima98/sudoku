import type { CellState } from "../lib/types";

export function createBoard(
  onCellSelect: (cell: HTMLElement) => void,
): HTMLDivElement {
  const container = document.createElement("div");
  container.className =
    "grid grid-cols-3 gap-1 bg-[var(--border)] border-4 border-[var(--border)] w-fit";

  for (let blockIdx = 0; blockIdx < 9; blockIdx++) {
    const block = document.createElement("div");
    block.className = "grid grid-cols-3 gap-px bg-[var(--border)]";

    for (let cellIdx = 0; cellIdx < 9; cellIdx++) {
      const row = Math.floor(blockIdx / 3) * 3 + Math.floor(cellIdx / 3);
      const col = (blockIdx % 3) * 3 + (cellIdx % 3);

      const cell = document.createElement("div");
      cell.className =
        "relative bg-[var(--bg-cell)] flex justify-center w-8 h-8 items-center font-bold cursor-pointer select-none";

      cell.dataset.row = row.toString();
      cell.dataset.col = col.toString();

      block.appendChild(cell);
    }

    container.appendChild(block);
  }

  container.addEventListener("click", (e) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>("[data-row]");
    if (!target) return;

    onCellSelect(target);
  });

  return container;
}

export function renderBoard(boardEl: HTMLElement, state: CellState[][]) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = boardEl.querySelector<HTMLElement>(
        `[data-row="${r}"][data-col="${c}"]`,
      );
      if (!cell) continue;
      const cellData = state[r][c];
      if (cellData.value) {
        cell.replaceChildren();
        cell.textContent = cellData.value;
      }
    }
  }
}
