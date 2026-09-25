export function createMenu(
  onStartGame: (holes: number) => void,
): HTMLDivElement {
  const container = document.createElement("div");
  container.className =
    "flex flex-col items-center justify-center gap-4 p-6 bg-[var(--bg-cell)] border-4 border-[var(--border)] select-none w-64";

  const title = document.createElement("h1");
  title.className =
    "text-2xl font-bold text-[var(--text)] tracking-wider uppercase";
  title.textContent = "SUDOKU";

  const buttonsContainer = document.createElement("div");
  buttonsContainer.className = "flex flex-col gap-3 w-full";

  const levels = [
    { label: "EASY", holes: 30 },
    { label: "MEDIUM", holes: 45 },
    { label: "HARD", holes: 60 },
  ];

  levels.forEach(({ label, holes }) => {
    const btn = document.createElement("button");
    btn.className =
      "w-full py-2 bg-[var(--bg-main)] text-[var(--text)] font-bold border-2 border-[var(--border)] cursor-pointer active:bg-[var(--border)] active:text-[var(--bg-cell)] uppercase tracking-wide";
    btn.textContent = label;
    btn.onclick = () => onStartGame(holes);
    buttonsContainer.appendChild(btn);
  });

  container.appendChild(title);
  container.appendChild(buttonsContainer);

  return container;
}
