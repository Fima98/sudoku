export function createSolvedModal(
  onNextLevel: () => void,
  onMenu: () => void,
): HTMLDivElement {
  const container = document.createElement("div");
  container.className =
    "flex flex-col items-center justify-center gap-4 p-6 bg-[var(--bg-cell)] border-4 border-[var(--border)] select-none w-64";

  const title = document.createElement("h1");
  title.className =
    "text-2xl font-bold text-[var(--text)] tracking-wider uppercase";
  title.textContent = "PUZZLE SOLVED!";

  const buttonsContainer = document.createElement("div");
  buttonsContainer.className = "flex flex-col gap-3 w-full";

  const nextBtn = document.createElement("button");
  nextBtn.className =
    "w-full py-2 bg-[var(--bg-main)] text-[var(--text)] font-bold border-2 border-[var(--border)] cursor-pointer active:bg-[var(--border)] active:text-[var(--bg-cell)] uppercase tracking-wide";
  nextBtn.textContent = "NEXT LEVEL";
  nextBtn.onclick = onNextLevel;

  const menuBtn = document.createElement("button");
  menuBtn.className =
    "w-full py-2 bg-[var(--bg-main)] text-[var(--text)] font-bold border-2 border-[var(--border)] cursor-pointer active:bg-[var(--border)] active:text-[var(--bg-cell)] uppercase tracking-wide";
  menuBtn.textContent = "MAIN MENU";
  menuBtn.onclick = onMenu;

  buttonsContainer.appendChild(nextBtn);
  buttonsContainer.appendChild(menuBtn);

  container.appendChild(title);
  container.appendChild(buttonsContainer);

  return container;
}
