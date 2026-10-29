const WORD_LENGTH = 5;
const MAX_GUESSES = 6;
const STORAGE_KEY = "word-guess-game";

const WORD_BANK = [
  "AUDIO", "BANCO", "BOLSA", "BRUXA", "CANTO", "CASAL", "CHAVE", "CIELO", "CLIMA",
  "COMER", "DENTE", "FELIZ", "FONTE", "JOVEM", "LIVRO", "LUZES", "MAGIA", "MELAO",
  "PAPEL", "PRAIA", "PULAR", "RIVAL", "TERRA", "VITOR", "VIVAS", "XADRE", "ZEBRA"
];

function createEmptyBoard() {
  return Array.from({ length: MAX_GUESSES }, () => Array(WORD_LENGTH).fill(""));
}

function getStoredGame() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.solution) return null;
    return parsed;
  } catch (error) {
    return null;
  }
}

function loadState() {
  const saved = getStoredGame();
  const defaultState = {
    mode: "daily",
    solution: "",
    board: createEmptyBoard(),
    rowIndex: 0,
    colIndex: 0,
    status: "playing",
    keyboardState: {},
    messages: [],
    stats: loadStats(),
  };

  if (!saved) return defaultState;

  return {
    ...defaultState,
    ...saved,
    board: Array.isArray(saved.board) ? saved.board.map((row) => row.slice(0, WORD_LENGTH).concat(Array(Math.max(WORD_LENGTH - row.length, 0)).fill(""))) : createEmptyBoard(),
    keyboardState: saved.keyboardState || {},
    messages: Array.isArray(saved.messages) ? saved.messages : [],
    stats: loadStats(),
  };
}

const state = loadState();

const boardElement = document.getElementById("board");
const keyboardElement = document.getElementById("keyboard");
const statusElement = document.getElementById("status");
const resultModal = document.getElementById("resultModal");
const modalMessage = document.getElementById("modalMessage");
const streakValue = document.getElementById("streakValue");
const winsValue = document.getElementById("winsValue");
const playedValue = document.getElementById("playedValue");

function makeDailyWord(date = new Date()) {
  const iso = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString().slice(0, 10);
  const hash = [...iso].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return WORD_BANK[hash % WORD_BANK.length];
}

function loadStats() {
  try {
    const stored = JSON.parse(localStorage.getItem("word-guess-stats") || "{}");
    return {
      streak: Number(stored.streak) || 0,
      wins: Number(stored.wins) || 0,
      played: Number(stored.played) || 0,
    };
  } catch (error) {
    return { streak: 0, wins: 0, played: 0 };
  }
}

function saveGameState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      mode: state.mode,
      solution: state.solution,
      board: state.board,
      rowIndex: state.rowIndex,
      colIndex: state.colIndex,
      status: state.status,
      keyboardState: state.keyboardState,
      messages: state.messages,
    })
  );
}

function saveStats() {
  localStorage.setItem("word-guess-stats", JSON.stringify(state.stats));
  updateStatsUI();
}

function updateStatsUI() {
  streakValue.textContent = String(state.stats.streak);
  winsValue.textContent = String(state.stats.wins);
  playedValue.textContent = String(state.stats.played);
}

function createBoard() {
  boardElement.innerHTML = "";

  for (let row = 0; row < MAX_GUESSES; row += 1) {
    const rowEl = document.createElement("div");
    rowEl.className = "row";

    for (let col = 0; col < WORD_LENGTH; col += 1) {
      const cellEl = document.createElement("div");
      cellEl.className = "cell";
      cellEl.dataset.row = String(row);
      cellEl.dataset.col = String(col);
      rowEl.appendChild(cellEl);
    }

    boardElement.appendChild(rowEl);
  }
}

function setStatus(message, type = "") {
  statusElement.textContent = message;
  statusElement.className = "status";
  if (type) {
    statusElement.classList.add(type);
  }
}

function renderBoard() {
  const rows = boardElement.querySelectorAll(".row");

  rows.forEach((rowEl, rowIndex) => {
    const cells = rowEl.querySelectorAll(".cell");
    cells.forEach((cellEl, colIndex) => {
      const letter = state.board[rowIndex][colIndex] || "";
      const revealed = state.messages[rowIndex]?.[colIndex];
      cellEl.textContent = letter;
      cellEl.classList.remove("filled", "correct", "present", "absent", "revealed");

      if (letter) {
        cellEl.classList.add("filled");
      }

      if (revealed) {
        cellEl.classList.add(revealed);
        cellEl.classList.add("revealed");
      }
    });
  });
}

