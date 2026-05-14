(() => {
  const TOTAL_PUZZLES = 64;
  const STORAGE_KEY = "puzzleAppState";
  // Map each puzzle (1-64) to a color from the workflow icon. When solved, displays this color.
  // Grid layout: 8 cols × 8 rows
  const PUZZLE_COLORS = {
    // Row 1: Empty(bg), Box, Box, Box, Box, Box, Box, Empty
    1: "#f0f0f0", 2: "#4a90e2", 3: "#4a90e2", 4: "#4a90e2", 5: "#4a90e2", 6: "#4a90e2", 7: "#4a90e2", 8: "#f0f0f0",
    // Row 2: Box, Box, Arrow, Arrow, Arrow, Arrow, Arrow, Box
    9: "#4a90e2", 10: "#4a90e2", 11: "#f39c12", 12: "#f39c12", 13: "#f39c12", 14: "#f39c12", 15: "#f39c12", 16: "#7cb342",
    // Row 3: Empty, Empty, Empty, Box, Box, Box, Empty, Empty
    17: "#f0f0f0", 18: "#f0f0f0", 19: "#f0f0f0", 20: "#e74c3c", 21: "#e74c3c", 22: "#e74c3c", 23: "#f0f0f0", 24: "#f0f0f0",
    // Row 4: Empty, Arrow, Arrow, Arrow, Arrow, Arrow, Arrow, Empty
    25: "#f0f0f0", 26: "#f39c12", 27: "#f39c12", 28: "#f39c12", 29: "#f39c12", 30: "#f39c12", 31: "#f39c12", 32: "#f0f0f0",
    // Row 5: Box, Box, Arrow, Arrow, Arrow, Arrow, Arrow, Box
    33: "#9b59b6", 34: "#9b59b6", 35: "#f39c12", 36: "#f39c12", 37: "#f39c12", 38: "#f39c12", 39: "#f39c12", 40: "#1abc9c",
    // Row 6: Empty, Empty, Empty, Box, Box, Box, Empty, Empty
    41: "#f0f0f0", 42: "#f0f0f0", 43: "#f0f0f0", 44: "#3498db", 45: "#3498db", 46: "#3498db", 47: "#f0f0f0", 48: "#f0f0f0",
    // Row 7: Empty, Arrow, Arrow, Arrow, Arrow, Arrow, Arrow, Empty
    49: "#f0f0f0", 50: "#f39c12", 51: "#f39c12", 52: "#f39c12", 53: "#f39c12", 54: "#f39c12", 55: "#f39c12", 56: "#f0f0f0",
    // Row 8: Empty, Empty, Empty, Box, Box, Box, Empty, Empty
    57: "#f0f0f0", 58: "#f0f0f0", 59: "#f0f0f0", 60: "#2ecc71", 61: "#2ecc71", 62: "#2ecc71", 63: "#f0f0f0", 64: "#f0f0f0"
  };
  const PUZZLE_6_NOTE_FREQUENCIES = {
    C4: 261.63,
    D4: 293.66,
    E4: 329.63,
    F4: 349.23,
    G4: 392.0,
    A4: 440.0,
    B4: 493.88
  };
  const PUZZLE_6_TARGET_MELODY = ["C4", "E4", "G4", "E4", "C4"];
  const CAESAR_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const PUZZLE_12_DEBUG_MODE = true;

  // Centralized puzzle data: define title, content and solution for each puzzle (1-64)
  // Edit these to customize each puzzle
  const PUZZLE_DATA = {};
  for (let i = 1; i <= TOTAL_PUZZLES; i += 1) {
    PUZZLE_DATA[i] = {
      title: `Zagadka ${i}`,
      content: `<p><strong>Treść zagadki ${i}...</strong></p><p>Dodaj specjalną treść dla tej zagadki tutaj.</p>`,
      solution: ""
    };
  }

//   Example: Custom puzzle data (uncomment and modify to override defaults)
  PUZZLE_DATA[1] = {
    title: "Zagadka 1: Na Rozgrzewkę",
    content: `<p><strong>Aby zaliczyć zagadkę musisz wymyślić rozwiązanie, wpisać je w pole powyżej  i naciśnij przycisk Sprawdź. Rozwiązanie tej zagadki to hasło: początek</strong></p>`,
    solution: "początek"
  };
  PUZZLE_DATA[2] = {
    title: "Zagadka 2: Na głowie",
    content: `<div style="display: grid; place-items: center;">
  <img src="img/Z2.png" alt="" style="width: 100%; max-width: 560px; height: auto; display: block; border-radius: 4px;">
</div>`,
    solution: "test"
  };
  PUZZLE_DATA[3] = {
    title: "Zagadka 3: Coś Szybkiego",
    content: `<p><strong>
<p>STYCZEŃ = 7  
<p>LUTY = 4  
<p>MARZEC = 7  
<p>KWIECIEŃ = 9  
<p>MAJ = ?
</p>`,
    solution: "3"
  };
  PUZZLE_DATA[4] = {
   title: "Zagadka 4: Coś tu nie pasuje...",
    content: "<p><strong>2, 4, 8, 16, 31, 64, 128",
    solution: "31"
  };
  PUZZLE_DATA[5] = {
   title: "Zagadka 5: Bez sensu?",
        content: `<p><strong>
<p>0 = 4
<p>1 = 5
<p>2 = 3
<p>3 = 4
<p>4 = 6
<p>5 = ?
</p>`,
    solution: "31"
  };
  PUZZLE_DATA[6] = {
    title: "Zagadka 6: Pianino",
    content: `<div class="piano-puzzle">
  <p><strong>Zagraj poprawną melodię, aby odkryć hasło.</strong></p>
  <p class="piano-instruction">Podpowiedź: zacznij od C i wróć do C po trzech kolejnych dźwiękach.</p>
  <div class="piano-keyboard" role="group" aria-label="Klawiatura pianina">
    <button type="button" class="piano-key" data-piano-note="C4">C</button>
    <button type="button" class="piano-key" data-piano-note="D4">D</button>
    <button type="button" class="piano-key" data-piano-note="E4">E</button>
    <button type="button" class="piano-key" data-piano-note="F4">F</button>
    <button type="button" class="piano-key" data-piano-note="G4">G</button>
    <button type="button" class="piano-key" data-piano-note="A4">A</button>
    <button type="button" class="piano-key" data-piano-note="B4">B</button>
  </div>
  <div class="piano-status">
    <p id="puzzle6Progress" aria-live="polite">Postęp melodii: 0/${PUZZLE_6_TARGET_MELODY.length}</p>
    <p id="puzzle6Result" class="piano-result" aria-live="polite"></p>
  </div>
  <button type="button" id="puzzle6Reset" class="small-btn">Wyczyść melodię</button>
</div>`,
    solution: "fortepian"
  };
  PUZZLE_DATA[7] = {
    title: "Zagadka 7: Pechowy cesarz",
    content: `<div class="caesar-helper">
  <p><strong>xelcgbtensvn</p>
  <div class="caesar-row-wrap">
    <div class="caesar-row">
      <button type="button" class="caesar-shift-btn" data-caesar-row="top" data-caesar-shift="-1" aria-label="Przesun wiersz A w lewo">◀</button>
      <div class="caesar-track" role="img" aria-label="">
        <span id="puzzle7TopAlphabet" class="caesar-alphabet"></span>
      </div>
      <button type="button" class="caesar-shift-btn" data-caesar-row="top" data-caesar-shift="1" aria-label="Przesun wiersz A w prawo">▶</button>
      <p id="puzzle7TopShift" class="caesar-shift-value" aria-live="polite"></p>
    </div>
  </div>
  <div class="caesar-row-wrap">
    <div class="caesar-row">
      <button type="button" class="caesar-shift-btn" data-caesar-row="bottom" data-caesar-shift="-1" aria-label="Przesun wiersz B w lewo">◀</button>
      <div class="caesar-track" role="img" aria-label="">
        <span id="puzzle7BottomAlphabet" class="caesar-alphabet"></span>
      </div>
      <button type="button" class="caesar-shift-btn" data-caesar-row="bottom" data-caesar-shift="1" aria-label="Przesun wiersz B w prawo">▶</button>
      <p id="puzzle7BottomShift" class="caesar-shift-value" aria-live="polite"></p>
    </div>
  </div>
  
  <button type="button" id="puzzle7Reset" class="small-btn">Resetuj przesuniecia</button>
</div>`,
    solution: "kryptografia"
  };
  PUZZLE_DATA[8] = {
    title: "Zagadka 8: Dziwne liczby",
    content: `<p><strong><center>43.51474950100621, 16.443521243705444</strong></p>`,
    solution: "Split"
  };
  PUZZLE_DATA[9] = {
    title: "Zagadka 9: Będzie jakaś zniżka?",
    content: `<div style="display: grid; place-items: center;">
  <img src="img/shape.png" alt="" style="width: 100%; max-width: 560px; height: auto; display: block; border-radius: 4px;">
</div>`,
    solution: "Rabat"
  };
  PUZZLE_DATA[10] = {
    title: "Zagadka 10: Gdzie on się podział?",
    content: `<div class="puzzle10-image-wrap">
  <img src="img/dachy.png" alt="" class="puzzle10-image">
  <button type="button" class="puzzle-hotspot-btn" aria-label="Ukryty punkt na obrazku" title="Ukryty punkt na obrazku"></button>
</div>`,
    solution: "Filuś"
  };
  PUZZLE_DATA[11] = {
    title: "Zagadka 11: Czas Prawdy",
    content: `<div class="time-lock-puzzle">
  <p><strong>Kliknij przycisk, aby poznać rozwiązanie.</strong></p>
  <button type="button" id="puzzle11RevealBtn" class="small-btn">Poznaj rozwiązanie</button>
  <p><strong>Dwa filary, dwie przepaście...</strong></p>
  <p id="puzzle11RevealStatus" aria-live="polite"></p>
</div>`,
    solution: "todo"
  };
  PUZZLE_DATA[12] = {
    title: "Zagadka 12: Stare zamki są pełne potworów...",
    content: `<div class="puzzle12-image-wrap">
  <img src="img/20230610_140159.jpg" alt="" class="puzzle12-image">
  <div class="puzzle-hover-hint" title="Łeeeee, co to jest???"></div>
</div>`,
    solution: "pająk",
    hint1: "W starych zamkach jest bardzo ciemno...",
    hint2: "Skup się na ciemniejszych obszarach zdjęcia, a może znajdziesz podpowiedź odnośnie tego gdzie szukać rozwiązania...",
    hint3: "Może jest jakiś sposób żeby wydobyć więcej informacji z tego zdjęcia?", 
    hint4: "Pobaw się jasnością, kontrastem, nasyceniem..."
  };
  PUZZLE_DATA[13] = {
    title: "Zagadka 13: Hej, ale to przecież nie są mapy!",
    content: `<div style="display:grid; gap:12px; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); align-items:start;">
  <img src="https://flagcdn.com/w320/ke.png" alt="" style="width:100%; height:auto; display:block; border-radius:4px; border:1px solid #d8c8b5;">
  <img src="https://flagcdn.com/w320/ao.png" alt="" style="width:100%; height:auto; display:block; border-radius:4px; border:1px solid #d8c8b5;">
  <img src="https://flagcdn.com/w320/ro.png" alt="" style="width:100%; height:auto; display:block; border-radius:4px; border:1px solid #d8c8b5;">
  <img src="https://flagcdn.com/w320/tr.png" alt="" style="width:100%; height:auto; display:block; border-radius:4px; border:1px solid #d8c8b5;">
  <img src="https://flagcdn.com/w320/om.png" alt="" style="width:100%; height:auto; display:block; border-radius:4px; border:1px solid #d8c8b5;">
  <img src="https://flagcdn.com/w320/gr.png" alt="" style="width:100%; height:auto; display:block; border-radius:4px; border:1px solid #d8c8b5;">
  <img src="https://flagcdn.com/w320/rw.png" alt="" style="width:100%; height:auto; display:block; border-radius:4px; border:1px solid #d8c8b5;">
  <img src="https://flagcdn.com/w320/af.png" alt="" style="width:100%; height:auto; display:block; border-radius:4px; border:1px solid #d8c8b5;">
  <img src="https://flagcdn.com/w320/fi.png" alt="" style="width:100%; height:auto; display:block; border-radius:4px; border:1px solid #d8c8b5;">
  <img src="https://flagcdn.com/w320/in.png" alt="" style="width:100%; height:auto; display:block; border-radius:4px; border:1px solid #d8c8b5;">
  <img src="https://flagcdn.com/w320/ad.png" alt="" style="width:100%; height:auto; display:block; border-radius:4px; border:1px solid #d8c8b5;">
</div>`,
    solution: "weksylologia"
  };
  PUZZLE_DATA[19] = {
    //TODO
    title: "Zagadka 19: Czy go słyszysz?",
    content: `<div class="time-lock-puzzle">
  <button type="button" id="puzzle19MoonBtn" class="small-btn">Spróbuj rozwiązać</button>
  <p id="puzzle19MoonStatus" aria-live="polite"></p>
</div>`,
    solution: "TODO"
  };
  PUZZLE_DATA[20] = {
    title: "Zagadka 20",
    content: `<p><strong>W tej chwili w wagonie zaczela sie [...]</strong></p><p>ISBN 9788324033331, strona 169</p>`,
    solution: "panika"
  };
  const App = {
    state: null,
    notesSaveTimer: null,
    checkFeedbackTimer: null,
    activeHintContext: null,
    audioContext: null,
    meowAudio: null,
    howlAudio: null,
    puzzle6PlayedNotes: [],
    puzzle7Shifts: {
      top: 0,
      bottom: 0
    },

    els: {
      menuView: null,
      puzzleView: null,
      backToMenuBtn: null,
      prevPuzzleBtn: null,
      nextPuzzleBtn: null,
      puzzleGrid: null,
      puzzleTitle: null,
      puzzleContent: null,
      solutionInput: null,
      markSolvedBtn: null,
      statusBadge: null,
      resetPuzzleBtn: null,
      notesInput: null,
      saveIndicator: null,
      solvedCounter: null
    },

    init() {
      document.body.classList.toggle("puzzle12-debug-mode", PUZZLE_12_DEBUG_MODE);
      this.cacheElements();
      this.state = this.loadState();
      this.ensureHintsState();
      this.renderMenuGrid();
      this.renderSolvedCounter();
      this.renderHintButtons();
      this.bindEvents();
      this.showMenuView();
    },

    cacheElements() {
      this.els.menuView = document.getElementById("menuView");
      this.els.puzzleView = document.getElementById("puzzleView");
      this.els.backToMenuBtn = document.getElementById("backToMenuBtn");
      this.els.prevPuzzleBtn = document.getElementById("prevPuzzleBtn");
      this.els.nextPuzzleBtn = document.getElementById("nextPuzzleBtn");
      this.els.puzzleGrid = document.getElementById("puzzleGrid");
      this.els.puzzleTitle = document.getElementById("puzzleTitle");
      this.els.puzzleContent = document.getElementById("puzzleContent");
      this.els.solutionInput = document.getElementById("solutionInput");
      this.els.markSolvedBtn = document.getElementById("markSolvedBtn");
      this.els.statusBadge = document.getElementById("statusBadge");
      this.els.resetPuzzleBtn = document.getElementById("resetPuzzleBtn");
      this.els.notesInput = document.getElementById("notesInput");
      this.els.saveIndicator = document.getElementById("saveIndicator");
      this.els.solvedCounter = document.getElementById("solvedCounter");
      this.els.exportProgressBtn = document.getElementById("exportProgressBtn");
      this.els.importProgressBtn = document.getElementById("importProgressBtn");
      this.els.solveAllBtn = document.getElementById("solveAllBtn");
      this.els.unsolveAllBtn = document.getElementById("unsolveAllBtn");
      this.els.checkFeedback = document.getElementById("checkFeedback");
      this.els.checkFeedbackTitle = document.getElementById("checkFeedbackTitle");
      this.els.checkFeedbackText = document.getElementById("checkFeedbackText");
      this.els.hintsDetails = document.getElementById("hintsDetails");
      this.els.hintsButtons = document.getElementById("hintsButtons");
      this.els.hintsEmpty = document.getElementById("hintsEmpty");
      this.els.hintPopup = document.getElementById("hintPopup");
      this.els.hintPopupTitle = document.getElementById("hintPopupTitle");
      this.els.hintPopupText = document.getElementById("hintPopupText");
      this.els.hintRevealBtn = document.getElementById("hintRevealBtn");
      this.els.hintCloseBtn = document.getElementById("hintCloseBtn");
    },

    bindEvents() {
      // Event delegation keeps the 8x8 grid lightweight and easy to maintain.
      this.els.puzzleGrid.addEventListener("click", (event) => {
        const button = event.target.closest("[data-puzzle-id]");
        if (!button) {
          return;
        }

        const puzzleId = Number(button.dataset.puzzleId);
        this.openPuzzle(puzzleId);
      });

      this.els.backToMenuBtn.addEventListener("click", () => {
        this.showMenuView();
      });

      this.els.prevPuzzleBtn.addEventListener("click", () => {
        this.goToPreviousPuzzle();
      });

      this.els.nextPuzzleBtn.addEventListener("click", () => {
        this.goToNextPuzzle();
      });

      this.els.markSolvedBtn.addEventListener("click", () => {
        const puzzle = this.getCurrentPuzzle();

        if (puzzle.solved) {
          puzzle.solved = false;
          this.state.puzzles[String(this.state.selectedPuzzle)] = puzzle;
          this.touchPuzzle(puzzle);
          this.saveState();
          this.renderPuzzleView();
          return;
        }

        const inputValue = this.els.solutionInput.value.trim();
        if (!inputValue) {
          this.setSaveIndicator("Wpisz rozwiązanie przed oznaczeniem jako rozwiązane.");
          this.showCheckFeedback(
            "error",
            "Brak odpowiedzi",
            "Najpierw wpisz rozwiązanie, a potem kliknij Sprawdź."
          );
          return;
        }

        const expectedSolution = this.getExpectedSolution(this.state.selectedPuzzle);
        // If a solution is configured, require exact match. If not, allow any answer.
        if (expectedSolution !== null) {
          if (!this.isMatchingSolution(inputValue, expectedSolution)) {
            this.setSaveIndicator("Niepoprawne rozwiązanie. Spróbuj ponownie.");
            this.showCheckFeedback(
              "error",
              "Pudło!",
              "To nie to hasło. Spróbuj jeszcze raz."
            );
            return;
          }
        }

        puzzle.solution = inputValue;
        puzzle.solved = true;
        this.touchPuzzle(puzzle);
        this.state.puzzles[String(this.state.selectedPuzzle)] = puzzle;
        this.saveState();
        this.renderPuzzleView();
        this.showCheckFeedback(
          "success",
          "BRAWO!",
          "Poprawna odpowiedź. ZAGADKA ZALICZONA!"
        );
      });

      this.els.resetPuzzleBtn.addEventListener("click", () => {
        const id = String(this.state.selectedPuzzle);
        this.state.puzzles[id] = {
          solved: false,
          solution: "",
          notes: "",
          lastUpdated: new Date().toISOString()
        };

        this.saveState();
        this.renderPuzzleView();
        this.setSaveIndicator("Zagadka zresetowana.");
      });

      this.els.exportProgressBtn.addEventListener("click", () => {
        this.exportProgress();
      });

      this.els.importProgressBtn.addEventListener("click", () => {
        this.importProgress();
      });

      this.els.solveAllBtn.addEventListener("click", () => {
        this.solveAllPuzzles();
      });

      this.els.unsolveAllBtn.addEventListener("click", () => {
        this.unsolveAllPuzzles();
      });

      if (this.els.hintsButtons) {
        this.els.hintsButtons.addEventListener("click", (event) => {
          const hintBtn = event.target.closest("[data-hint-key]");
          if (!hintBtn) {
            return;
          }

          this.openHintPopup(hintBtn.dataset.hintKey);
        });
      }

      if (this.els.hintRevealBtn) {
        this.els.hintRevealBtn.addEventListener("click", () => {
          this.revealActiveHint();
        });
      }

      if (this.els.hintCloseBtn) {
        this.els.hintCloseBtn.addEventListener("click", () => {
          this.closeHintPopup();
        });
      }

      if (this.els.hintPopup) {
        this.els.hintPopup.addEventListener("click", (event) => {
          if (event.target === this.els.hintPopup) {
            this.closeHintPopup();
          }
        });
      }

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          this.closeHintPopup();
        }
      });

      this.els.puzzleContent.addEventListener("click", (event) => {
        const hotspotButton = event.target.closest(".puzzle-hotspot-btn");
        if (hotspotButton) {
          this.handlePuzzle10HotspotClick();
          return;
        }

        const caesarShiftBtn = event.target.closest("[data-caesar-row][data-caesar-shift]");
        if (caesarShiftBtn) {
          this.handlePuzzle7Shift(
            caesarShiftBtn.dataset.caesarRow,
            Number(caesarShiftBtn.dataset.caesarShift)
          );
          return;
        }

        const pianoKey = event.target.closest("[data-piano-note]");
        if (pianoKey) {
          this.handlePuzzle6PianoNote(pianoKey.dataset.pianoNote);
          return;
        }

        if (event.target.id === "puzzle11RevealBtn") {
          this.handlePuzzle11RevealAttempt();
          return;
        }

        if (event.target.id === "puzzle19MoonBtn") {
          this.handlePuzzle19MoonAttempt();
          return;
        }

        if (event.target.id === "puzzle6Reset") {
          this.resetPuzzle6MelodyProgress();
          return;
        }

        if (event.target.id === "puzzle7Reset") {
          this.resetPuzzle7Helper();
        }
      });

      this.els.notesInput.addEventListener("input", () => {
        window.clearTimeout(this.notesSaveTimer);
        this.setSaveIndicator("Saving...");

        this.notesSaveTimer = window.setTimeout(() => {
          const puzzle = this.getCurrentPuzzle();
          puzzle.notes = this.els.notesInput.value;
          this.touchPuzzle(puzzle);
          this.state.puzzles[String(this.state.selectedPuzzle)] = puzzle;
          this.saveState();
          this.setSaveIndicator(`Saved at ${this.formatTime(new Date())}`);
        }, 400);
      });
    },

    loadState() {
      let parsed = null;
      const raw = localStorage.getItem(STORAGE_KEY);

      if (raw) {
        try {
          parsed = JSON.parse(raw);
        } catch (_error) {
          parsed = null;
        }
      }

      const defaultState = this.createDefaultState();
      if (!parsed || typeof parsed !== "object") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
        return defaultState;
      }

      // Normalize loaded data so all 64 puzzle records always exist.
      const merged = {
        selectedPuzzle: this.normalizePuzzleId(parsed.selectedPuzzle),
        puzzles: {},
        hints: {}
      };

      for (let i = 1; i <= TOTAL_PUZZLES; i += 1) {
        const key = String(i);
        const existing = parsed.puzzles && parsed.puzzles[key] ? parsed.puzzles[key] : {};
        merged.puzzles[key] = {
          solved: Boolean(existing.solved),
          solution: typeof existing.solution === "string" ? existing.solution : "",
          notes: typeof existing.notes === "string" ? existing.notes : "",
          lastUpdated: typeof existing.lastUpdated === "string" ? existing.lastUpdated : null
        };

        const existingHints = parsed.hints && typeof parsed.hints === "object" ? parsed.hints[key] : null;
        merged.hints[key] = {};
        if (existingHints && typeof existingHints === "object") {
          Object.keys(existingHints).forEach((hintKey) => {
            if (/^hint\d+$/i.test(hintKey) && Boolean(existingHints[hintKey])) {
              merged.hints[key][hintKey] = true;
            }
          });
        }
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    },

    createDefaultState() {
      const puzzles = {};
      const hints = {};
      for (let i = 1; i <= TOTAL_PUZZLES; i += 1) {
        puzzles[String(i)] = {
          solved: false,
          solution: "",
          notes: "",
          lastUpdated: null
        };
        hints[String(i)] = {};
      }

      return {
        selectedPuzzle: 1,
        puzzles,
        hints
      };
    },

    ensureHintsState() {
      if (!this.state.hints || typeof this.state.hints !== "object") {
        this.state.hints = {};
      }

      for (let i = 1; i <= TOTAL_PUZZLES; i += 1) {
        const key = String(i);
        if (!this.state.hints[key] || typeof this.state.hints[key] !== "object") {
          this.state.hints[key] = {};
        }
      }
    },

    saveState() {
      this.ensureHintsState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      this.renderMenuSelectionState();
      this.renderSolvedCounter();
    },

    openPuzzle(puzzleId) {
      this.state.selectedPuzzle = this.normalizePuzzleId(puzzleId);
      this.saveState();
      this.renderPuzzleView();
      this.showPuzzleView();

      if (this.state.selectedPuzzle === 19) {
        this.playHowlSound();
      }
    },

    showMenuView() {
      this.els.menuView.classList.remove("hidden");
      this.els.puzzleView.classList.add("hidden");
      this.els.backToMenuBtn.classList.add("hidden");
      document.body.classList.remove("puzzle19-night-sky");
      this.playViewEntrance(this.els.menuView);
      this.renderMenuSelectionState();
    },

    showPuzzleView() {
      this.els.menuView.classList.add("hidden");
      this.els.puzzleView.classList.remove("hidden");
      this.els.backToMenuBtn.classList.remove("hidden");
      this.playViewEntrance(this.els.puzzleView);
    },

    renderMenuGrid() {
      const fragment = document.createDocumentFragment();

      for (let i = 1; i <= TOTAL_PUZZLES; i += 1) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "puzzle-btn";
        button.dataset.puzzleId = String(i);
        button.textContent = String(i);
        button.setAttribute("role", "gridcell");
        fragment.appendChild(button);
      }

      this.els.puzzleGrid.innerHTML = "";
      this.els.puzzleGrid.appendChild(fragment);
      this.renderMenuSelectionState();
    },

    renderMenuSelectionState() {
      const selected = this.state.selectedPuzzle;
      const buttons = this.els.puzzleGrid.querySelectorAll(".puzzle-btn");

      buttons.forEach((button) => {
        const id = Number(button.dataset.puzzleId);
        const puzzle = this.state.puzzles[String(id)];
        const puzzleColor = PUZZLE_COLORS[id] || "#f0f0f0";
        
        button.classList.toggle("solved", puzzle.solved);
        button.classList.toggle("selected", id === selected);
        
        // Apply color if solved
        if (puzzle.solved) {
          button.style.backgroundColor = puzzleColor;
          button.style.color = this.getContrastTextColor(puzzleColor);
        } else {
          button.style.backgroundColor = "";
          button.style.color = "";
        }
        
        button.setAttribute("aria-label", `Puzzle ${id} ${puzzle.solved ? "solved" : "unsolved"}`);
      });

      this.checkImageCompletion();
    },

    getContrastTextColor(hexColor) {
      // Extract RGB values
      const r = parseInt(hexColor.substring(1, 3), 16);
      const g = parseInt(hexColor.substring(3, 5), 16);
      const b = parseInt(hexColor.substring(5, 7), 16);
      // Calculate luminance
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      // Return black or white text based on luminance
      return luminance > 0.5 ? "#000000" : "#ffffff";
    },

    renderSolvedCounter() {
      if (!this.els.solvedCounter) {
        return;
      }

      const solvedCount = Object.values(this.state.puzzles).reduce((count, puzzle) => {
        return count + (puzzle.solved ? 1 : 0);
      }, 0);

      this.els.solvedCounter.textContent = `Rozwiązane ${solvedCount} / ${TOTAL_PUZZLES}`;
    },

    renderPuzzleView() {
      const id = this.state.selectedPuzzle;
      const puzzle = this.getCurrentPuzzle();
      const puzzleData = PUZZLE_DATA[id] || {
        title: `Zagadka ${id}`,
        content: `<p><strong>Treść zagadki dla zagadki ${id}...</strong></p>`
      };

      document.body.classList.toggle("puzzle19-night-sky", id === 19);

      this.els.puzzleTitle.textContent = puzzleData.title;
      this.els.solutionInput.value = puzzle.solution;
      this.els.notesInput.value = puzzle.notes;

      this.els.markSolvedBtn.textContent = puzzle.solved
        ? "Oznacz jako Nierozwiązane"
        : "Sprawdź / Oznacz jako Rozwiązane";

      this.els.statusBadge.textContent = puzzle.solved ? "Rozwiązane" : "Nierozwiązane";
      this.els.statusBadge.classList.toggle("solved", puzzle.solved);
      this.els.statusBadge.classList.toggle("unsolved", !puzzle.solved);

      this.els.puzzleContent.innerHTML = puzzleData.content;
      this.closeHintPopup();
      this.renderHintButtons();
      this.renderPuzzleNavigationState();

      if (id === 6) {
        this.resetPuzzle6MelodyProgress();
      }

      if (id === 7) {
        this.resetPuzzle7Helper();
      }

      if (puzzle.lastUpdated) {
        this.setSaveIndicator(`Ostatnia aktualizacja ${this.formatDateTime(puzzle.lastUpdated)}`);
      } else {
        this.setSaveIndicator("Brak ostatnich zmian");
      }
    },

    renderPuzzleNavigationState() {
      const id = this.state.selectedPuzzle;
      this.els.prevPuzzleBtn.disabled = id <= 1;
      this.els.nextPuzzleBtn.disabled = id >= TOTAL_PUZZLES;
    },

    goToPreviousPuzzle() {
      if (this.state.selectedPuzzle <= 1) {
        return;
      }
      this.openPuzzle(this.state.selectedPuzzle - 1);
    },

    goToNextPuzzle() {
      if (this.state.selectedPuzzle >= TOTAL_PUZZLES) {
        return;
      }
      this.openPuzzle(this.state.selectedPuzzle + 1);
    },

    ensureAudioContext() {
      if (!this.audioContext) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
          return null;
        }
        this.audioContext = new AudioContextClass();
      }

      if (this.audioContext.state === "suspended") {
        this.audioContext.resume();
      }

      return this.audioContext;
    },

    playPianoTone(frequency) {
      const context = this.ensureAudioContext();
      if (!context) {
        return;
      }

      const now = context.currentTime;
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(frequency, now);
      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.exponentialRampToValueAtTime(0.22, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.36);
    },

    handlePuzzle6PianoNote(note) {
      if (this.state.selectedPuzzle !== 6) {
        return;
      }

      const frequency = PUZZLE_6_NOTE_FREQUENCIES[note];
      if (!frequency) {
        return;
      }

      this.playPianoTone(frequency);
      this.flashPuzzle6Key(note);

      const expectedIndex = this.puzzle6PlayedNotes.length;
      const expectedNote = PUZZLE_6_TARGET_MELODY[expectedIndex];

      if (note === expectedNote) {
        this.puzzle6PlayedNotes.push(note);
      } else if (note === PUZZLE_6_TARGET_MELODY[0]) {
        this.puzzle6PlayedNotes = [note];
      } else {
        this.puzzle6PlayedNotes = [];
      }

      this.updatePuzzle6ProgressLabel();

      if (this.puzzle6PlayedNotes.length === PUZZLE_6_TARGET_MELODY.length) {
        this.revealPuzzle6Solution();
      }
    },

    flashPuzzle6Key(note) {
      const keyButton = this.els.puzzleContent.querySelector(`[data-piano-note="${note}"]`);
      if (!keyButton) {
        return;
      }

      keyButton.classList.add("active");
      window.setTimeout(() => {
        keyButton.classList.remove("active");
      }, 120);
    },

    updatePuzzle6ProgressLabel() {
      const progressEl = document.getElementById("puzzle6Progress");
      if (!progressEl) {
        return;
      }

      progressEl.textContent = `Postęp melodii: ${this.puzzle6PlayedNotes.length}/${PUZZLE_6_TARGET_MELODY.length}`;
    },

    resetPuzzle6MelodyProgress() {
      this.puzzle6PlayedNotes = [];
      this.updatePuzzle6ProgressLabel();

      const resultEl = document.getElementById("puzzle6Result");
      if (resultEl) {
        resultEl.textContent = "";
      }
    },

    revealPuzzle6Solution() {
      const solution = this.getExpectedSolution(6) || "fortepian";
      this.els.solutionInput.value = solution;

      const resultEl = document.getElementById("puzzle6Result");
      if (resultEl) {
        resultEl.textContent = `Rozwiązanie odkryte: ${solution}`;
      }

      this.setSaveIndicator("Sekwencja poprawna! Hasło zostało ujawnione.");
      this.showCheckFeedback("success", "Brawo!", "Poprawna melodia. Hasło pojawiło się w polu odpowiedzi.");
    },

    getShiftedAlphabet(shift) {
      const length = CAESAR_ALPHABET.length;
      const normalizedShift = ((shift % length) + length) % length;
      if (normalizedShift === 0) {
        return CAESAR_ALPHABET;
      }

      return CAESAR_ALPHABET.slice(normalizedShift) + CAESAR_ALPHABET.slice(0, normalizedShift);
    },

    updatePuzzle7Row(rowKey) {
      const alphabetId = rowKey === "top" ? "puzzle7TopAlphabet" : "puzzle7BottomAlphabet";
      const shiftId = rowKey === "top" ? "puzzle7TopShift" : "puzzle7BottomShift";
      const alphabetEl = document.getElementById(alphabetId);
      const shiftEl = document.getElementById(shiftId);

      if (!alphabetEl || !shiftEl) {
        return;
      }

      const rowShift = this.puzzle7Shifts[rowKey];
      alphabetEl.textContent = this.getShiftedAlphabet(rowShift);
      shiftEl.textContent = `: ${rowShift}`;
    },

    handlePuzzle7Shift(rowKey, step) {
      if (this.state.selectedPuzzle !== 7) {
        return;
      }

      if (!Object.prototype.hasOwnProperty.call(this.puzzle7Shifts, rowKey) || Number.isNaN(step)) {
        return;
      }

      this.puzzle7Shifts[rowKey] += Math.trunc(step);
      this.updatePuzzle7Row(rowKey);
    },

    resetPuzzle7Helper() {
      if (this.state.selectedPuzzle !== 7) {
        return;
      }

      this.puzzle7Shifts.top = 0;
      this.puzzle7Shifts.bottom = 0;
      this.updatePuzzle7Row("top");
      this.updatePuzzle7Row("bottom");
    },

    isTime1111() {
      const now = new Date();
      return now.getHours() === 11 && now.getMinutes() === 11;
    },

    handlePuzzle11RevealAttempt() {
      if (this.state.selectedPuzzle !== 11) {
        return;
      }

      const statusEl = document.getElementById("puzzle11RevealStatus");
      if (!this.isTime1111()) {
        const nowText = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const message = `Teraz jest ${nowText}. `;
        if (statusEl) {
          statusEl.textContent = message;
        }
        this.setSaveIndicator("Przycisk działa tylko czasem");
        this.showCheckFeedback("error", "Za wcześnie lub za późno", "");
        return;
      }

      const solution = this.getExpectedSolution(11) || "Brak ustawionego rozwiązania";
      this.els.solutionInput.value = solution;
      if (statusEl) {
        statusEl.textContent = `Rozwiązanie: ${solution}`;
      }
      this.setSaveIndicator("Rozwiązanie ujawnione o 11:11.");
      this.showCheckFeedback("success", "Czas trafiony!", "Rozwiązanie zostało ujawnione.");
    },

    getMoonPhaseFraction(date = new Date()) {
      const synodicMonthDays = 29.530588853;
      const knownNewMoonUtc = Date.UTC(2000, 0, 6, 18, 14, 0);
      const daysSinceKnownNewMoon = (date.getTime() - knownNewMoonUtc) / 86400000;
      const currentCycleDay = ((daysSinceKnownNewMoon % synodicMonthDays) + synodicMonthDays) % synodicMonthDays;
      return currentCycleDay / synodicMonthDays;
    },

    isFullMoon(date = new Date()) {
      const phase = this.getMoonPhaseFraction(date);
      return Math.abs(phase - 0.5) <= 0.035;
    },

    getMoonPhaseRepresentation(phaseFraction) {
      const normalizedPhase = ((phaseFraction % 1) + 1) % 1;
      const phaseIndex = Math.floor((((normalizedPhase + 0.0625) % 1) * 8));
      const phaseVariants = [
        { icon: "🌑", label: "Now" },
        { icon: "🌒", label: "Przybywajacy sierp" },
        { icon: "🌓", label: "Pierwsza kwadra" },
        { icon: "🌔", label: "Przybywajacy garb" },
        { icon: "🌕", label: "Pelnia" },
        { icon: "🌖", label: "Ubywajacy garb" },
        { icon: "🌗", label: "Ostatnia kwadra" },
        { icon: "🌘", label: "Ubywajacy sierp" }
      ];

      return phaseVariants[phaseIndex];
    },

    handlePuzzle19MoonAttempt() {
      if (this.state.selectedPuzzle !== 19) {
        return;
      }

      const statusEl = document.getElementById("puzzle19MoonStatus");
      const phase = this.getMoonPhaseFraction(new Date());
      const illuminationPercent = Math.round(((1 - Math.cos(2 * Math.PI * phase)) / 2) * 100);
      const phaseView = this.getMoonPhaseRepresentation(phase);
      const phaseText = `${phaseView.icon} ${phaseView.label} (${illuminationPercent}%)`;

      if (statusEl) {
        statusEl.textContent = `Aktualna faza Ksiezyca: ${phaseText}`;
      }

      if (!this.isFullMoon()) {
        const message = `To jeszcze nie pelnia. ${phaseText}`;
        this.setSaveIndicator("Przycisk aktywny tylko podczas pelni.");
        this.showMoonPhasePopup("error", phaseView.icon, "To jeszcze nie czas...");
        return;
      }

      if (statusEl) {
        statusEl.textContent = `Pelnia! ${phaseText}`;
      }

      const solution = this.getExpectedSolution(19);
      if (solution) {
        this.els.solutionInput.value = solution;
      }

      this.setSaveIndicator("Pelnia wykryta.");
      this.showMoonPhasePopup("success", phaseView.icon, "Dzis jest pelnia!");
    },

    showMoonPhasePopup(type, phaseIcon, labelText) {
      const overlay = this.els.checkFeedback;
      const titleEl = this.els.checkFeedbackTitle;
      const textEl = this.els.checkFeedbackText;
      if (!overlay || !titleEl || !textEl) {
        return;
      }

      window.clearTimeout(this.checkFeedbackTimer);
      titleEl.textContent = phaseIcon;
      textEl.textContent = labelText || "";
      overlay.classList.remove("success", "error", "show");
      overlay.classList.add(type, "moon-phase-only");

      void overlay.offsetWidth;
      overlay.classList.add("show");
      overlay.setAttribute("aria-hidden", "false");

      this.checkFeedbackTimer = window.setTimeout(() => {
        overlay.classList.remove("show", "moon-phase-only");
        overlay.setAttribute("aria-hidden", "true");
      }, 1600);
    },

    playSynthMeowFallback() {
      const context = this.ensureAudioContext();
      if (!context) {
        return;
      }

      const now = context.currentTime;
      const gainNode = context.createGain();
      const oscillator = context.createOscillator();

      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(640, now);
      oscillator.frequency.exponentialRampToValueAtTime(300, now + 0.09);
      oscillator.frequency.exponentialRampToValueAtTime(430, now + 0.2);

      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.exponentialRampToValueAtTime(0.2, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.26);
    },

    playMeowSound() {
      if (!this.meowAudio) {
        this.meowAudio = new Audio("sounds/meow.mp3");
        this.meowAudio.preload = "auto";
      }

      this.meowAudio.currentTime = 0;
      const playPromise = this.meowAudio.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          this.playSynthMeowFallback();
        });
      }
    },

    playHowlSound() {
      if (!this.howlAudio) {
        this.howlAudio = new Audio("sounds/howl.mp3");
        this.howlAudio.preload = "auto";
      }

      this.howlAudio.currentTime = 0;
      const playPromise = this.howlAudio.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          // Ignore blocked autoplay or missing codec errors.
        });
      }
    },

    handlePuzzle10HotspotClick() {
      if (this.state.selectedPuzzle !== 10) {
        return;
      }

      this.playMeowSound();
      this.showCheckFeedback("success", "Miau!", "Znalazłaś Filusia!");
    },

    getPuzzleHintEntries(puzzleId) {
      const puzzleData = PUZZLE_DATA[puzzleId];
      if (!puzzleData || typeof puzzleData !== "object") {
        return [];
      }

      return Object.keys(puzzleData)
        .filter((key) => {
          return /^hint\d+$/i.test(key)
            && typeof puzzleData[key] === "string"
            && puzzleData[key].trim().length > 0;
        })
        .sort((leftKey, rightKey) => {
          const leftNumber = Number(leftKey.replace(/[^\d]/g, "")) || 0;
          const rightNumber = Number(rightKey.replace(/[^\d]/g, "")) || 0;
          return leftNumber - rightNumber;
        })
        .map((key, index) => {
          return {
            key,
            index: index + 1,
            text: puzzleData[key].trim()
          };
        });
    },

    isHintRevealed(puzzleId, hintKey) {
      const puzzleHints = this.state.hints && this.state.hints[String(puzzleId)];
      return Boolean(puzzleHints && puzzleHints[hintKey]);
    },

    markHintAsRevealed(puzzleId, hintKey) {
      this.ensureHintsState();
      const puzzleKey = String(puzzleId);
      this.state.hints[puzzleKey][hintKey] = true;
    },

    renderHintButtons() {
      if (!this.els.hintsButtons) {
        return;
      }

      const puzzleId = this.state.selectedPuzzle;
      const hints = this.getPuzzleHintEntries(puzzleId);
      this.els.hintsButtons.innerHTML = "";

      if (this.els.hintsEmpty) {
        this.els.hintsEmpty.classList.toggle("hidden", hints.length > 0);
      }

      if (hints.length === 0) {
        return;
      }

      const fragment = document.createDocumentFragment();
      hints.forEach((hint) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "hint-btn";
        button.dataset.hintKey = hint.key;
        button.textContent = `Podpowiedź ${hint.index}`;

        if (this.isHintRevealed(puzzleId, hint.key)) {
          button.classList.add("revealed");
        }

        fragment.appendChild(button);
      });

      this.els.hintsButtons.appendChild(fragment);
    },

    openHintPopup(hintKey) {
      if (!this.els.hintPopup) {
        return;
      }

      const puzzleId = this.state.selectedPuzzle;
      const hints = this.getPuzzleHintEntries(puzzleId);
      const hint = hints.find((entry) => entry.key === hintKey);
      if (!hint) {
        return;
      }

      this.activeHintContext = {
        puzzleId,
        hintKey
      };

      if (this.els.hintPopupTitle) {
        this.els.hintPopupTitle.textContent = `Podpowiedź ${hint.index}`;
      }

      this.refreshActiveHintPopup();
      this.els.hintPopup.classList.add("show");
      this.els.hintPopup.setAttribute("aria-hidden", "false");
    },

    refreshActiveHintPopup() {
      if (!this.activeHintContext) {
        return;
      }

      const { puzzleId, hintKey } = this.activeHintContext;
      const hints = this.getPuzzleHintEntries(puzzleId);
      const hint = hints.find((entry) => entry.key === hintKey);
      if (!hint) {
        this.closeHintPopup();
        return;
      }

      const isRevealed = this.isHintRevealed(puzzleId, hintKey);
      if (this.els.hintPopupText) {
        this.els.hintPopupText.textContent = isRevealed
          ? hint.text
          : "Ta podpowiedź jest ukryta. Kliknij \"Okryj podpowiedź\", aby ją zobaczyć.";
      }

      if (this.els.hintRevealBtn) {
        this.els.hintRevealBtn.disabled = isRevealed;
        this.els.hintRevealBtn.textContent = isRevealed ? "Podpowiedź odkryta" : "Okryj podpowiedź";
      }
    },

    revealActiveHint() {
      if (!this.activeHintContext) {
        return;
      }

      this.markHintAsRevealed(this.activeHintContext.puzzleId, this.activeHintContext.hintKey);
      this.saveState();
      this.renderHintButtons();
      this.refreshActiveHintPopup();
    },

    closeHintPopup() {
      if (!this.els.hintPopup) {
        this.activeHintContext = null;
        return;
      }

      this.els.hintPopup.classList.remove("show");
      this.els.hintPopup.setAttribute("aria-hidden", "true");
      this.activeHintContext = null;
    },

    getCurrentPuzzle() {
      return this.state.puzzles[String(this.state.selectedPuzzle)];
    },

    getExpectedSolution(puzzleId) {
      const puzzleData = PUZZLE_DATA[puzzleId];
      if (!puzzleData || typeof puzzleData.solution !== "string") {
        return null;
      }

      const solution = puzzleData.solution.trim();
      return solution.length > 0 ? solution : null;
    },

    isMatchingSolution(inputValue, expectedSolution) {
      // Strict, case-sensitive match. You can adjust to .toLowerCase() for case-insensitive if needed.
      return inputValue.trim() === expectedSolution;
    },

    normalizePuzzleId(value) {
      const number = Number(value);
      if (Number.isNaN(number) || number < 1 || number > TOTAL_PUZZLES) {
        return 1;
      }
      return Math.trunc(number);
    },

    touchPuzzle(puzzle) {
      puzzle.lastUpdated = new Date().toISOString();
    },

    setSaveIndicator(message) {
      this.els.saveIndicator.textContent = message;
      this.els.saveIndicator.parentElement.classList.remove("saved-pulse");
      // Restart animation each time indicator text changes.
      void this.els.saveIndicator.parentElement.offsetWidth;
      this.els.saveIndicator.parentElement.classList.add("saved-pulse");
    },

    showCheckFeedback(type, title, message) {
      const overlay = this.els.checkFeedback;
      const titleEl = this.els.checkFeedbackTitle;
      const textEl = this.els.checkFeedbackText;
      if (!overlay || !titleEl || !textEl) {
        return;
      }

      window.clearTimeout(this.checkFeedbackTimer);
      titleEl.textContent = title;
      textEl.textContent = message;
      overlay.classList.remove("success", "error", "show", "moon-phase-only");
      overlay.classList.add(type);

      // Force reflow so the animation can retrigger when checking quickly.
      void overlay.offsetWidth;
      overlay.classList.add("show");
      overlay.setAttribute("aria-hidden", "false");

      this.checkFeedbackTimer = window.setTimeout(() => {
        overlay.classList.remove("show");
        overlay.setAttribute("aria-hidden", "true");
      }, type === "success" ? 1800 : 1400);
    },

    playViewEntrance(viewEl) {
      viewEl.classList.remove("view-enter");
      // Force reflow so repeated navigation replays the animation.
      void viewEl.offsetWidth;
      viewEl.classList.add("view-enter");
    },

    formatTime(dateObj) {
      return dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
    },

    formatDateTime(iso) {
      const date = new Date(iso);
      if (Number.isNaN(date.getTime())) {
        return "właśnie teraz";
      }

      return `${date.toLocaleDateString()} ${this.formatTime(date)}`;
    },

    checkImageCompletion() {
      // Check if all non-empty cells (not light gray background) are solved
      const nonEmptyPuzzles = Object.entries(PUZZLE_COLORS)
        .filter(([_, color]) => color !== "#f0f0f0")
        .map(([id, _]) => id);

      const allImageSolved = nonEmptyPuzzles.every((puzzleNum) => {
        return this.state.puzzles[String(puzzleNum)].solved;
      });

      if (allImageSolved && nonEmptyPuzzles.length > 0) {
        this.showImageCompletionMessage();
      }
    },

    showImageCompletionMessage() {
      // Only show once per session if not already shown
      if (this.imageCompletionShown) {
        return;
      }
      this.imageCompletionShown = true;

      const message = "✨ Obraz ikony ujawniony! Przepływ pracy ukończony!";
      this.setSaveIndicator(message);

      // Add a brief visual celebration on the grid
      const gridEl = this.els.puzzleGrid;
      if (gridEl) {
        gridEl.classList.add("pattern-complete");
        setTimeout(() => {
          gridEl.classList.remove("pattern-complete");
        }, 3000);
      }
    },

    solveAllPuzzles() {
      for (let i = 1; i <= TOTAL_PUZZLES; i += 1) {
        const key = String(i);
        this.state.puzzles[key].solved = true;
        this.touchPuzzle(this.state.puzzles[key]);
      }
      this.saveState();
      this.renderPuzzleView();
      this.setSaveIndicator("[DEBUG] Wszystkie zagadki oznaczone jako rozwiązane.");
    },

    unsolveAllPuzzles() {
      for (let i = 1; i <= TOTAL_PUZZLES; i += 1) {
        const key = String(i);
        this.state.puzzles[key].solved = false;
        this.state.puzzles[key].solution = "";
        this.touchPuzzle(this.state.puzzles[key]);
      }
      this.saveState();
      this.renderPuzzleView();
      this.setSaveIndicator("[DEBUG] Wszystkie zagadki oznaczone jako nierozwiązane.");
    },

    exportProgress() {
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `hela-puzzle-progress-${timestamp}.json`;
      const dataStr = JSON.stringify(this.state, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      this.setSaveIndicator(`Postęp wyeksportowany: ${filename}`);
    },

    importProgress() {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json,application/json";
      input.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (!file) {
          return;
        }

        const reader = new FileReader();
        reader.addEventListener("load", (e) => {
          try {
            const imported = JSON.parse(e.target.result);
            if (!imported.puzzles || typeof imported.puzzles !== "object") {
              throw new Error("Nieprawidłowy format pliku postępu.");
            }

            this.state = imported;
            this.ensureHintsState();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
            this.renderMenuGrid();
            this.renderSolvedCounter();
            this.renderPuzzleView();
            this.setSaveIndicator(`Postęp zaimportowany z ${file.name}`);
          } catch (err) {
            this.setSaveIndicator(`Import nie powiódł się: ${err.message}`);
          }
        });
        reader.readAsText(file);
      });
      input.click();
    }
  };

  window.addEventListener("DOMContentLoaded", () => {
    App.init();
  });
})();
