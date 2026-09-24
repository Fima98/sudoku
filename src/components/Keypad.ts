export function createKeypad(
  onSelect: (value: string, isNote: boolean) => void,
): HTMLDivElement {
  const container = document.createElement("div");
  container.className = "flex flex-col gap-2 mt-4 select-none";

  const mainRow = document.createElement("div");
  mainRow.className = "flex gap-1";

  const notesRow = document.createElement("div");
  notesRow.className = "flex gap-1 opacity-50";

  for (let i = 1; i <= 9; i++) {
    const num = i.toString();

    const mainBtn = document.createElement("button");
    mainBtn.className =
      "w-8 h-8 bg-[var(--bg-cell)] text-[var(--text)] active:bg-[var(--border)] active:text-[var(--bg-cell)] font-bold border-2 border-[var(--border)] cursor-pointer";
    mainBtn.textContent = num;
    mainBtn.onclick = () => onSelect(num, false);
    mainRow.appendChild(mainBtn);

    const noteBtn = document.createElement("button");
    noteBtn.className =
      "w-8 h-8 bg-[var(--bg-cell)] text-[var(--border)] active:bg-[var(--border)] active:text-[var(--bg-cell)] font-bold border border-[var(--border)] cursor-pointer";
    noteBtn.textContent = num;
    noteBtn.onclick = () => onSelect(num, true);
    notesRow.appendChild(noteBtn);
  }

  container.appendChild(mainRow);
  container.appendChild(notesRow);
  return container;
}