function getKeyboardRows() {
  return [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];
}

function renderKeyboard() {
  keyboardElement.innerHTML = "";

  getKeyboardRows().forEach((rowLetters) => {
    const rowEl = document.createElement("div");
    rowEl.className = "keyboard-row";

    rowLetters.forEach((letter) => {
      const keyEl = document.createElement("button");
      keyEl.type = "button";
      keyEl.className = "key";
      keyEl.textContent = letter;
      keyEl.dataset.key = letter;

      if (state.keyboardState[letter]) {
        keyEl.classList.add(state.keyboardState[letter]);
      }

      keyEl.addEventListener("click", () => handleKey(letter));
      rowEl.appendChild(keyEl);
    });

    if (rowLetters.length === 3) {
      const deleteKey = document.createElement("button");
      deleteKey.type = "button";
      deleteKey.className = "key";
      deleteKey.textContent = "⌫";
      deleteKey.dataset.key = "BACKSPACE";
      deleteKey.addEventListener("click", () => handleKey("BACKSPACE"));
      rowEl.appendChild(deleteKey);
    }

    if (rowLetters.length === 10 || rowLetters.length === 9) {
      const enterKey = document.createElement("button");
      enterKey.type = "button";
      enterKey.className = "key";
      enterKey.textContent = "ENTER";
      enterKey.dataset.key = "ENTER";
      enterKey.addEventListener("click", () => handleKey("ENTER"));
      rowEl.appendChild(enterKey);
    }

    keyboardElement.appendChild(rowEl);
  });
}

function getCurrentGuess() {
  return state.board[state.rowIndex].slice(0, state.colIndex).join("");
}

function handleKey(key) {
  if (state.status !== "playing") return;

  if (key === "BACKSPACE") {
    if (state.colIndex > 0) {
      state.colIndex -= 1;
      state.board[state.rowIndex][state.colIndex] = "";
      renderBoard();
      saveGameState();
    }
    return;
  }

  if (key === "ENTER") {
    submitGuess();
    return;
  }

  if (/^[A-Z]$/i.test(key) && state.colIndex < WORD_LENGTH) {
    state.board[state.rowIndex][state.colIndex] = key.toUpperCase();
    state.colIndex += 1;
    renderBoard();
    saveGameState();
  }
}

function evaluateGuess(guess, answer) {
  const result = Array(guess.length).fill("absent");
  const remaining = {};

  for (let index = 0; index < answer.length; index += 1) {
    if (guess[index] === answer[index]) {
      result[index] = "correct";
    } else {
      remaining[answer[index]] = (remaining[answer[index]] || 0) + 1;
    }
  }

  for (let index = 0; index < guess.length; index += 1) {
    if (result[index] === "correct") continue;
    if (remaining[guess[index]]) {
      result[index] = "present";
      remaining[guess[index]] -= 1;
    }
  }

  return result;
}

function submitGuess() {
  const guess = getCurrentGuess();

  if (state.colIndex < WORD_LENGTH) {
    setStatus("Faltam letras para completar a palavra.", "error");
    return;
  }

  if (!WORD_BANK.includes(guess)) {
    setStatus("Palavra inválida. Tente outra.", "error");
    return;
  }

  const result = evaluateGuess(guess, state.solution);
  state.messages[state.rowIndex] = result;

  result.forEach((status, index) => {
    const letter = guess[index];
    if (status === "correct") {
      state.keyboardState[letter] = "correct";
    } else if (status === "present" && state.keyboardState[letter] !== "correct") {
      state.keyboardState[letter] = "present";
    } else if (!state.keyboardState[letter]) {
      state.keyboardState[letter] = "absent";
    }
  });

  renderBoard();
  renderKeyboard();

  const matched = guess === state.solution;

  if (matched) {
    state.status = "won";
    state.stats.wins += 1;
    state.stats.streak += 1;
    state.stats.played += 1;
    saveStats();
    saveGameState();
    setStatus("Você venceu!", "success");
    openModal(`Parabéns! A palavra era ${state.solution}.`, "Vitória");
    return;
  }

  state.rowIndex += 1;
  state.colIndex = 0;

  if (state.rowIndex >= MAX_GUESSES) {
    state.status = "lost";
    state.stats.played += 1;
    state.stats.streak = 0;
    saveStats();
    saveGameState();
    setStatus("Fim de jogo. A palavra era " + state.solution + ".", "error");
    openModal(`Você perdeu. A palavra era ${state.solution}.`, "Derrota");
    return;
  }

  setStatus("Boa tentativa! Continue.");
  saveGameState();
}

