
  
(() => {
  const TOTAL_PUZZLES = 64;
  const STORAGE_KEY = "puzzleAppState";
  // Map each puzzle (1-64) to a color from the workflow icon. When solved, displays this color.
  // Grid layout: 8 cols × 8 rows
  const PUZZLE_COLORS = {
    // Row 1
    1: "#FFFFFF", 2: "#DD6B2F", 3: "#F59A2A", 4: "#DD6B2F", 5: "#F59A2A", 6: "#DD6B2F", 7: "#F59A2A", 8: "#FFFFFF",
    // Row 2
    9: "#F59A2A", 10: "#4A5573", 11: "#5A6686", 12: "#4A5573", 13: "#6B7696", 14: "#4A5573", 15: "#7380A0", 16: "#DD6B2F",
    // Row 3
    17: "#DD6B2F", 18: "#5A6686", 19: "#4A5573", 20: "#8A95B0", 21: "#4A5573", 22: "#7380A0", 23: "#4A5573", 24: "#F59A2A",
    // Row 4
    25: "#F59A2A", 26: "#4A5573", 27: "#8A95B0", 28: "#4A5573", 29: "#A0A9C0", 30: "#4A5573", 31: "#6B7696", 32: "#DD6B2F",
    // Row 5
    33: "#FFFFFF", 34: "#DD6B2F", 35: "#F59A2A", 36: "#DD6B2F", 37: "#F59A2A", 38: "#DD6B2F", 39: "#F59A2A", 40: "#FFFFFF",
    // Row 6
    41: "#2F7F2F", 42: "#3A8F3A", 43: "#2F7F2F", 44: "#2F7F2F", 45: "#2F7F2F", 46: "#2F7F2F", 47: "#2F7F2F", 48: "#3A8F3A",
    // Row 7
    49: "#d6ffd6", 50: "#2F7F2F", 51: "#3A8F3A", 52: "#3A8F3A", 53: "#2F7F2F", 54: "#3A8F3A", 55: "#3A8F3A", 56: "#d6ffd6",
    // Row 8
    57: "#FFFFFF", 58: "#FFFFFF", 59: "#FFFFFF", 60: "#3A8F3A", 61: "#2F7F2F", 62: "#FFFFFF", 63: "#FFFFFF", 64: "#FFFFFF"
  };
  // [
//   ["#4B2A2E","#4B2A2E","#4B2A2E","#4B2A2E","#4B2A2E","#4B2A2E","#4B2A2E","#4B2A2E"],
//   ["#4B2A2E","#4B2A2E","#4B2A2E","#E0663A","#E0663A","#4B2A2E","#4B2A2E","#4B2A2E"],
//   ["#4B2A2E","#4B2A2E","#4B2A2E","#E0663A","#E0663A","#4B2A2E","#4B2A2E","#4B2A2E"],
//   ["#4B2A2E","#4B2A2E","#4B2A2E","#4B2A2E","#4B2A2E","#4B2A2E","#4B2A2E","#4B2A2E"],
//   ["#4B2A2E","#4B2A2E","#4B2A2E","#4B2A2E","#4B2A2E","#4B2A2E","#4B2A2E","#4B2A2E"],
//   ["#4B2A2E","#F47C2C","#4B2A2E","#4B2A2E","#4B2A2E","#4B2A2E","#F47C2C","#4B2A2E"],
//   ["#F47C2C","#F47C2C","#F47C2C","#F47C2C","#F47C2C","#F47C2C","#F47C2C","#F47C2C"],
//   ["#FFFFFF","#F47C2C","#F47C2C","#F47C2C","#F47C2C","#F47C2C","#F47C2C","#FFFFFF"]
// ]
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
  const PUZZLE_6_SECRET_MELODY = ["G4", "E4", "E4", "F4", "D4", "D4", "C4", "E4", "G4"];
  const CAESAR_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const PUZZLE_12_DEBUG_MODE = true;
  const PUZZLE_14_DEBUG_MODE = false;
  const PAIRS_PASSWORD = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed domos";
  const LETTER_PAIR_CATALOG = {
    A: [["rak", "kara"], ["cel", "cela"]],
    B: [["rak", "brak"]],
    C: [["hełm", "Chełm"]],
    D: [["ja", "jad"]],
    E: [["Cezar", "czar"]],
    F: [["frak", "rak"]],
    G: [["ość", "gość"]],
    H: [["całka", "chałka"]],
    I: [["rak", "Irak"]],
    J: [["Jezus", "Zeus"]],
    K: [["rak", "kark"]],
    L: [["buk", "klub"]],
    M: [["to", "tom"]],
    N: [["tag", "gnat"]],
    O: [["aut", "auto"]],
    P: [["dar", "drap"]],
    R: [["bat", "brat"]],
    S: [["chart", "strach"]],
    T: [["lis", "list"]],
    U: [["bat", "tuba"]],
    W: [["rak", "wrak"]],
    Y: [["ryba", "bar"]],
    Z: [["rak", "krzak"]]
  };

  // Centralized puzzle data: define title, content, solution and optional partial_solution for each puzzle (1-64)
  // Edit these to customize each puzzle
  const PUZZLE_DATA = {};


//   Example: Custom puzzle data (uncomment and modify to override defaults)
  PUZZLE_DATA[1] = {
    title: "Zagadka 1: Na Rozgrzewkę",
    content: `<p><strong>Aby zaliczyć zagadkę musisz wymyślić rozwiązanie, wpisać je w pole powyżej  i naciśnij przycisk Sprawdź. Rozwiązanie tej zagadki to hasło: początek</strong></p>`,
    solution: "początek",
    partial_solution: [
      { key: "pocz", message: "Dobry początek! Dodaj jeszcze liter." },
      { key: "począ", message: "Bardzo blisko! Dokończ wyraz." }
    ]
  };
  PUZZLE_DATA[2] = {
    //TODO hint
    title: "Zagadka 2: Na głowie",
    content: `<div style="display: grid; place-items: center;">
  <img src="img/Z2.png" alt="" style="width: 100%; max-width: 560px; height: auto; display: block; border-radius: 4px;">
</div>`,
    solution: "glob",
    partial_solution: [
      { key: "8079", message: "To byłoby za proste:)" }
    ]
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
    solution: "3",
    partial_solution: [
      { key: "2", message: "Blisko! Ale liczba jest mniejsza." },
      { key: "4", message: "Blisko! Ale liczba jest większa." }
    ]
  };
  PUZZLE_DATA[4] = {
   title: "Zagadka 4: Coś tu nie pasuje...",
    content: "<p><strong>2, 4, 8, 16, 31, 64, 128",
    solution: "31",
    partial_solution: [
      { key: "3", message: "Znaleźliśmy pierwszą cyfrę! Która druga?" },
      { key: "1", message: "To druga cyfra, ale gdzie pierwsza?" }
    ]
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
    solution: "4"
  };
  PUZZLE_DATA[6] = {
    title: "WIP Zagadka 6: Pianino",
    work_in_progress: true,
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
    solution: "kryptografia",
    partial_solution: [
      { key: "krypto", message: "Połowa drogi! Dodaj 6 liter na koniec." },
      { key: "kryptogr", message: "Bardzo blisko! Jeszcze 2 litery." }
    ]
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
    solution: "Rabat",
    partial_solution: [
      { key: "Maroko", message: "Prawie! Czy coś przeoczyłaś?" }
    ]
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
    solution: "weksylologia",
    partial_solution: [
      { key: "kartografia", message: "Świetnie! Odczytałaś hasło, ale czy ono tu na prawdę ma sens?" },
      { key: "heraldyka", message: "Bardzo blisko! Poszukaj jeszcze trochę" },
      { key: "geografia", message: "Blisko! Ale chodzi o coś nieco innego" }
    ],
    hint1: "Ta zagadka dotyczy państw...",
    hint2: "Nie wszystkie literki będą ci potrzebne...",
    hint3: "Zwróć uwagę na pierwsze litery nazw państw przedstawionych na obrazku",
    hint4: "Słowo, które odczytałaś nie odnosi się do flag"


  };

  //TODO - finis the map!
  PUZZLE_DATA[14] = {
    title: "Zagadka 14: Ukryte pomniki",
    content: `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 24px;">
        <div class="puzzle14-map-wrap">
          <img src="img/mapa.jpg" alt="Mapa Polski" class="puzzle14-map-image">
          <button type="button" class="puzzle14-hotspot-btn" data-letter="M" data-debug="330,170" style="--x: 16.9%; --y: 46.5%;" aria-label="Ukryta litera A"></button>
          <button type="button" class="puzzle14-hotspot-btn" data-letter="A" data-debug="520,290" style="--x: 31%; --y: 65.0%;" aria-label="Ukryta litera M"></button>
          <button type="button" class="puzzle14-hotspot-btn" data-letter="R" data-debug="210,130" style="--x: 44.6%; --y: 8%;" aria-label="Ukryta litera M"></button>
          <button type="button" class="puzzle14-hotspot-btn" data-letter="M" data-debug="380,330" style="--x: 65.4%; --y: 69%;" aria-label="Ukryta litera U"></button>
          <button type="button" class="puzzle14-hotspot-btn" data-letter="U" data-debug="450,210" style="--x: 69.4%; --y: 47.0%;" aria-label="Ukryta litera R"></button>
          <button type="button" class="puzzle14-hotspot-btn" data-letter="R" data-debug="250,280" style="--x: 78.2%; --y: 62.0%;" aria-label="Ukryta litera R"></button>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 18px; width: 100%; max-width: 700px;">
          <img src="img/pomniki/chopin.jpg" alt="Pomnik Chopina" style="width:100%; height:auto; display:block; border-radius:8px; border:1.5px solid #d8c8b5; background:#fff;" loading="lazy">
          <img src="img/pomniki/chrystus.jpg" alt="Pomnik Chrystusa" style="width:100%; height:auto; display:block; border-radius:8px; border:1.5px solid #d8c8b5; background:#fff;" loading="lazy">
          <img src="img/pomniki/dzik-w-calej-okazalosci.jpg" alt="Pomnik Dzika" style="width:100%; height:auto; display:block; border-radius:8px; border:1.5px solid #d8c8b5; background:#fff;" loading="lazy">
          <img src="img/pomniki/morswin.jpg" alt="Pomnik Morświna" style="width:100%; height:auto; display:block; border-radius:8px; border:1.5px solid #d8c8b5; background:#fff;" loading="lazy">
          <img src="img/pomniki/pieeeesek.jpg" alt="Pomnik Pieska" style="width:100%; height:auto; display:block; border-radius:8px; border:1.5px solid #d8c8b5; background:#fff;" loading="lazy">
          <img src="img/pomniki/zwierzątka.jpg" alt="Pomnik Zwierzątka" style="width:100%; height:auto; display:block; border-radius:8px; border:1.5px solid #d8c8b5; background:#fff;" loading="lazy">
        </div>
      </div>
    `,
    solution: "pomnik",
    hint1: "Czy potrafisz rozpoznać te pomniki?",
    hint2: "Czy wiesz gdzie się znajdują?",
    hint3: "Spróbuj zlokalizować je na mapie.",
    hint4: "Coś powinno się pokazać",
    hint5: "Czytaj od zachodu"

  };
  PUZZLE_DATA[15] = {
    title: "WIP Zagadka 15: Sonar",
    work_in_progress: true,
    content: `<div class="sonar-puzzle">
  <p><strong>Włącz sonar i naprowadź łódź podwodną na cel.</strong></p>
  <div class="sonar-controls">
    <button type="button" id="puzzle15SonarToggle" class="small-btn" aria-pressed="false">Sonar: OFF</button>
    <p id="puzzle15Status" class="sonar-status" aria-live="polite">Sonar wyłączony.</p>
  </div>
  <div id="puzzle15Field" class="sonar-field" role="img" aria-label="Pole sonaru z łodzią podwodną i celem">
    <div id="puzzle15Target" class="sonar-target" aria-hidden="true"></div>
    <div id="puzzle15Submarine" class="sonar-submarine" aria-hidden="true">
      <span class="sonar-submarine-tower"></span>
      <span class="sonar-submarine-tail"></span>
      <span class="sonar-submarine-window w1"></span>
      <span class="sonar-submarine-window w2"></span>
    </div>
  </div>
</div>`,
    solution: ""
  };
  PUZZLE_DATA[16] = {
    title: "Zagadka 16",
    content: `<div class="puzzle16-container">
  <div class="puzzle16-grid" id="puzzle16Grid"></div>
  <div id="puzzle16Celebration" class="puzzle16-celebration" style="display: none;">
    <div class="puzzle16-happy-bg"></div>
  </div>
</div>`,
    solution: "dynia",
    hint1: "Czy potrafisz rozpoznać te pomniki?",
    hint2: "Czy wiesz gdzie się znajdują?",
    hint3: "Spróbuj zlokalizować je na mapie.",
    hint4: "Coś powinno się pokazać",
    hint5: "Czytaj od zachodu"
  };
  PUZZLE_DATA[17] = {
    title: "Zagadka 17: Zacznij od góry",
    content: `<div class="puzzle17-wrap">
  <div class="puzzle17-grid" role="img" aria-label="Siatka liter 7 na 6">
    <span class="puzzle17-cell">o</span>
    <span class="puzzle17-cell puzzle17-empty"></span>
    <span class="puzzle17-cell puzzle17-empty"></span>
    <span class="puzzle17-cell puzzle17-empty"></span>
    <span class="puzzle17-cell puzzle17-empty"></span>
    <span class="puzzle17-cell puzzle17-empty"></span>
    <span class="puzzle17-cell puzzle17-empty"></span>

    <span class="puzzle17-cell">s</span>
    <span class="puzzle17-cell">n</span>
    <span class="puzzle17-cell">e</span>
    <span class="puzzle17-cell">d</span>
    <span class="puzzle17-cell">e</span>
    <span class="puzzle17-cell">j</span>
    <span class="puzzle17-cell">ć</span>

    <span class="puzzle17-cell">i</span>
    <span class="puzzle17-cell">d</span>
    <span class="puzzle17-cell">w</span>
    <span class="puzzle17-cell">e</span>
    <span class="puzzle17-cell">i</span>
    <span class="puzzle17-cell">z</span>
    <span class="puzzle17-cell">ś</span>

    <span class="puzzle17-cell">e</span>
    <span class="puzzle17-cell">w</span>
    <span class="puzzle17-cell">i</span>
    <span class="puzzle17-cell">ę</span>
    <span class="puzzle17-cell">ć</span>
    <span class="puzzle17-cell">d</span>
    <span class="puzzle17-cell">e</span>

    <span class="puzzle17-cell">m</span>
    <span class="puzzle17-cell">a</span>
    <span class="puzzle17-cell">p</span>
    <span class="puzzle17-cell">i</span>
    <span class="puzzle17-cell">ę</span>
    <span class="puzzle17-cell">ć</span>
    <span class="puzzle17-cell">z</span>

    <span class="puzzle17-cell">c</span>
    <span class="puzzle17-cell">z</span>
    <span class="puzzle17-cell">t</span>
    <span class="puzzle17-cell">e</span>
    <span class="puzzle17-cell">r</span>
    <span class="puzzle17-cell">y</span>
    <span class="puzzle17-cell">s</span>
  </div>
</div>`,
    solution: "8461259"
  };
  PUZZLE_DATA[18] = {
    title: "Zagadka 18: Memento",
    content: `<div class="puzzle18-wrap">
  <div class="puzzle18-grid" role="img" aria-label="Siatka ze wskaźnikami 7 na 6">
    <span class="puzzle18-cell"></span>
    <span class="puzzle18-cell puzzle18-empty"></span>
    <span class="puzzle18-cell puzzle18-empty"></span>
    <span class="puzzle18-cell puzzle18-empty"></span>
    <span class="puzzle18-cell puzzle18-empty"></span>
    <span class="puzzle18-cell puzzle18-empty"></span>
    <span class="puzzle18-cell puzzle18-empty"></span>

    <span class="puzzle18-cell"></span>
    <span class="puzzle18-cell"></span>
    <span class="puzzle18-cell"></span>
    <span class="puzzle18-cell"></span>
    <span class="puzzle18-cell"></span>
    <span class="puzzle18-indicator" data-number="8">8</span>
    <span class="puzzle18-cell"></span>

    <span class="puzzle18-cell"></span>
    <span class="puzzle18-cell"></span>
    <span class="puzzle18-cell"></span>
    <span class="puzzle18-cell"></span>
    <span class="puzzle18-cell"></span>
    <span class="puzzle18-cell"></span>
    <span class="puzzle18-cell"></span>

    <span class="puzzle18-cell"></span>
    <span class="puzzle18-cell"></span>
    <span class="puzzle18-cell"></span>
    <span class="puzzle18-cell"></span>
    <span class="puzzle18-cell"></span>
    <span class="puzzle18-cell"></span>
    <span class="puzzle18-cell"></span>

    <span class="puzzle18-indicator" data-number="3">3</span>
    <span class="puzzle18-indicator" data-number="2">2,7</span>
    <span class="puzzle18-indicator" data-number="1">1</span>
    <span class="puzzle18-indicator" data-number="4">4</span>
    <span class="puzzle18-indicator" data-number="5">5</span>
    <span class="puzzle18-cell"></span>
    <span class="puzzle18-cell"></span>

    <span class="puzzle18-cell"></span>
    <span class="puzzle18-cell"></span>
    <span class="puzzle18-indicator" data-number="6">6</span>
    <span class="puzzle18-cell"></span>
    <span class="puzzle18-cell"></span>
    <span class="puzzle18-cell"></span>
    <span class="puzzle18-cell"></span>
  </div>
</div>`,
    solution: "pamiętaj"
  };
  PUZZLE_DATA[19] = {
    //TODO
    title: "WIP Zagadka 19: Czy go słyszysz?",
    work_in_progress: true,
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
  PUZZLE_DATA[21] = {
    title: "Zagadka 21: Kurczaczek",
    content: `<div style="position: relative; display: grid; gap: 14px; place-items: center; text-align: center; padding: 0.6rem 0.9rem 2.2rem 0.9rem;">
  <div style="position: absolute; right: 0.65rem; bottom: 0.35rem; transform: rotate(-7deg); font-family: 'Segoe Script', 'Lucida Handwriting', 'Brush Script MT', cursive; font-size: 0.95rem; color: #6b4630; opacity: 0.88; letter-spacing: 0.02em; white-space: nowrap; pointer-events: none;">
    coś tu się nie zgadza...
  </div>
  <p><strong>3,141592 653589 793238 462643 383279 502884 197169 399375 105820 974944 592307 816406 286208 998628 034825 342117 067982 148086 513282 306647 093844 609550 582231 725359 408128 377606 450284 102701 938521 105559 644622 948954 930381 964428 810975 665933 446128</strong></p>
</div>`,
    solution: "377606"
  };

  PUZZLE_DATA[22] = {
    title: "Zagadka 22: Mały głód",
    content: `<div style="display: grid; gap: 0.7em; justify-items: center; font-size: 1.18rem; line-height: 1.5;">
  <div>Bar+Sód+Azot</div>
  <div>Sód</div>
  <div>Lutet+Azot+Węgiel+Wodór</div>
</div>`,
    solution: "banan na lunch"
  };
  PUZZLE_DATA[23] = {
    title: "Zagadka 23",
    content: `<div style="display: grid; place-items: center;">
  <img src="img/belt.jpg" alt="Pasek" style="width: 100%; max-width: 560px; height: auto; display: block; border-radius: 8px;">
</div>`,
    solution: "mars"
  };
  PUZZLE_DATA[24] = {
    title: "Zagadka 24: Łatwiej będzie na telefonie...",
    content: `<div style="display: grid; place-items: center;">
  <img src="img/pochyl.png" alt="Podpowiedź: pochyl telefon" style="width: 100%; max-width: 560px; height: auto; display: block; border-radius: 8px;">
</div>`,
    solution: "bezmiar"
  };
  PUZZLE_DATA[25] = {
    title: "Zagadka 25: Dostał się Filuś na małe ogrodzenie",
    content: `<p><strong>Gdzieś zgubiłaś instrument? Jak go znajdziesz, zacznij od G</strong></p>`,
    solution: "złaź sierściuchu"
  };
  PUZZLE_DATA[27] = {
    //TODO test and adjust hours
    title: "Zagadka 27: Zagubione w czasie",
    work_in_progress: true,
    content: `<div class="clocks-puzzle">
  <div class="clocks-grid">
    <div class="clock-container" data-hour="7" data-letter="C">
      <svg class="clock-svg" viewBox="0 0 120 120"><circle cx="60" cy="60" r="55" fill="white" stroke="#333" stroke-width="2"/><line x1="60" y1="60" x2="60" y2="30" stroke="#333" stroke-width="3" stroke-linecap="round" transform="rotate(215.5 60 60)"/><line x1="60" y1="60" x2="60" y2="12" stroke="#666" stroke-width="2" stroke-linecap="round" transform="rotate(66 60 60)"/><circle cx="60" cy="60" r="3" fill="#333"/></svg>
    </div>
    <div class="clock-container" data-hour="10" data-letter="H">
      <svg class="clock-svg" viewBox="0 0 120 120"><circle cx="60" cy="60" r="55" fill="white" stroke="#333" stroke-width="2"/><line x1="60" y1="60" x2="60" y2="30" stroke="#333" stroke-width="3" stroke-linecap="round" transform="rotate(300 60 60)"/><line x1="60" y1="60" x2="60" y2="12" stroke="#666" stroke-width="2" stroke-linecap="round" transform="rotate(0 60 60)"/><circle cx="60" cy="60" r="3" fill="#333"/></svg>
    </div>
    <div class="clock-container" data-hour="12" data-letter="R">
      <svg class="clock-svg" viewBox="0 0 120 120"><circle cx="60" cy="60" r="55" fill="white" stroke="#333" stroke-width="2"/><line x1="60" y1="60" x2="60" y2="30" stroke="#333" stroke-width="3" stroke-linecap="round" transform="rotate(17.5 60 60)"/><line x1="60" y1="60" x2="60" y2="12" stroke="#666" stroke-width="2" stroke-linecap="round" transform="rotate(210 60 60)"/><circle cx="60" cy="60" r="3" fill="#333"/></svg>
    </div>
    <div class="clock-container" data-hour="12" data-letter="O">
      <svg class="clock-svg" viewBox="0 0 120 120"><circle cx="60" cy="60" r="55" fill="white" stroke="#333" stroke-width="2"/><line x1="60" y1="60" x2="60" y2="30" stroke="#333" stroke-width="3" stroke-linecap="round" transform="rotate(24.5 60 60)"/><line x1="60" y1="60" x2="60" y2="12" stroke="#666" stroke-width="2" stroke-linecap="round" transform="rotate(294 60 60)"/><circle cx="60" cy="60" r="3" fill="#333"/></svg>
    </div>
    <div class="clock-container" data-hour="2" data-letter="N">
      <svg class="clock-svg" viewBox="0 0 120 120"><circle cx="60" cy="60" r="55" fill="white" stroke="#333" stroke-width="2"/><line x1="60" y1="60" x2="60" y2="30" stroke="#333" stroke-width="3" stroke-linecap="round" transform="rotate(82.5 60 60)"/><line x1="60" y1="60" x2="60" y2="12" stroke="#666" stroke-width="2" stroke-linecap="round" transform="rotate(270 60 60)"/><circle cx="60" cy="60" r="3" fill="#333"/></svg>
    </div>
    <div class="clock-container" data-hour="5" data-letter="O">
      <svg class="clock-svg" viewBox="0 0 120 120"><circle cx="60" cy="60" r="55" fill="white" stroke="#333" stroke-width="2"/><line x1="60" y1="60" x2="60" y2="30" stroke="#333" stroke-width="3" stroke-linecap="round" transform="rotate(157.5 60 60)"/><line x1="60" y1="60" x2="60" y2="12" stroke="#666" stroke-width="2" stroke-linecap="round" transform="rotate(90 60 60)"/><circle cx="60" cy="60" r="3" fill="#333"/></svg>
    </div>
  </div>
  <div id="puzzle18Letters" class="revealed-letters"></div>
  <p id="puzzle18Status" class="puzzle-status" aria-live="polite">Czekam na prawidłową godzinę...</p>
</div>`,
    solution: "chrono"
  };
  PUZZLE_DATA[28] = {
    title: "WIP Zagadka 28: Gra w życie",
    work_in_progress: true,
    content: `<div class="puzzle28-wrap">
  <p><strong>Klikaj komórki, aby je ożywić. Uruchom symulację i obserwuj kolejne pokolenia.</strong></p>
  <div class="puzzle28-controls">
    <button type="button" id="puzzle28StartBtn" class="small-btn">Start</button>
    <button type="button" id="puzzle28StopBtn" class="small-btn">Stop</button>
    <button type="button" id="puzzle28ClearBtn" class="small-btn">Clear</button>
    <button type="button" id="puzzle28RandomBtn" class="small-btn">Random</button>
    <label for="puzzle28SpeedRange" class="puzzle28-speed-label">Szybkość: <span id="puzzle28SpeedValue">6</span></label>
    <input id="puzzle28SpeedRange" type="range" min="1" max="20" step="1" value="6" aria-label="Szybkość symulacji">
    <p id="puzzle28StepCounter" class="puzzle28-step" aria-live="polite">Krok: 0</p>
  </div>
  <div id="puzzle28Board" class="puzzle28-board" role="grid" aria-label="Siatka gry w życie 40 na 40"></div>
</div>`,
    solution: ""
  };
  PUZZLE_DATA[29] = {
    title: "Zagadka 29",
    content: `<div style="display: grid; gap: 0.7rem; justify-items: center; text-align: center;">
  <p style="font-size: 300%; line-height: 1.2;"><strong>^=&gt;<br>N=Z<br>:=..<br>8=?</strong></p>
</div>`,
    solution: "nieskończoność"
  };
  PUZZLE_DATA[30] = {
    title: "Zagadka 30",
    content: `<div style="display: grid; place-items: center;">
  <img src="img/numery.png" alt="Numery" style="width: 100%; max-width: 560px; height: auto; display: block; border-radius: 8px;">
</div>`,
    solution: "360"
  };
  PUZZLE_DATA[31] = {
    title: "Zagadka 31: Wzór",
    content: `<div style="display: grid; place-items: center;">
  <img src="img/formula.png" alt="Wzór" style="width: 100%; max-width: 560px; height: auto; display: block; border-radius: 8px;">
</div>`,
    solution: "ekosystem"
  };
  PUZZLE_DATA[32] = {
    title: "Zagadka 32: Biała Roszada",
    content: `<div class="puzzle32-wrap">
  <div id="puzzle32Board" class="puzzle32-board" role="grid" aria-label="Szachownica 8 na 8"></div>
  <p id="puzzle32Status" class="puzzle32-status" aria-live="polite">Kliknij pole z figurą, aby rozpocząć ruch.</p>
</div>`,
    starting_board: [
      ["♜", "", "♝", "♛", "♚", "♝", "", "♜"],
      ["", "", "♟", "♟", "♟", "♟", "♟", "♟"],
      ["", "♟", "♞", "", "", "", "", "♞"],
      ["♟", "", "", "", "", "", "", ""],
      ["", "", "", "", "♙", "", "", ""],
      ["", "", "", "♗", "", "", "", "♘"],
      ["♙", "♙", "♙", "♙", "♕", "♙", "♙", "♙"],
      ["♖", "♘", "♗", "", "♔", "", "", "♖"]
    ],
    solution_board: [
      ["♜", "", "♝", "♛", "♚", "♝", "", "♜"],
      ["", "", "♟", "♟", "♟", "♟", "♟", "♟"],
      ["", "♟", "♞", "", "", "", "", "♞"],
      ["♟", "", "", "", "", "", "", ""],
      ["", "", "", "", "♙", "", "", ""],
      ["", "", "", "♗", "", "", "", "♘"],
      ["♙", "♙", "♙", "♙", "♕", "♙", "♙", "♙"],
      ["♖", "♘", "♗", "", "", "♖", "♔", ""]
    ],
    solution: ""
  };
  PUZZLE_DATA[33] = {
    title: "Zagadka 33: Szach-mat!",
    work_in_progress: true,
    content: `<div class="puzzle32-wrap">
  <div id="puzzle32Board" class="puzzle32-board" role="grid" aria-label="Szachownica 8 na 8"></div>
  <p id="puzzle32Status" class="puzzle32-status" aria-live="polite">Kliknij pole z figurą, aby rozpocząć ruch.</p>
</div>`,
    starting_board: [
      ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
      ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
      ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"]
    ],
    solution_board: null,
    solution: ""
  };
  PUZZLE_DATA[34] = {
    title: "Zagadka 34: Sonet",
    work_in_progress: true,
    content: `<div class="puzzle34-wrap" style="display:grid; gap:0.8rem; line-height:1.6; text-align:center;">
  <p><strong>Jako fale dążące ku żwirom wybrzeży</strong></p>
  <p><strong>tak nasze chwile śpieszą ku odległej mecie</strong></p>
  <p><strong>każda zajmuje miejsce tej co przed nią bieży</strong></p>
  <p><strong>i bieg jej podejmuje w odwiecznej sztafecie</strong></p>
  <p><strong>człowiek gdy na świat przyjdzie w świetlistej orbicie</strong></p>
  <p><strong>krąży lecz wkrótce pełznąć pocznie w wiek dojrzały</strong></p>
  <p><strong>a odtąd przeciwności ćmią słoneczne życie</strong></p>
  <p><strong>aż ręce ■■■■■ zniszczą co same wpierw dały</strong></p>
  <p><strong>■■■■ wszelką młodość w końcu z powabu odziera</strong></p>
  <p><strong>złośliwie żłobi bruzdy w najpiękniejszej twarzy</strong></p>
  <p><strong>najrzadszy skarb natury z ochotą pożera</strong></p>
  <p><strong>aż wszystko wokół zetnie najsroższy z kosiarzy</strong></p>
  <p><strong>i wbrew zagładzie tylko mój wiersz ma nadzieję</strong></p>
  <p><strong>że w nim twa chwała będzie jaśnieć jak jaśnieje</strong></p>
  <p><strong>i wbrew zagładzie tylko mój wiersz ma nadzieję</strong></p>
  <p><strong>że w nim twa chwała będzie jaśnieć jak jaśnieje</strong></p>
  <p><strong>jak jaśnieje</strong></p>
</div>`,
    solution: "czas",
    partial_solution: [
      { key: "czasu", message: "Dobre słowo, ale wpisz je w podstawowej formie." }
    ]
  };
  PUZZLE_DATA[35] = {
    title: "Zagadka 35: Podobieństwa i różnice",
    work_in_progress: true,
    content: `<div style="display:grid; gap:0.8rem; justify-items:center; text-align:center;">
  <p><strong>Podobieństwa i różnice</strong></p>
  <p>Sprawdź elementy poniżej notatek: pierwszy wyraz i jego para.</p>
</div>`,
    solution: "przyda się później?"
  };
  PUZZLE_DATA[36] = {
    title: "Zagadka 36: Mystery",
    work_in_progress: true,
    content: `<div class="puzzle36-wrap">
  <div class="puzzle36-casefile">
    <p class="puzzle36-casefile-kicker">Archiwum detektywistyczne</p>
    <p><strong>Sprawa: Tajemnica znikajacego artefaktu</strong></p>
    <p>Zaznaczaj dedukcje w siatce i odtworz przebieg zdarzen jak rasowy detektyw.</p>
  </div>

  <ul class="puzzle36-clues">
    <li>W galerii znaleziono lupę.</li>
    <li>Osoba w bibliotece miała klucz.</li>
    <li>Bartek nie był w bibliotece.</li>
    <li>Ada nie była w galerii.</li>
    <li>W wieży nie było klucza.</li>
    <li>Celina nie była w galerii.</li>
    <li>Sprawca to osoba, która miała lupę.</li>
  </ul>
  <div id="puzzle36Board" class="puzzle36-board" aria-label="Siatka dedukcyjna zagadki 36"></div>
  <div class="puzzle36-actions">
    <button type="button" id="puzzle36CheckBtn" class="small-btn">Sprawdź siatkę</button>
    <button type="button" id="puzzle36ResetBtn" class="small-btn">Wyczyść siatkę</button>
  </div>
  <div class="puzzle36-guess">
    <label>
      Osoba
      <select id="puzzle36GuessPerson">
        <option value="">Wybierz...</option>
        <option value="Ada">Ada</option>
        <option value="Bartek">Bartek</option>
        <option value="Celina">Celina</option>
      </select>
    </label>
    <label>
      Narzędzie
      <select id="puzzle36GuessTool">
        <option value="">Wybierz...</option>
        <option value="Klucz">Klucz</option>
        <option value="Lupa">Lupa</option>
        <option value="Babeczka">Babeczka</option>
      </select>
    </label>
    <label>
      Miejsce
      <select id="puzzle36GuessPlace">
        <option value="">Wybierz...</option>
        <option value="Biblioteka">Biblioteka</option>
        <option value="Galeria">Galeria</option>
        <option value="Wieza">Wieża</option>
      </select>
    </label>
    <button type="button" id="puzzle36GuessCheckBtn" class="small-btn">Sprawdź rozwiązanie</button>
  </div>
  <p id="puzzle36Status" class="puzzle36-status" aria-live="polite">Zaznaczaj wskazówki w siatce.</p>
</div>`,
    solution: "zbrodnia"
  };
  PUZZLE_DATA[64] = {
    title: "Zagadka 64: Na deser",
    work_in_progress: true,
    content: `<p><strong>Czy pamiętasz warzywo?</strong></p>`,
    solution: "słonecznik",
    hint1: "Tej zagadki nie da się rozwiązać bez ukończenia większości poprzednich",
    hint2: "Gdzie najczęściej szukamy deseru w restauracji?",
    hint3: "Karta dań to inaczej...",
    hint4: "Spójrz na główne menu",
    hint5: "TODO: Podpowiedź 5"
  };

  Object.keys(PUZZLE_DATA).forEach((puzzleKey) => {
    const puzzleData = PUZZLE_DATA[puzzleKey];
    if (!puzzleData || typeof puzzleData !== "object") {
      return;
    }

    const hasAnyHint = Object.keys(puzzleData).some((key) => /^hint\d+$/i.test(key));
    if (hasAnyHint) {
      return;
    }

    
  });
  
  const App = {
    state: null,
    notesSaveTimer: null,
    checkFeedbackTimer: null,
    activeHintContext: null,
    audioContext: null,
    meowAudio: null,
    howlAudio: null,
    sonarAudio: null,
    puzzle18IntervalId: null,
    puzzle6PlayedNotes: [],
    puzzle6RecentNotes: [],
    puzzle7Shifts: {
      top: 0,
      bottom: 0
    },
    puzzle15State: null,
    puzzle16State: null,
    puzzle28State: null,
    puzzle32State: null,
    puzzle36State: null,

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
      solvedCounter: null,
      hintsUsedCounter: null
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
      this.els.hintsUsedCounter = document.getElementById("hintsUsedCounter");
      this.els.puzzlePiece1 = document.getElementById("puzzlePiece1");
      this.els.puzzlePiece2 = document.getElementById("puzzlePiece2");
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
            const partialSolution = this.getPartialSolution(this.state.selectedPuzzle, inputValue);
            if (partialSolution) {
              this.setSaveIndicator("To jest częściowe rozwiązanie. Spróbuj dopisać resztę.");
              this.showCheckFeedback(
                "warning",
                partialSolution.title,
                partialSolution.message
              );
              return;
            }

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
        const puzzle14HotspotButton = event.target.closest(".puzzle14-hotspot-btn");
        if (puzzle14HotspotButton) {
          this.handlePuzzle14HotspotClick(puzzle14HotspotButton);
          return;
        }

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

        if (event.target.id === "puzzle15SonarToggle") {
          this.togglePuzzle15Sonar();
          return;
        }

        const puzzle16Btn = event.target.closest(".puzzle16-btn");
        if (puzzle16Btn) {
          this.handlePuzzle16ButtonClick(puzzle16Btn);
          return;
        }

        if (event.target.id === "puzzle6Reset") {
          this.resetPuzzle6MelodyProgress();
          return;
        }

        if (event.target.id === "puzzle7Reset") {
          this.resetPuzzle7Helper();
          return;
        }

        if (event.target.id === "puzzle28StartBtn") {
          this.startPuzzle28Simulation();
          return;
        }

        if (event.target.id === "puzzle28StopBtn") {
          this.stopPuzzle28Simulation();
          return;
        }

        if (event.target.id === "puzzle28ClearBtn") {
          this.clearPuzzle28Board();
          return;
        }

        if (event.target.id === "puzzle28RandomBtn") {
          this.randomizePuzzle28Board();
          return;
        }

        const puzzle28Cell = event.target.closest(".puzzle28-cell");
        if (puzzle28Cell) {
          this.togglePuzzle28Cell(puzzle28Cell);
          return;
        }

        const puzzle32Square = event.target.closest(".puzzle32-square");
        if (puzzle32Square) {
          this.handlePuzzle32SquareClick(puzzle32Square);
          return;
        }

        const puzzle36Cell = event.target.closest(".puzzle36-cell");
        if (puzzle36Cell) {
          this.handlePuzzle36CellClick(puzzle36Cell);
          return;
        }

        if (event.target.id === "puzzle36CheckBtn") {
          this.checkPuzzle36Mystery();
          return;
        }

        if (event.target.id === "puzzle36ResetBtn") {
          this.resetPuzzle36Mystery();
          return;
        }

        if (event.target.id === "puzzle36GuessCheckBtn") {
          this.checkPuzzle36CombinationGuess();
          return;
        }
      });

      this.els.puzzleContent.addEventListener("input", (event) => {
        if (event.target.id === "puzzle28SpeedRange") {
          this.updatePuzzle28Speed(event.target.value);
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
      this.stopPuzzle15Simulation();
      this.stopPuzzle16Grid();
      this.stopPuzzle18Timer();
      this.stopPuzzle28Simulation();
      this.stopPuzzle32Board();
      this.stopPuzzle36Mystery();
      this.els.menuView.classList.remove("hidden");
      this.els.puzzleView.classList.add("hidden");
      this.els.backToMenuBtn.classList.add("hidden");
      document.body.classList.remove("puzzle19-night-sky");
      document.body.classList.remove("puzzle14-debug-mode");
      document.body.classList.remove("puzzle30-white-content");
      document.body.classList.remove("puzzle36-mystery-theme");
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
        const puzzleData = PUZZLE_DATA[id];

        // Undefined = missing PUZZLE_DATA or missing content/solution
        const isUndefined = !puzzleData || (!puzzleData.content && !puzzleData.solution);
        const isWorkInProgress = Boolean(puzzleData && puzzleData.work_in_progress);
        button.classList.toggle("undefined", isUndefined);
        button.classList.toggle("wip", isWorkInProgress);

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

        button.setAttribute("aria-label", `Puzzle ${id} ${puzzle.solved ? "solved" : "unsolved"}${isUndefined ? ", undefined" : ""}${isWorkInProgress ? ", work in progress" : ""}`);
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
      const solvedProgress = (solvedCount / TOTAL_PUZZLES) * 100;
      this.els.solvedCounter.style.setProperty("--progress", `${solvedProgress}%`);

      if (!this.els.hintsUsedCounter) {
        return;
      }

      const hintsUsedCount = Object.values(this.state.hints || {}).reduce((count, puzzleHints) => {
        if (!puzzleHints || typeof puzzleHints !== "object") {
          return count;
        }

        return count + Object.keys(puzzleHints).reduce((hintCount, hintKey) => {
          return hintCount + (Boolean(puzzleHints[hintKey]) ? 1 : 0);
        }, 0);
      }, 0);

      this.els.hintsUsedCounter.textContent = `Użyte Podpowiedzi ${hintsUsedCount}`;
    },

    renderPuzzleView() {
      this.stopPuzzle15Simulation();
      this.stopPuzzle16Grid();
      this.stopPuzzle18Timer();
      this.stopPuzzle28Simulation();
      this.stopPuzzle32Board();
      this.stopPuzzle36Mystery();
      const id = this.state.selectedPuzzle;
      const puzzle = this.getCurrentPuzzle();
      const puzzleData = PUZZLE_DATA[id] || {
        title: `Zagadka ${id}`,
        content: `<p><strong>Treść zagadki dla zagadki ${id}...</strong></p>`
      };

      document.body.classList.toggle("puzzle19-night-sky", id === 19);
      document.body.classList.toggle("puzzle14-debug-mode", id === 14 && PUZZLE_14_DEBUG_MODE);
      document.body.classList.toggle("puzzle30-white-content", id === 30);
      document.body.classList.toggle("puzzle36-mystery-theme", id === 36);

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
      this.renderPasswordPairForCurrentPuzzle();
      if (puzzleData.work_in_progress) {
        const wipBanner = document.createElement("div");
        wipBanner.className = "puzzle-wip-banner";
        wipBanner.setAttribute("role", "status");
        const bannerMessage = typeof puzzleData.work_in_progress_message === "string"
          && puzzleData.work_in_progress_message.trim().length > 0
          ? puzzleData.work_in_progress_message.trim()
          : "PRACA W TOKU: ta zagadka jest jeszcze w trakcie przygotowania.";
        wipBanner.textContent = bannerMessage;
        this.els.puzzleContent.prepend(wipBanner);
      }
      this.closeHintPopup();
      this.renderHintButtons();
      this.renderPuzzleNavigationState();

      if (id === 6) {
        this.resetPuzzle6MelodyProgress();
      }

      if (id === 7) {
        this.resetPuzzle7Helper();
      }

      if (id === 15) {
        this.initPuzzle15Simulation();
      }

      if (id === 16) {
        this.initPuzzle16Grid();
      }

      if (id === 27) {
        this.startPuzzle18Timer();
      }

      if (id === 28) {
        this.initPuzzle28Game();
      }

      if (id === 32 || id === 33) {
        this.initPuzzle32Board();
      }

      if (id === 36) {
        this.initPuzzle36Mystery();
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
      this.trackPuzzle6SecretMelody(note);

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
      this.puzzle6RecentNotes = [];
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

    trackPuzzle6SecretMelody(note) {
      this.puzzle6RecentNotes.push(note);
      if (this.puzzle6RecentNotes.length > PUZZLE_6_SECRET_MELODY.length) {
        this.puzzle6RecentNotes.shift();
      }

      if (this.puzzle6RecentNotes.length < PUZZLE_6_SECRET_MELODY.length) {
        return;
      }

      const matchesSecretMelody = PUZZLE_6_SECRET_MELODY.every((melodyNote, index) => {
        return this.puzzle6RecentNotes[index] === melodyNote;
      });

      if (!matchesSecretMelody) {
        return;
      }

      this.showCheckFeedback("warning", "", "złaź sierściuchu");
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
      overlay.classList.remove("success", "warning", "error", "show");
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

    handlePuzzle14HotspotClick(buttonEl) {
      if (this.state.selectedPuzzle !== 14 || !buttonEl) {
        return;
      }

      const letter = buttonEl.dataset.letter || "";
      if (!letter) {
        return;
      }

      buttonEl.classList.add("revealed");
      buttonEl.textContent = letter;

      const lettersEl = document.getElementById("puzzle14Letters");
      const mapWrapEl = this.els.puzzleContent.querySelector(".puzzle14-map-wrap");
      if (!lettersEl || !mapWrapEl) {
        return;
      }

      const revealedLetters = Array.from(mapWrapEl.querySelectorAll(".puzzle14-hotspot-btn.revealed"))
        .map((hotspot) => hotspot.dataset.letter || "")
        .join("");

      lettersEl.textContent = revealedLetters
        ? `Odkryte litery: ${revealedLetters}`
        : "Kliknij ukryte punkty na mapie.";
    },

    initPuzzle15Simulation() {
      if (this.state.selectedPuzzle !== 15) {
        return;
      }

      const fieldEl = document.getElementById("puzzle15Field");
      const subEl = document.getElementById("puzzle15Submarine");
      const targetEl = document.getElementById("puzzle15Target");
      const toggleEl = document.getElementById("puzzle15SonarToggle");
      const statusEl = document.getElementById("puzzle15Status");
      if (!fieldEl || !subEl || !targetEl || !toggleEl) {
        return;
      }

      const bounds = fieldEl.getBoundingClientRect();
      const margin = 28;
      const targetX = margin + Math.random() * Math.max(1, bounds.width - margin * 2);
      const targetY = margin + Math.random() * Math.max(1, bounds.height - margin * 2);

      this.puzzle15State = {
        enabled: false,
        fieldEl,
        subEl,
        targetEl,
        toggleEl,
        statusEl,
        targetX,
        targetY,
        cursorX: bounds.width * 0.5,
        cursorY: bounds.height * 0.5,
        subX: bounds.width * 0.25,
        subY: bounds.height * 0.75,
        velX: 0,
        velY: 0,
        rafId: null,
        pingTimerId: null,
        pointerHandler: null
      };

      targetEl.style.left = `${targetX}px`;
      targetEl.style.top = `${targetY}px`;
      subEl.style.left = `${this.puzzle15State.subX}px`;
      subEl.style.top = `${this.puzzle15State.subY}px`;
      fieldEl.classList.remove("sonar-active");
      if (statusEl) {
        statusEl.textContent = "Sonar wyłączony.";
      }
      toggleEl.setAttribute("aria-pressed", "false");
      toggleEl.textContent = "Sonar: OFF";
    },

    togglePuzzle15Sonar() {
      const sonar = this.puzzle15State;
      if (!sonar || this.state.selectedPuzzle !== 15) {
        return;
      }

      sonar.enabled = !sonar.enabled;
      sonar.toggleEl.setAttribute("aria-pressed", sonar.enabled ? "true" : "false");
      sonar.toggleEl.textContent = sonar.enabled ? "Sonar: ON" : "Sonar: OFF";
      sonar.fieldEl.classList.toggle("sonar-active", sonar.enabled);

      if (!sonar.enabled) {
        this.stopPuzzle15TimersAndAudio();
        if (sonar.statusEl) {
          sonar.statusEl.textContent = "Sonar wyłączony.";
        }
        return;
      }

      sonar.pointerHandler = (event) => {
        const rect = sonar.fieldEl.getBoundingClientRect();
        sonar.cursorX = event.clientX - rect.left;
        sonar.cursorY = event.clientY - rect.top;
      };
      sonar.fieldEl.addEventListener("pointermove", sonar.pointerHandler);
      if (sonar.statusEl) {
        sonar.statusEl.textContent = "Sonar aktywny. Prowadź łódź kursorem.";
      }

      this.updatePuzzle15Frame();
      this.schedulePuzzle15Ping(600);
    },

    stopPuzzle15TimersAndAudio() {
      const sonar = this.puzzle15State;
      if (!sonar) {
        return;
      }

      if (sonar.rafId) {
        window.cancelAnimationFrame(sonar.rafId);
        sonar.rafId = null;
      }

      if (sonar.pingTimerId) {
        window.clearTimeout(sonar.pingTimerId);
        sonar.pingTimerId = null;
      }

      if (sonar.pointerHandler) {
        sonar.fieldEl.removeEventListener("pointermove", sonar.pointerHandler);
        sonar.pointerHandler = null;
      }

      if (this.sonarAudio) {
        this.sonarAudio.pause();
        this.sonarAudio.currentTime = 0;
      }
    },

    stopPuzzle15Simulation() {
      if (!this.puzzle15State) {
        return;
      }

      this.stopPuzzle15TimersAndAudio();
      this.puzzle15State = null;
    },

    initPuzzle16Grid() {
      this.stopPuzzle16Grid();
      const gridEl = document.getElementById("puzzle16Grid");
      if (!gridEl) {
        return;
      }

      const PUZZLE16_COLORS = ["#EAE5E0", "#BF4E2F", "#F57522", "#265C42"];
      const PUZZLE16_TARGET = [
        ["#EAE5E0","#BF4E2F","#BF4E2F","#F57522","#F57522","#BF4E2F","#F57522","#EAE5E0"],
        ["#BF4E2F","#F57522","#F57522","#265C42","#265C42","#F57522","#BF4E2F","#F57522"],
        ["#BF4E2F","#F57522","#265C42","#265C42","#265C42","#265C42","#F57522","#F57522"],
        ["#BF4E2F","#BF4E2F","#F57522","#265C42","#265C42","#F57522","#BF4E2F","#F57522"],
        ["#BF4E2F","#F57522","#BF4E2F","#BF4E2F","#BF4E2F","#BF4E2F","#F57522","#BF4E2F"],
        ["#BF4E2F","#F57522","#BF4E2F","#F57522","#F57522","#BF4E2F","#F57522","#BF4E2F"],
        ["#BF4E2F","#BF4E2F","#BF4E2F","#F57522","#F57522","#BF4E2F","#F57522","#F57522"],
        ["#EAE5E0","#BF4E2F","#BF4E2F","#BF4E2F","#BF4E2F","#BF4E2F","#BF4E2F","#EAE5E0"]
      ];

      

      gridEl.innerHTML = "";
      const fragment = document.createDocumentFragment();
      this.puzzle16State = { colors: [], isSolved: false };

      for (let row = 0; row < 8; row += 1) {
        for (let col = 0; col < 8; col += 1) {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "puzzle16-btn";
          button.dataset.row = String(row);
          button.dataset.col = String(col);
          const targetColor = PUZZLE16_TARGET[row][col];
          const targetColorIndex = PUZZLE16_COLORS.indexOf(targetColor);
          const targetLabel = String(targetColorIndex);
          button.dataset.colorIndex = "0";
          button.dataset.targetColor = targetColor;
          button.dataset.currentColor = PUZZLE16_COLORS[0];
          button.style.setProperty("background", PUZZLE16_COLORS[0], "important");
          button.style.setProperty("background-color", PUZZLE16_COLORS[0], "important");
          button.textContent = targetLabel;
          fragment.appendChild(button);
          this.puzzle16State.colors.push(0);
        }
      }

      gridEl.appendChild(fragment);
      this.puzzle16State.gridEl = gridEl;
      this.puzzle16State.colors = PUZZLE16_COLORS;
      this.setPuzzle16SolvedVisual(false);
    },

    stopPuzzle16Grid() {
      this.puzzle16State = null;
    },

    handlePuzzle16ButtonClick(btn) {
      if (!this.puzzle16State || this.state.selectedPuzzle !== 16) {
        return;
      }

      const PUZZLE16_COLORS = ["#EAE5E0", "#BF4E2F", "#F57522", "#265C42"];
      let currentIndex = Number(btn.dataset.colorIndex) || 0;
      currentIndex = (currentIndex + 1) % 4;
      const newColor = PUZZLE16_COLORS[currentIndex];
      btn.dataset.colorIndex = String(currentIndex);
      btn.dataset.currentColor = newColor;
      btn.style.setProperty("background", newColor, "important");
      btn.style.setProperty("background-color", newColor, "important");

      this.checkPuzzle16Solution();
    },

    checkPuzzle16Solution() {
      if (!this.puzzle16State || this.state.selectedPuzzle !== 16) {
        return;
      }

      const gridEl = document.getElementById("puzzle16Grid");
      if (!gridEl) {
        return;
      }

      const buttons = gridEl.querySelectorAll(".puzzle16-btn");
      let allMatch = true;

      buttons.forEach((btn) => {
        const targetColor = btn.dataset.targetColor;
        const currentColor = btn.dataset.currentColor;
        if (currentColor !== targetColor) {
          allMatch = false;
        }
      });

      if (allMatch && !this.puzzle16State.isSolved) {
        this.puzzle16State.isSolved = true;
        this.setPuzzle16SolvedVisual(true);
        this.triggerPuzzle16Celebration();
        return;
      }

      if (!allMatch && this.puzzle16State.isSolved) {
        this.puzzle16State.isSolved = false;
        this.setPuzzle16SolvedVisual(false);
      }
    },

    setPuzzle16SolvedVisual(isSolved) {
      const container = this.els.puzzleContent.querySelector(".puzzle16-container");
      const celebration = document.getElementById("puzzle16Celebration");

      if (container) {
        container.classList.toggle("puzzle16-solved", Boolean(isSolved));
      }

      if (!isSolved && celebration) {
        celebration.classList.remove("play");
        celebration.style.display = "none";
      }
    },

    triggerPuzzle16Celebration() {
      const celebration = document.getElementById("puzzle16Celebration");
      if (celebration) {
        celebration.classList.remove("play");
        celebration.style.display = "block";
        void celebration.offsetWidth;
        celebration.classList.add("play");

        window.setTimeout(() => {
          if (!this.puzzle16State || this.state.selectedPuzzle !== 16) {
            return;
          }
          celebration.style.display = "none";
          celebration.classList.remove("play");
        }, 900);
      }
    },

    updatePuzzle15Frame() {
      const sonar = this.puzzle15State;
      if (!sonar || !sonar.enabled || this.state.selectedPuzzle !== 15) {
        return;
      }

      const rect = sonar.fieldEl.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

      const desiredX = clamp(sonar.cursorX, 20, width - 20);
      const desiredY = clamp(sonar.cursorY, 20, height - 20);
      const accel = 0.012;
      const drag = 0.94;
      const maxSpeed = 0.24;

      sonar.velX += (desiredX - sonar.subX) * accel;
      sonar.velY += (desiredY - sonar.subY) * accel;
      sonar.velX *= drag;
      sonar.velY *= drag;

      const speed = Math.hypot(sonar.velX, sonar.velY);
      if (speed > maxSpeed) {
        const speedScale = maxSpeed / speed;
        sonar.velX *= speedScale;
        sonar.velY *= speedScale;
      }

      sonar.subX = clamp(sonar.subX + sonar.velX, 16, width - 16);
      sonar.subY = clamp(sonar.subY + sonar.velY, 16, height - 16);

      sonar.subEl.style.left = `${sonar.subX}px`;
      sonar.subEl.style.top = `${sonar.subY}px`;
      sonar.subEl.style.transform = "translate(-50%, -50%)";

      sonar.rafId = window.requestAnimationFrame(() => {
        this.updatePuzzle15Frame();
      });
    },

    schedulePuzzle15Ping(delayMs = 1100) {
      const sonar = this.puzzle15State;
      if (!sonar || !sonar.enabled || this.state.selectedPuzzle !== 15) {
        return;
      }

      sonar.pingTimerId = window.setTimeout(() => {
        const activeSonar = this.puzzle15State;
        if (!activeSonar || !activeSonar.enabled || this.state.selectedPuzzle !== 15) {
          return;
        }

        if (!this.sonarAudio) {
          this.sonarAudio = new Audio("sounds/sonar.mp3");
          this.sonarAudio.preload = "auto";
        }

        this.sonarAudio.currentTime = 0;
        const playPromise = this.sonarAudio.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => {
            // Ignore blocked autoplay or rapid replay errors.
          });
        }

        const dx = activeSonar.targetX - activeSonar.subX;
        const dy = activeSonar.targetY - activeSonar.subY;
        const distance = Math.hypot(dx, dy);
        const maxDistance = Math.hypot(activeSonar.fieldEl.clientWidth, activeSonar.fieldEl.clientHeight) || 1;
        const normalized = Math.min(1, distance / maxDistance);
        const nextDelay = Math.round((220 + normalized * 1480) * 5);

        if (activeSonar.statusEl) {
          activeSonar.statusEl.textContent = `Dystans do celu: ${Math.round(distance)} px`;
        }

        this.schedulePuzzle15Ping(nextDelay);
      }, delayMs);
    },

    startPuzzle18Timer() {
      if (this.state.selectedPuzzle !== 27) {
        return;
      }

      this.stopPuzzle18Timer();
      this.updatePuzzle18Display();
      this.puzzle18IntervalId = window.setInterval(() => {
        this.updatePuzzle18Display();
      }, 1000);
    },

    stopPuzzle18Timer() {
      if (this.puzzle18IntervalId) {
        window.clearInterval(this.puzzle18IntervalId);
        this.puzzle18IntervalId = null;
      }
    },

    updatePuzzle18Display() {
      if (this.state.selectedPuzzle !== 27) {
        return;
      }

      const now = new Date();
      const currentHour = now.getHours();
      const lettersEl = document.getElementById("puzzle18Letters");
      const statusEl = document.getElementById("puzzle18Status");
      if (!lettersEl || !statusEl) {
        return;
      }

      const containers = document.querySelectorAll("[data-hour][data-letter]");
      const revealed = new Map();

      containers.forEach((container) => {
        const clockHour = Number(container.getAttribute("data-hour"));
        const letter = container.getAttribute("data-letter");

        if (clockHour === currentHour) {
          revealed.set(letter, true);
        }
      });

      const revealedLetters = Array.from(revealed.keys()).sort().join("");
      lettersEl.textContent = revealedLetters;

      if (revealed.size > 0) {
        statusEl.textContent = `Liczba ujawnionych liter: ${revealed.size}/6`;
      } else {
        statusEl.textContent = "Czekam na prawidłową godzinę...";
      }
    },

    initPuzzle28Game() {
      if (this.state.selectedPuzzle !== 28) {
        return;
      }

      this.stopPuzzle28Simulation();
      const boardEl = document.getElementById("puzzle28Board");
      const stepCounterEl = document.getElementById("puzzle28StepCounter");
      const speedRangeEl = document.getElementById("puzzle28SpeedRange");
      const speedValueEl = document.getElementById("puzzle28SpeedValue");
      if (!boardEl || !stepCounterEl || !speedRangeEl || !speedValueEl) {
        return;
      }

      const size = 40;
      const totalCells = size * size;
      const cells = new Uint8Array(totalCells);
      const nextCells = new Uint8Array(totalCells);

      boardEl.innerHTML = "";
      const fragment = document.createDocumentFragment();
      for (let index = 0; index < totalCells; index += 1) {
        const cell = document.createElement("button");
        cell.type = "button";
        cell.className = "puzzle28-cell";
        cell.dataset.p28Index = String(index);
        cell.setAttribute("role", "gridcell");
        cell.setAttribute("aria-label", `Komórka ${index + 1}`);
        fragment.appendChild(cell);
      }
      boardEl.appendChild(fragment);

      this.puzzle28State = {
        size,
        cells,
        nextCells,
        boardEl,
        stepCounterEl,
        speedRangeEl,
        speedValueEl,
        speedValue: Number(speedRangeEl.value) || 6,
        speedMs: 300,
        step: 0,
        intervalId: null
      };

      this.updatePuzzle28Speed(this.puzzle28State.speedValue);
      this.renderPuzzle28Board();
      this.updatePuzzle28StepCounter();
    },

    getPuzzle28SpeedMs(speedValue) {
      const clamped = Math.min(20, Math.max(1, Number(speedValue) || 1));
      return 70 + (20 - clamped) * 45;
    },

    updatePuzzle28Speed(rawValue) {
      const state = this.puzzle28State;
      if (!state || this.state.selectedPuzzle !== 28) {
        return;
      }

      const speedValue = Math.min(20, Math.max(1, Number(rawValue) || 1));
      state.speedValue = speedValue;
      state.speedMs = this.getPuzzle28SpeedMs(speedValue);
      state.speedRangeEl.value = String(speedValue);
      state.speedValueEl.textContent = String(speedValue);

      if (state.intervalId) {
        this.stopPuzzle28Simulation();
        this.startPuzzle28Simulation();
      }
    },

    startPuzzle28Simulation() {
      const state = this.puzzle28State;
      if (!state || this.state.selectedPuzzle !== 28 || state.intervalId) {
        return;
      }

      state.intervalId = window.setInterval(() => {
        this.stepPuzzle28Simulation();
      }, state.speedMs);
    },

    stopPuzzle28Simulation() {
      const state = this.puzzle28State;
      if (!state || !state.intervalId) {
        return;
      }

      window.clearInterval(state.intervalId);
      state.intervalId = null;
    },

    clearPuzzle28Board() {
      const state = this.puzzle28State;
      if (!state || this.state.selectedPuzzle !== 28) {
        return;
      }

      state.cells.fill(0);
      state.nextCells.fill(0);
      state.step = 0;
      this.renderPuzzle28Board();
      this.updatePuzzle28StepCounter();
    },

    randomizePuzzle28Board() {
      const state = this.puzzle28State;
      if (!state || this.state.selectedPuzzle !== 28) {
        return;
      }

      for (let index = 0; index < state.cells.length; index += 1) {
        state.cells[index] = Math.random() < 0.3 ? 1 : 0;
      }

      state.step = 0;
      this.renderPuzzle28Board();
      this.updatePuzzle28StepCounter();
    },

    togglePuzzle28Cell(cellButton) {
      const state = this.puzzle28State;
      if (!state || this.state.selectedPuzzle !== 28 || !cellButton) {
        return;
      }

      const index = Number(cellButton.dataset.p28Index);
      if (Number.isNaN(index) || index < 0 || index >= state.cells.length) {
        return;
      }

      state.cells[index] = state.cells[index] ? 0 : 1;
      cellButton.classList.toggle("alive", Boolean(state.cells[index]));
    },

    stepPuzzle28Simulation() {
      const state = this.puzzle28State;
      if (!state || this.state.selectedPuzzle !== 28) {
        return;
      }

      const { size, cells, nextCells } = state;
      for (let row = 0; row < size; row += 1) {
        for (let col = 0; col < size; col += 1) {
          const index = row * size + col;
          let neighbors = 0;

          for (let dRow = -1; dRow <= 1; dRow += 1) {
            for (let dCol = -1; dCol <= 1; dCol += 1) {
              if (dRow === 0 && dCol === 0) {
                continue;
              }

              const nRow = row + dRow;
              const nCol = col + dCol;
              if (nRow < 0 || nRow >= size || nCol < 0 || nCol >= size) {
                continue;
              }

              neighbors += cells[nRow * size + nCol];
            }
          }

          if (cells[index] === 1) {
            nextCells[index] = neighbors === 2 || neighbors === 3 ? 1 : 0;
          } else {
            nextCells[index] = neighbors === 3 ? 1 : 0;
          }
        }
      }

      cells.set(nextCells);
      state.step += 1;
      this.renderPuzzle28Board();
      this.updatePuzzle28StepCounter();
    },

    renderPuzzle28Board() {
      const state = this.puzzle28State;
      if (!state || !state.boardEl) {
        return;
      }

      const cellElements = state.boardEl.children;
      for (let index = 0; index < cellElements.length; index += 1) {
        const cellElement = cellElements[index];
        cellElement.classList.toggle("alive", Boolean(state.cells[index]));
      }
    },

    updatePuzzle28StepCounter() {
      const state = this.puzzle28State;
      if (!state || !state.stepCounterEl) {
        return;
      }

      state.stepCounterEl.textContent = `Krok: ${state.step}`;
    },

    initPuzzle32Board() {
      if (this.state.selectedPuzzle !== 32 && this.state.selectedPuzzle !== 33) {
        return;
      }

      const puzzleData = PUZZLE_DATA[this.state.selectedPuzzle] || {};
      const boardEl = document.getElementById("puzzle32Board");
      const statusEl = document.getElementById("puzzle32Status");
      if (!boardEl || !statusEl) {
        return;
      }

      const defaultBoard = [
        ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
        ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
        ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"]
      ];
      const startSquares = this.normalizePuzzle32BoardLayout(puzzleData.starting_board, defaultBoard);
      const solutionSquares = this.normalizePuzzle32BoardLayout(puzzleData.solution_board, null);

      boardEl.innerHTML = "";
      const fragment = document.createDocumentFragment();
      for (let index = 0; index < startSquares.length; index += 1) {
        const square = document.createElement("button");
        square.type = "button";
        square.className = "puzzle32-square";
        square.dataset.p32Index = String(index);
        square.setAttribute("role", "gridcell");
        fragment.appendChild(square);
      }
      boardEl.appendChild(fragment);

      this.puzzle32State = {
        boardEl,
        statusEl,
        squares: startSquares.slice(),
        startingSquares: startSquares.slice(),
        solutionSquares,
        selectedIndex: null,
        solutionShown: false
      };

      this.renderPuzzle32Board();
      this.updatePuzzle32Status("Kliknij pole z figurą, aby rozpocząć ruch.");
    },

    normalizePuzzle32BoardLayout(layout, fallbackLayout) {
      if (!Array.isArray(layout) || layout.length !== 8) {
        return Array.isArray(fallbackLayout)
          ? fallbackLayout.flat().map((piece) => typeof piece === "string" ? piece : "")
          : null;
      }

      const flattened = [];
      for (const row of layout) {
        if (!Array.isArray(row) || row.length !== 8) {
          return Array.isArray(fallbackLayout)
            ? fallbackLayout.flat().map((piece) => typeof piece === "string" ? piece : "")
            : null;
        }

        row.forEach((piece) => {
          flattened.push(typeof piece === "string" ? piece : "");
        });
      }

      return flattened;
    },

    stopPuzzle32Board() {
      this.puzzle32State = null;
    },

    handlePuzzle32SquareClick(squareEl) {
      const state = this.puzzle32State;
      if (!state || (this.state.selectedPuzzle !== 32 && this.state.selectedPuzzle !== 33) || !squareEl) {
        return;
      }

      const index = Number(squareEl.dataset.p32Index);
      if (Number.isNaN(index) || index < 0 || index >= state.squares.length) {
        return;
      }

      if (state.selectedIndex === null) {
        state.selectedIndex = index;
        this.renderPuzzle32Board();
        this.updatePuzzle32Status(`Wybrane pole ${this.getPuzzle32SquareLabel(index)}.`);
        return;
      }

      if (state.selectedIndex === index) {
        state.selectedIndex = null;
        this.renderPuzzle32Board();
        this.updatePuzzle32Status("Wybór anulowany.");
        return;
      }

      const fromIndex = state.selectedIndex;
      const fromPiece = state.squares[fromIndex];
      const toPiece = state.squares[index];

      state.squares[fromIndex] = toPiece;
      state.squares[index] = fromPiece;
      state.selectedIndex = null;

      this.renderPuzzle32Board();
      this.updatePuzzle32Status(
        toPiece
          ? `Zamieniono pola ${this.getPuzzle32SquareLabel(fromIndex)} i ${this.getPuzzle32SquareLabel(index)}.`
          : `Przeniesiono figurę z ${this.getPuzzle32SquareLabel(fromIndex)} na ${this.getPuzzle32SquareLabel(index)}.`
      );
      this.checkPuzzle32Solution();
    },

    renderPuzzle32Board() {
      const state = this.puzzle32State;
      if (!state || !state.boardEl) {
        return;
      }

      const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
      const squares = state.boardEl.children;
      for (let index = 0; index < squares.length; index += 1) {
        const row = Math.floor(index / 8);
        const col = index % 8;
        const rank = 8 - row;
        const squareEl = squares[index];
        const piece = state.squares[index];
        const isDark = (row + col) % 2 === 1;

        squareEl.classList.toggle("dark", isDark);
        squareEl.classList.toggle("light", !isDark);
        squareEl.classList.toggle("selected", state.selectedIndex === index);
        squareEl.classList.toggle("occupied", Boolean(piece));
        squareEl.textContent = piece || "";
        squareEl.setAttribute("aria-label", `${files[col]}${rank}${piece ? ` ${piece}` : " puste pole"}`);
      }
    },

    getPuzzle32SquareLabel(index) {
      const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
      const row = Math.floor(index / 8);
      const col = index % 8;
      return `${files[col]}${8 - row}`;
    },

    updatePuzzle32Status(message) {
      const state = this.puzzle32State;
      if (!state || !state.statusEl) {
        return;
      }

      state.statusEl.textContent = message;
    },

    checkPuzzle32Solution() {
      const state = this.puzzle32State;
      if (!state || !Array.isArray(state.solutionSquares) || state.solutionShown) {
        return;
      }

      const isSolved = state.squares.every((piece, index) => {
        return piece === state.solutionSquares[index];
      });

      if (!isSolved) {
        return;
      }

      state.solutionShown = true;
      this.updatePuzzle32Status("Zumzwang");
      this.showCheckFeedback("success", "Brawo!", "Wykonałaś roszadę!");
    },

    initPuzzle36Mystery() {
      if (this.state.selectedPuzzle !== 36) {
        return;
      }

      const boardEl = document.getElementById("puzzle36Board");
      const statusEl = document.getElementById("puzzle36Status");
      if (!boardEl || !statusEl) {
        return;
      }

      const panels = [
        {
          id: "suspectPlace",
          title: "Osoba x Miejsce",
          left: ["Ada", "Bartek", "Celina"],
          right: ["Biblioteka", "Galeria", "Wieza"]
        },
        {
          id: "suspectItem",
          title: "Osoba x Narzędzie",
          left: ["Ada", "Bartek", "Celina"],
          right: ["Klucz", "Lupa", "Babeczka"]
        },
        {
          id: "placeItem",
          title: "Miejsce x Narzędzie",
          left: ["Biblioteka", "Galeria", "Wieza"],
          right: ["Klucz", "Lupa", "Babeczka"]
        }
      ];

      const marks = {};
      panels.forEach((panel) => {
        marks[panel.id] = {};
        panel.left.forEach((rowKey) => {
          marks[panel.id][rowKey] = {};
          panel.right.forEach((colKey) => {
            marks[panel.id][rowKey][colKey] = "";
          });
        });
      });

      this.puzzle36State = {
        boardEl,
        statusEl,
        panels,
        marks,
        solved: false,
        solution: {
          suspectPlace: {
            Ada: "Biblioteka",
            Bartek: "Galeria",
            Celina: "Wieza"
          },
          suspectItem: {
            Ada: "Klucz",
            Bartek: "Lupa",
            Celina: "Babeczka"
          },
          placeItem: {
            Biblioteka: "Klucz",
            Galeria: "Lupa",
            Wieza: "Babeczka"
          }
        }
      };

      this.renderPuzzle36Board();
      this.updatePuzzle36Status("Zaznaczaj wskazówki w siatce.");
    },

    stopPuzzle36Mystery() {
      this.puzzle36State = null;
    },

    getNextPuzzle36Mark(currentMark) {
      if (currentMark === "") {
        return "x";
      }
      if (currentMark === "x") {
        return "o";
      }
      return "";
    },

    handlePuzzle36CellClick(cellEl) {
      const state = this.puzzle36State;
      if (!state || this.state.selectedPuzzle !== 36 || !cellEl) {
        return;
      }

      const panelId = cellEl.dataset.p36Panel;
      const rowKey = cellEl.dataset.p36Row;
      const colKey = cellEl.dataset.p36Col;
      if (!panelId || !rowKey || !colKey) {
        return;
      }

      const panelMarks = state.marks[panelId];
      if (!panelMarks || !panelMarks[rowKey] || typeof panelMarks[rowKey][colKey] !== "string") {
        return;
      }

      panelMarks[rowKey][colKey] = this.getNextPuzzle36Mark(panelMarks[rowKey][colKey]);
      state.solved = false;
      this.renderPuzzle36Board();
    },

    resetPuzzle36Mystery() {
      const state = this.puzzle36State;
      if (!state || this.state.selectedPuzzle !== 36) {
        return;
      }

      state.panels.forEach((panel) => {
        panel.left.forEach((rowKey) => {
          panel.right.forEach((colKey) => {
            state.marks[panel.id][rowKey][colKey] = "";
          });
        });
      });

      state.solved = false;
      this.renderPuzzle36Board();
      this.updatePuzzle36Status("Siatka wyczyszczona.");
    },

    renderPuzzle36Board() {
      const state = this.puzzle36State;
      if (!state || !state.boardEl) {
        return;
      }

      state.boardEl.innerHTML = "";
      const fragment = document.createDocumentFragment();

      state.panels.forEach((panel) => {
        const panelWrap = document.createElement("section");
        panelWrap.className = "puzzle36-panel";

        const title = document.createElement("h4");
        title.className = "puzzle36-panel-title";
        title.textContent = panel.title;
        panelWrap.appendChild(title);

        const table = document.createElement("table");
        table.className = "puzzle36-table";

        const headRow = document.createElement("tr");
        const corner = document.createElement("th");
        corner.className = "puzzle36-corner";
        corner.textContent = "";
        headRow.appendChild(corner);

        panel.right.forEach((colKey) => {
          const colHead = document.createElement("th");
          colHead.textContent = colKey === "Wieza" ? "Wieża" : colKey;
          headRow.appendChild(colHead);
        });

        const thead = document.createElement("thead");
        thead.appendChild(headRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        panel.left.forEach((rowKey) => {
          const row = document.createElement("tr");
          const rowHead = document.createElement("th");
          rowHead.textContent = rowKey === "Wieza" ? "Wieża" : rowKey;
          row.appendChild(rowHead);

          panel.right.forEach((colKey) => {
            const mark = state.marks[panel.id][rowKey][colKey];
            const td = document.createElement("td");
            const button = document.createElement("button");
            button.type = "button";
            button.className = "puzzle36-cell";
            button.dataset.p36Panel = panel.id;
            button.dataset.p36Row = rowKey;
            button.dataset.p36Col = colKey;
            button.classList.toggle("mark-x", mark === "x");
            button.classList.toggle("mark-o", mark === "o");
            button.textContent = mark === "x" ? "X" : (mark === "o" ? "O" : "");
            button.setAttribute("aria-label", `${rowKey} i ${colKey}: ${mark || "puste"}`);
            td.appendChild(button);
            row.appendChild(td);
          });

          tbody.appendChild(row);
        });

        table.appendChild(tbody);
        panelWrap.appendChild(table);
        fragment.appendChild(panelWrap);
      });

      state.boardEl.appendChild(fragment);
    },

    updatePuzzle36Status(message) {
      const state = this.puzzle36State;
      if (!state || !state.statusEl) {
        return;
      }

      state.statusEl.textContent = message;
    },

    checkPuzzle36Mystery() {
      const state = this.puzzle36State;
      if (!state || this.state.selectedPuzzle !== 36) {
        return;
      }

      for (const panel of state.panels) {
        const panelSolution = state.solution[panel.id];

        for (const rowKey of panel.left) {
          const selectedCols = panel.right.filter((colKey) => state.marks[panel.id][rowKey][colKey] === "o");
          const expectedCol = panelSolution[rowKey];
          if (selectedCols.length !== 1 || selectedCols[0] !== expectedCol) {
            this.updatePuzzle36Status("Jeszcze nie wszystko się zgadza. Sprawdź zaznaczenia O.");
            return;
          }
        }

        for (const colKey of panel.right) {
          const selectedRows = panel.left.filter((rowKey) => state.marks[panel.id][rowKey][colKey] === "o");
          if (selectedRows.length !== 1 || panelSolution[selectedRows[0]] !== colKey) {
            this.updatePuzzle36Status("Każda kolumna powinna mieć dokładnie jedno O.");
            return;
          }
        }
      }

      state.solved = true;
      this.updatePuzzle36Status("Brawo! Dedukcja poprawna. Wybierz kombinację i sprawdź rozwiązanie.");
    },

    checkPuzzle36CombinationGuess() {
      if (this.state.selectedPuzzle !== 36 || !this.puzzle36State) {
        return;
      }

      const personEl = document.getElementById("puzzle36GuessPerson");
      const toolEl = document.getElementById("puzzle36GuessTool");
      const placeEl = document.getElementById("puzzle36GuessPlace");
      if (!personEl || !toolEl || !placeEl) {
        return;
      }

      const person = String(personEl.value || "");
      const tool = String(toolEl.value || "");
      const place = String(placeEl.value || "");
      if (!person || !tool || !place) {
        this.updatePuzzle36Status("Wybierz osobę, narzędzie i miejsce.");
        return;
      }

      const isCorrect = person === "Bartek" && tool === "Lupa" && place === "Galeria";
      if (!isCorrect) {
        this.updatePuzzle36Status("To nie ta kombinacja. Spróbuj ponownie.");
        this.showCheckFeedback("error", "Nie tym razem", "Ta kombinacja nie pasuje do wskazówek.");
        return;
      }

      this.updatePuzzle36Status("Brawo! Odkryto hasło: zbrodnia.");
      this.els.solutionInput.value = "zbrodnia";
      this.showCheckFeedback("success", "Hasło", "zbrodnia");
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

    getPasswordLetterForPuzzle(puzzleId) {
      const password = String(PAIRS_PASSWORD || "");
      if (!password) {
        return null;
      }

      const normalizedPuzzleId = this.normalizePuzzleId(puzzleId);
      const passwordIndex = (normalizedPuzzleId - 1) % password.length;
      const char = password.charAt(passwordIndex);
      if (char === " ") {
        return " "; // Indicate a space, so no pair will be shown
      }
      if (!/[A-Za-z]/.test(char)) {
        return null;
      }
      return char.toUpperCase();
    },

    getRandomPairForLetter(letter) {
      if (!letter || typeof letter !== "string") {
        return null;
      }

      const normalizedLetter = letter.toUpperCase();
      const allPairs = LETTER_PAIR_CATALOG[normalizedLetter];
      if (!Array.isArray(allPairs) || allPairs.length === 0) {
        return null;
      }

      const randomIndex = Math.floor(Math.random() * allPairs.length);
      const selectedPair = allPairs[randomIndex];
      if (!Array.isArray(selectedPair) || selectedPair.length < 2) {
        return null;
      }

      return {
        first: String(selectedPair[0]),
        second: String(selectedPair[1])
      };
    },

    resetPuzzlePieceCard(pieceEl, fallbackAltText) {
      if (!pieceEl) {
        return;
      }

      pieceEl.innerHTML = "";
      const imageEl = document.createElement("img");
      imageEl.src = "";
      imageEl.alt = fallbackAltText;
      imageEl.className = "piece-image";
      pieceEl.appendChild(imageEl);
    },

    setPuzzlePieceCardWord(pieceEl, word) {
      if (!pieceEl) {
        return;
      }

      pieceEl.innerHTML = "";
      const wordEl = document.createElement("span");
      wordEl.className = "piece-word";
      wordEl.textContent = word;
      pieceEl.appendChild(wordEl);
    },

    renderPasswordPairForCurrentPuzzle() {
      const firstPieceEl = this.els.puzzlePiece1;
      const secondPieceEl = this.els.puzzlePiece2;
      if (!firstPieceEl || !secondPieceEl) {
        return;
      }

      const targetLetter = this.getPasswordLetterForPuzzle(this.state.selectedPuzzle);
      if (targetLetter === " ") {
        this.setPuzzlePieceCardWord(firstPieceEl, "");
        this.setPuzzlePieceCardWord(secondPieceEl, "");
        return;
      }
      const randomPair = this.getRandomPairForLetter(targetLetter);
      if (!randomPair) {
        this.setPuzzlePieceCardWord(firstPieceEl, "?");
        this.setPuzzlePieceCardWord(secondPieceEl, "?");
        return;
      }

      this.setPuzzlePieceCardWord(firstPieceEl, randomPair.first);
      this.setPuzzlePieceCardWord(secondPieceEl, randomPair.second);
    },

    getExpectedSolution(puzzleId) {
      const puzzleData = PUZZLE_DATA[puzzleId];
      if (!puzzleData || typeof puzzleData.solution !== "string") {
        return null;
      }

      const solution = puzzleData.solution.trim();
      return solution.length > 0 ? solution : null;
    },

    getPartialSolution(puzzleId, inputValue) {
      const puzzleData = PUZZLE_DATA[puzzleId];
      if (!puzzleData || !Array.isArray(puzzleData.partial_solution) || puzzleData.partial_solution.length === 0) {
        return null;
      }

      for (const partial of puzzleData.partial_solution) {
        if (typeof partial === "object" && partial !== null) {
          const key = typeof partial.key === "string" ? partial.key.trim() : "";
          if (key.length > 0 && inputValue === key) {
            const message = typeof partial.message === "string" && partial.message.trim().length > 0
              ? partial.message.trim()
              : "To część poprawnej odpowiedzi. Dopracuj hasło.";

            return {
              key,
              message,
              title: "Prawie!"
            };
          }
        }
      }

      return null;
    },

    isMatchingSolution(inputValue, expectedSolution) {
      return inputValue.trim().toLowerCase() === expectedSolution.trim().toLowerCase();
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
      overlay.classList.remove("success", "warning", "error", "show", "moon-phase-only");
      overlay.classList.add(type);

      // Force reflow so the animation can retrigger when checking quickly.
      void overlay.offsetWidth;
      overlay.classList.add("show");
      overlay.setAttribute("aria-hidden", "false");

      this.checkFeedbackTimer = window.setTimeout(() => {
        overlay.classList.remove("show");
        overlay.setAttribute("aria-hidden", "true");
      }, type === "success" ? 1800 : (type === "warning" ? 2200 : 1400));
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