function openModal(message, title = "Resultado") {
  modalMessage.textContent = message;
  document.getElementById("modalTitle").textContent = title;
  resultModal.classList.remove("hidden");
  resultModal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  resultModal.classList.add("hidden");
  resultModal.setAttribute("aria-hidden", "true");
}

function resetState() {
  state.board = createEmptyBoard();
  state.rowIndex = 0;
  state.colIndex = 0;
  state.status = "playing";
  state.messages = [];
  state.keyboardState = {};
  setStatus("Jogo iniciado. Tente adivinhar a palavra.");
  renderBoard();
  renderKeyboard();
  closeModal();
  saveGameState();
}

function syncModeButtons() {
  const dailyButton = document.getElementById("dailyToggle");
  const randomButton = document.getElementById("randomToggle");
  const isDaily = state.mode === "daily";
  dailyButton.classList.toggle("active", isDaily);
  randomButton.classList.toggle("active", !isDaily);
}

function startGame(mode = state.mode) {
  state.mode = mode;
  state.solution = mode === "daily" ? makeDailyWord() : WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
  syncModeButtons();
  resetState();
}

function shareResult() {
  const resultText = state.status === "won"
    ? `🎉 Ganhei no ${state.rowIndex + 1}º chute!\nPalavra do Dia: ${state.solution}`
    : `😅 Tentei outra vez!\nPalavra do Dia: ${state.solution}`;

  const shareText = `Palavra do Dia\n${resultText}`;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(shareText)
      .then(() => setStatus("Resultado copiado para a área de transferência.", "success"))
      .catch(() => setStatus("Não foi possível copiar automaticamente.", "error"));
    return;
  }

  setStatus("Seu navegador não suporta cópia automática.", "error");
}

function bindEvents() {
  document.addEventListener("keydown", (event) => {
    const key = event.key.toUpperCase();

    if (key === "ENTER") {
      handleKey("ENTER");
      return;
    }

    if (key === "BACKSPACE" || key === "DELETE") {
      handleKey("BACKSPACE");
      return;
    }

    if (/^[A-Z]$/.test(key)) {
      handleKey(key);
    }
  });

  document.getElementById("newGameBtn").addEventListener("click", () => startGame(state.mode));
  document.getElementById("shareBtn").addEventListener("click", shareResult);
  document.getElementById("modalPlayAgain").addEventListener("click", () => startGame(state.mode));
  document.getElementById("modalShare").addEventListener("click", shareResult);

  document.getElementById("dailyToggle").addEventListener("click", () => {
    const dailyButton = document.getElementById("dailyToggle");
    const randomButton = document.getElementById("randomToggle");
    dailyButton.classList.add("active");
    randomButton.classList.remove("active");
    startGame("daily");
  });

  document.getElementById("randomToggle").addEventListener("click", () => {
    const dailyButton = document.getElementById("dailyToggle");
    const randomButton = document.getElementById("randomToggle");
    randomButton.classList.add("active");
    dailyButton.classList.remove("active");
    startGame("random");
  });
}

function restoreSavedGame() {
  const saved = getStoredGame();
  if (!saved) return false;

  state.mode = saved.mode || "daily";
  state.solution = saved.solution || "";
  state.board = Array.isArray(saved.board) ? saved.board.map((row) => row.slice(0, WORD_LENGTH).concat(Array(Math.max(WORD_LENGTH - row.length, 0)).fill(""))) : createEmptyBoard();
  state.rowIndex = Number(saved.rowIndex) || 0;
  state.colIndex = Number(saved.colIndex) || 0;
  state.status = saved.status || "playing";
  state.keyboardState = saved.keyboardState || {};
  state.messages = Array.isArray(saved.messages) ? saved.messages : [];
  return true;
}

function init() {
  createBoard();
  bindEvents();
  updateStatsUI();

  if (restoreSavedGame()) {
    syncModeButtons();
    setStatus("Partida restaurada.");
    renderBoard();
    renderKeyboard();
    return;
  }

  startGame("daily");
}

init();
