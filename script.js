const TABLE_SIZE = 11;
const SEASONS = ["spring", "summer", "autumn", "winter"];

const missions = {
  basic: [
    {
      title: "Az erdő széle",
      description:
        "A térképed szélével szomszédos erdőmezőidért egy-egy pontot kapsz.",
      eval: function (tableContent) {
        let points = 0;
        this.tiles = [];
        for (let i = 0; i < TABLE_SIZE; i++) {
          for (let j = 0; j < TABLE_SIZE; j++) {
            if (tableContent[i][j] == "forest") {
              if (
                i == 0 ||
                i == TABLE_SIZE - 1 ||
                j == 0 ||
                j == TABLE_SIZE - 1
              ) {
                points++;
                this.tiles.push([i, j]);
              }
            }
          }
        }
        return points;
      },
      active: false,
      points: 0,
      tiles: [],
    },
    {
      title: "Álmos-völgy",
      description:
        "Minden olyan sorért, amelyben három erdőmező van, négy-négy pontot kapsz.",
      eval: function (tableContent) {
        let points = 0;
        this.tiles = [];
        for (let i = 0; i < TABLE_SIZE; i++) {
          let forestCount = 0;
          for (let j = 0; j < TABLE_SIZE; j++) {
            if (tableContent[i][j] == "forest") {
              forestCount++;
            }
          }
          if (forestCount == 3) {
            points += 4;
            for (let j = 0; j < TABLE_SIZE; j++) {
              if (tableContent[i][j] == "forest") {
                this.tiles.push([i, j]);
              }
            }
          }
        }
        return points;
      },
      active: false,
      points: 0,
      tiles: [],
    },
    {
      title: "Krumpliöntözés",
      description:
        "A farmmezőiddel szomszédos vízmezőidért két-két pontot kapsz.",
      eval: function (tableContent) {
        let points = 0;
        this.tiles = [];
        let tmpTiles = [];
        for (let i = 0; i < TABLE_SIZE; i++) {
          for (let j = 0; j < TABLE_SIZE; j++) {
            if (tableContent[i][j] == "farm") {
              if (i > 0 && tableContent[i - 1][j] == "water") {
                tmpTiles.push([i - 1, j]);
              }
              if (i < TABLE_SIZE - 1 && tableContent[i + 1][j] == "water") {
                tmpTiles.push([i + 1, j]);
              }
              if (j > 0 && tableContent[i][j - 1] == "water") {
                tmpTiles.push([i, j - 1]);
              }
              if (j < TABLE_SIZE - 1 && tableContent[i][j + 1] == "water") {
                tmpTiles.push([i, j + 1]);
              }
            }
          }
        }
        // Remove duplicates
        tmpSet = new Set(tmpTiles.map((e) => JSON.stringify(e)));
        tmpTiles = Array.from(tmpSet).map((e) => JSON.parse(e));

        points = tmpTiles.length * 2;
        this.tiles = tmpTiles;
        return points;
      },
      active: false,
      points: 0,
      tiles: [],
    },
    {
      title: "Határvidék",
      description: "Minden teli sorért vagy oszlopért 6-6 pontot kapsz.",
      eval: function (tableContent) {
        let fullRows = [];
        let fullCols = [];
        let points = 0;
        this.tiles = [];
        for (let i = 0; i < TABLE_SIZE; i++) {
          let rowFull = true;
          let colFull = true;
          for (let j = 0; j < TABLE_SIZE; j++) {
            if (tableContent[i][j] == 0) {
              rowFull = false;
            }
            if (tableContent[j][i] == 0) {
              colFull = false;
            }
          }
          if (rowFull) {
            points += 6;
            fullRows.push(i);
          }
          if (colFull) {
            points += 6;
            fullCols.push(i);
          }
        }
        for (row of fullRows) {
          for (let i = 0; i < TABLE_SIZE; i++) {
            this.tiles.push([row, i]);
          }
        }
        for (col of fullCols) {
          for (let i = 0; i < TABLE_SIZE; i++) {
            this.tiles.push([i, col]);
          }
        }

        return points;
      },
      active: false,
      points: 0,
      tiles: [],
    },
  ],
  extra: [
    {
      title: "Fasor",
      description:
        "A leghosszabb, függőlegesen megszakítás nélkül egybefüggő erdőmezők mindegyikéért kettő-kettő pontot kapsz. Két azonos hosszúságú esetén csak az egyikért.",
      eval: function (tableContent) {
        let points = 0;
        this.tiles = [];
        let tmpTiles = [];
        let maxForestCount = 0;
        for (let i = 0; i < TABLE_SIZE; i++) {
          let forestCount = 0;
          for (let j = 0; j < TABLE_SIZE; j++) {
            if (tableContent[j][i] == "forest") {
              forestCount++;
              tmpTiles.push([j, i]);
            } else {
              if (forestCount > maxForestCount) {
                maxForestCount = forestCount;
                this.tiles = tmpTiles;
              } else {
                tmpTiles = [];
              }
              forestCount = 0;
            }
          }
          if (forestCount > maxForestCount) {
            maxForestCount = forestCount;
          }
        }
        points += maxForestCount * 2;
        return points;
      },
      active: false,
      points: 0,
      tiles: [],
    },
    {
      title: "Gazdag város",
      description:
        "A legalább három különböző tereptípussal szomszédos falurégióidért három-három pontot kapsz.",
      eval: function (tableContent) {
        let points = 0;
        this.tiles = [];
        for (let i = 0; i < TABLE_SIZE; i++) {
          for (let j = 0; j < TABLE_SIZE; j++) {
            if (tableContent[i][j] == "town") {
              let types = {
                town: false,
                farm: false,
                water: false,
                forest: false,
                mountain: false,
              };
              if (i > 0 && tableContent[i - 1][j] != 0) {
                types[tableContent[i - 1][j]] = true;
              }
              if (i < TABLE_SIZE - 1 && tableContent[i + 1][j] != 0) {
                types[tableContent[i + 1][j]] = true;
              }
              if (j > 0 && tableContent[i][j - 1] != 0) {
                types[tableContent[i][j - 1]] = true;
              }
              if (j < TABLE_SIZE - 1 && tableContent[i][j + 1] != 0) {
                types[tableContent[i][j + 1]] = true;
              }
              let typeCount = 0;
              for (type in types) {
                if (types[type]) {
                  typeCount++;
                }
              }
              if (typeCount >= 3) {
                points += 3;
                this.tiles.push([i, j]);
              }
            }
          }
        }
        return points;
      },
      active: false,
      points: 0,
      tiles: [],
    },
    {
      title: "Öntözőcsatorna",
      description:
        "Minden olyan oszlopodért, amelyben a farm illetve a vízmezők száma megegyezik, négy-négy pontot kapsz. Mindkét tereptípusból legalább egy-egy mezőnek lennie kell az oszlopban ahhoz, hogy pontot kaphass érte.",
      eval: function (tableContent) {
        let points = 0;
        this.tiles = [];
        for (let i = 0; i < TABLE_SIZE; i++) {
          let farmCount = 0;
          let waterCount = 0;
          for (let j = 0; j < TABLE_SIZE; j++) {
            if (tableContent[j][i] == "farm") {
              farmCount++;
            }
            if (tableContent[j][i] == "water") {
              waterCount++;
            }
          }
          if (farmCount == waterCount && farmCount > 0 && waterCount > 0) {
            points += 4;
            for (let j = 0; j < TABLE_SIZE; j++) {
              if (tableContent[j][i] == "farm") {
                this.tiles.push([j, i]);
              }
              if (tableContent[j][i] == "water") {
                this.tiles.push([j, i]);
              }
            }
          }
        }
        return points;
      },
      active: false,
      points: 0,
      tiles: [],
    },
    {
      title: "Mágusok völgye",
      description:
        "A hegymezőiddel szomszédos vízmezőidért három-három pontot kapsz.",
      eval: function (tableContent) {
        let points = 0;
        this.tiles = [];
        for (let i = 0; i < TABLE_SIZE; i++) {
          for (let j = 0; j < TABLE_SIZE; j++) {
            if (tableContent[i][j] == "mountain") {
              if (i > 0 && tableContent[i - 1][j] == "water") {
                points += 3;
                this.tiles.push([i - 1, j]);
              }
              if (i < TABLE_SIZE - 1 && tableContent[i + 1][j] == "water") {
                points += 3;
                this.tiles.push([i + 1, j]);
              }
              if (j > 0 && tableContent[i][j - 1] == "water") {
                points += 3;
                this.tiles.push([i, j - 1]);
              }
              if (j < TABLE_SIZE - 1 && tableContent[i][j + 1] == "water") {
                points += 3;
                this.tiles.push([i, j + 1]);
              }
            }
          }
        }
        return points;
      },
      active: false,
      points: 0,
      tiles: [],
    },
    {
      title: "Üres telek",
      description:
        "A városmezőiddel szomszédos üres mezőkért 2-2 pontot kapsz.",
      eval: function (tableContent) {
        let points = 0;
        this.tiles = [];
        for (let i = 0; i < TABLE_SIZE; i++) {
          for (let j = 0; j < TABLE_SIZE; j++) {
            if (tableContent[i][j] == "town") {
              if (i > 0 && tableContent[i - 1][j] == 0) {
                points += 2;
                this.tiles.push([i - 1, j]);
              }
              if (i < TABLE_SIZE - 1 && tableContent[i + 1][j] == 0) {
                points += 2;
                this.tiles.push([i + 1, j]);
              }
              if (j > 0 && tableContent[i][j - 1] == 0) {
                points += 2;
                this.tiles.push([i, j - 1]);
              }
              if (j < TABLE_SIZE - 1 && tableContent[i][j + 1] == 0) {
                points += 2;
                this.tiles.push([i, j + 1]);
              }
            }
          }
        }
        return points;
      },
      active: false,
      points: 0,
      tiles: [],
    },
    {
      title: "Sorház",
      description:
        "A leghosszabb, vízszintesen megszakítás nélkül egybefüggő falumezők mindegyikéért kettő-kettő pontot kapsz.",
      eval: function (tableContent) {
        let points = 0;
        this.tiles = [];
        let maxTownCount = 0;
        for (let i = 0; i < TABLE_SIZE; i++) {
          let townCount = 0;
          for (let j = 0; j < TABLE_SIZE; j++) {
            if (tableContent[i][j] == "town") {
              townCount++;
            } else {
              if (townCount > maxTownCount) {
                maxTownCount = townCount;
                this.tiles = [];
                for (let k = 0; k < townCount; k++) {
                  this.tiles.push([i, j - k - 1]);
                }
              }
              townCount = 0;
            }
          }
          if (townCount > maxTownCount) {
            maxTownCount = townCount;
          }
        }
        points += maxTownCount * 2;
        return points;
      },
      active: false,
      points: 0,
      tiles: [],
    },
    {
      title: "Páratlan silók",
      description:
        "Minden páratlan sorszámú teli oszlopodért 10-10 pontot kapsz.",
      eval: function (tableContent) {
        let points = 0;
        this.tiles = [];
        for (let i = 0; i < TABLE_SIZE; i += 2) {
          let full = true;
          for (let j = 0; j < TABLE_SIZE; j++) {
            if (tableContent[j][i] == 0) {
              full = false;
            }
          }
          if (full) {
            points += 10;
            for (let j = 0; j < TABLE_SIZE; j++) {
              this.tiles.push([j, i]);
            }
          }
        }
        return points;
      },
      active: false,
      points: 0,
      tiles: [],
    },
    {
      title: "Gazdag vidék",
      description:
        "Minden legalább öt különböző tereptípust tartalmazó sorért négy-négy pontot kapsz.",
      eval: function (tableContent) {
        let points = 0;
        this.tiles = [];
        for (let i = 0; i < TABLE_SIZE; i++) {
          let types = [];
          for (let j = 0; j < TABLE_SIZE; j++) {
            if (!types.includes(tableContent[i][j])) {
              types.push(tableContent[i][j]);
            }
          }
          if (types.length >= 5) {
            points += 4;
            for (let j = 0; j < TABLE_SIZE; j++) {
              if (tableContent[i][j] != 0) {
                this.tiles.push([i, j]);
              }
            }
          }
        }
        return points;
      },
      active: false,
      points: 0,
      tiles: [],
    },
    {
      title: "Környezetvédelem",
      description:
        "Minden olyan területért, ahol egy erdőmező határos egy vízmezővel és egy városmezővel is 7 pontot kapsz.",
      eval: function (tableContent) {
        let points = 0;
        this.tiles = [];
        offsets = [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
        ];

        for (let i = 0; i < TABLE_SIZE; i++) {
          for (let j = 0; j < TABLE_SIZE; j++) {
            if (tableContent[i][j] == "forest") {
              let neighbors = new Set();
              for (offset of offsets) {
                if (
                  i + offset[0] >= 0 &&
                  i + offset[0] < TABLE_SIZE &&
                  j + offset[1] >= 0 &&
                  j + offset[1] < TABLE_SIZE
                ) {
                  neighbors.add(tableContent[i + offset[0]][j + offset[1]]);
                }
              }
              if (neighbors.has("water") && neighbors.has("town")) {
                points += 7;
                this.tiles.push([i, j]);
              }
            }
          }
        }

        return points;
      },
      active: false,
      points: 0,
      tiles: [],
    },
    /*{
      title: "Bányaváros",
      description:
        "A térképeden található egy darab bányamezőért 10 pontot kapsz.",
    },*/ //TODO: implement, covering a mountain with a town gives 10 points, but you lose the mountain
  ],
};

const defaultShapes = [
  {
    time: 2,
    type: "water",
    shape: [
      [1, 1, 1],
      [0, 0, 0],
      [0, 0, 0],
    ],
    rotation: 0,
    mirrored: false,
  },
  {
    time: 2,
    type: "town",
    shape: [
      [1, 1, 1],
      [0, 0, 0],
      [0, 0, 0],
    ],
    rotation: 0,
    mirrored: false,
  },
  {
    time: 1,
    type: "forest",
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    rotation: 0,
    mirrored: false,
  },
  {
    time: 2,
    type: "farm",
    shape: [
      [1, 1, 1],
      [0, 0, 1],
      [0, 0, 0],
    ],
    rotation: 0,
    mirrored: false,
  },
  {
    time: 2,
    type: "forest",
    shape: [
      [1, 1, 1],
      [0, 0, 1],
      [0, 0, 0],
    ],
    rotation: 0,
    mirrored: false,
  },
  {
    time: 2,
    type: "town",
    shape: [
      [1, 1, 1],
      [0, 1, 0],
      [0, 0, 0],
    ],
    rotation: 0,
    mirrored: false,
  },
  {
    time: 2,
    type: "farm",
    shape: [
      [1, 1, 1],
      [0, 1, 0],
      [0, 0, 0],
    ],
    rotation: 0,
    mirrored: false,
  },
  {
    time: 1,
    type: "town",
    shape: [
      [1, 1, 0],
      [1, 0, 0],
      [0, 0, 0],
    ],
    rotation: 0,
    mirrored: false,
  },
  {
    time: 1,
    type: "town",
    shape: [
      [1, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    rotation: 0,
    mirrored: false,
  },
  {
    time: 1,
    type: "farm",
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    rotation: 0,
    mirrored: false,
  },
  {
    time: 1,
    type: "farm",
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    rotation: 0,
    mirrored: false,
  },
  {
    time: 2,
    type: "water",
    shape: [
      [1, 1, 1],
      [1, 0, 0],
      [1, 0, 0],
    ],
    rotation: 0,
    mirrored: false,
  },
  {
    time: 2,
    type: "water",
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [1, 0, 0],
    ],
    rotation: 0,
    mirrored: false,
  },
  {
    time: 2,
    type: "forest",
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 1],
    ],
    rotation: 0,
    mirrored: false,
  },
  {
    time: 2,
    type: "forest",
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    rotation: 0,
    mirrored: false,
  },
  {
    time: 2,
    type: "water",
    shape: [
      [1, 1, 0],
      [1, 1, 0],
      [0, 0, 0],
    ],
    rotation: 0,
    mirrored: false,
  },
];

// Only here for convenience
nullShape = {
  time: 0,
  type: "null",
  shape: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
};

// Use destructuring to access elements directly
document.addEventListener("DOMContentLoaded", function () {
  const {
    table,
    sideBar,
    timer,
    rotateButton,
    mirrorButton,
    time,
    questBar,
    springPointsE,
    summerPointsE,
    autumnPointsE,
    winterPointsE,
    restartButton,
    codeButton,
    codeContainer,
    codeInput,
    codeLoadButton,
    tbody,
  } = {
    table: document.getElementById("table"),
    sideBar: document.getElementById("side-bar"),
    timer: document.getElementById("timer"),
    rotateButton: document.getElementById("rotate"),
    mirrorButton: document.getElementById("mirror"),
    time: document.getElementById("time"),
    questBar: document.getElementById("quest-bar"),
    springPointsE: document.getElementById("spring-points"),
    summerPointsE: document.getElementById("summer-points"),
    autumnPointsE: document.getElementById("autumn-points"),
    winterPointsE: document.getElementById("winter-points"),
    restartButton: document.getElementById("restart"),
    codeButton: document.getElementById("code-button"),
    codeContainer: document.getElementById("code"),
    codeInput: document.getElementById("code-input"),
    codeLoadButton: document.getElementById("code-load"),
    tbody: document.getElementById("main-table"),
  };

  // Image paths
  const mountainPath = "./assets/mountain.png";
  const forestPath = "./assets/forest.png";
  const waterPath = "./assets/water2.png";
  const farmPath = "./assets/farm.png";
  const townPath = "./assets/town.png";

  const imagePathMap = {
    mountain: mountainPath,
    forest: forestPath,
    water: waterPath,
    farm: farmPath,
    town: townPath,
  };
  const seasonNames = ["spring", "summer", "autumn", "winter"];

  // Global variables
  let keyRepeat = {
    counter: 0,
    longTimeout: null,
    shortTimeout: null,
    justPressedRestart: false,
    justPressedRestartTimeout: null,
  };

  let gameData = {
    shapes: [],
    targetCenter: { x: 5, y: 5 },
    mousePos: { x: 0, y: 0 },
    timeLeft: 28,
    currentSeason: 0, // 0: spring, 1: summer, 2: autumn, 3: winter
    quests: {},
    currentShape: nullShape,
    tableContent: [],
    markedTiles: [],
  };

  let points = {
    global: 0,
    spring: 0,
    summer: 0,
    autumn: 0,
    winter: 0,
  };

  let tileToWiggle = { x: 0, y: 0 };
  let tileToDodge = { x: 0, y: 0 };
  let tileToRotate = { x: 0, y: 0 };

  function cleanData() {
    keyRepeat = {
      counter: 0,
      longTimeout: null,
      shortTimeout: null,
      justPressedRestart: false,
      justPressedRestartTimeout: null,
    };

    gameData = {
      shapes: [],
      targetCenter: { x: 5, y: 5 },
      mousePos: { x: 0, y: 0 },
      timeLeft: 28,
      currentSeason: 0, // 0: spring, 1: summer, 2: autumn, 3: winter
      quests: {},
      currentShape: nullShape,
      tableContent: [],
      markedTiles: [],
      lastMarkedQuestIndex: -1,
    };

    points = {
      global: 0,
      spring: 0,
      summer: 0,
      autumn: 0,
      winter: 0,
    };
  }

  function initializeTableContent() {
    for (let i = 0; i < TABLE_SIZE; i++) {
      gameData.tableContent.push(Array(TABLE_SIZE).fill(0));
    }
  }

  function addMountains() {
    const mountainPositions = [
      [1, 1],
      [3, 8],
      [5, 3],
      [8, 9],
      [9, 5],
    ];

    mountainPositions.forEach(([x, y]) => {
      if (x < TABLE_SIZE && y < TABLE_SIZE) {
        gameData.tableContent[x][y] = "mountain";
      }
    });
  }

  function init() {
    initializeTableContent();
    addMountains();
    contentFromCode(generateCode());

    if (localStorage.getItem("tableContent") !== null) {
      try {
        loadGame();
      } catch (error) {
        localStorage.clear();
      }
    }
    activateQuests();
    initDraw();
    draw();
  }

  // Click event listeners
  codeLoadButton.addEventListener("click", handleCodeLoad);
  restartButton.addEventListener("click", restart);
  rotateButton.addEventListener("click", rotateAndDraw);
  mirrorButton.addEventListener("click", mirrorAndDraw);
  codeButton.addEventListener("click", handleCodeButtonClick);

  // Mousemove event listener
  document.addEventListener("mousemove", handleMouseMove);

  // Click event listener
  document.addEventListener("click", handleMouseClick);

  // Keydown event listeners
  document.addEventListener("keydown", handleRestartShortcut);
  document.addEventListener("keydown", handleRotateMirrorShortcut);
  document.addEventListener("keypress", handleKeyPress);

  // Functions to handle events
  function handleCodeLoad() {
    localStorage.clear();
    const code = codeInput.value;
    codeContainer.innerHTML = code;
    contentFromCode(code);
    draw();
  }

  function rotateAndDraw() {
    rotateCurrentShape();
    draw();
  }

  function mirrorAndDraw() {
    mirrorCurrentShape();
    draw();
  }

  function handleCodeButtonClick() {
    localStorage.clear();
    cleanData();
    init();
    const code = generateCode();
    codeContainer.innerHTML = code;
    contentFromCode(code);
  }

  function handleMouseMove(event) {
    gameData.mousePos = { x: event.clientX, y: event.clientY };
  }

  function handleMouseClick(event) {
    if (canSettle() && mouseIsOverTable()) {
      settleShape();
    }
    draw();
  }

  function handleRestartShortcut(event) {
    if (event.repeat) {
      keyRepeat.counter++;
      clearTimeout(keyRepeat.longTimeout);
      keyRepeat.longTimeout = setTimeout(() => {
        keyRepeat.counter = 0;
      }, 400);
    }
    if (keyRepeat.counter >= 2) {
      clearTimeout(keyRepeat.shortTimeout);
      keyRepeat.shortTimeout = setTimeout(() => {
        keyRepeat.counter = 0;
      }, 50);
      return;
    }
    if (event.key === "r") {
      if (keyRepeat.justPressedRestart) {
        restart();
      }
      keyRepeat.justPressedRestart = true;
      clearTimeout(keyRepeat.justPressedRestartTimeout);
      justPressedRestartTimeout = setTimeout(() => {
        keyRepeat.justPressedRestart = false;
      }, 400);
    }
  }

  function handleRotateMirrorShortcut(event) {
    if (event.repeat) {
      keyRepeat.counter++;
      clearTimeout(keyRepeat.longTimeout);
      keyRepeat.longTimeout = setTimeout(() => {
        keyRepeat.counter = 0;
      }, 400);
    }
    if (keyRepeat.counter >= 4) {
      clearTimeout(keyRepeat.shortTimeout);
      keyRepeat.shortTimeout = setTimeout(() => {
        keyRepeat.counter = 0;
      }, 50);
      return;
    }
    switch (event.key) {
      case "t":
        mirrorCurrentShape();
        break;
      case "f":
        rotateCurrentShape();
        break;
    }
  }

  function handleKeyPress(event) {
    switch (event.key) {
      case "w":
        gameData.targetCenter.y--;
        break;
      case "s":
        targetCenter.y++;
        break;
      case "a":
        gameData.targetCenter.x--;
        break;
      case "d":
        targetCenter.x++;
        break;
      case " ":
        if (canSettle()) {
          settleShape();
        }
        break;
    }
    alignShapeIfOutOfBounds();
    draw();
  }

  function surroundedMountains() {
    let result = 0;

    const isMountain = (i, j) =>
      gameData.currentShape[i] && gameData.currentShape[i][j] === "mountain";

    for (let i = 0; i < TABLE_SIZE; i++) {
      for (let j = 0; j < TABLE_SIZE; j++) {
        if (isMountain(i, j)) {
          const isSurrounded =
            (!isMountain(i - 1, j) || i === 0) &&
            (!isMountain(i + 1, j) || i === TABLE_SIZE - 1) &&
            (!isMountain(i, j - 1) || j === 0) &&
            (!isMountain(i, j + 1) || j === TABLE_SIZE - 1);

          if (isSurrounded) {
            result++;
          }
        }
      }
    }
    return result;
  }
  function deactivateQuests() {
    for (quest of gameData.quests) {
      quest.active = false;
    }
  }

  function activateQuests() {
    switch (gameData.currentSeason) {
      case 0:
        gameData.quests[0].active = true;
        gameData.quests[1].active = true;
        break;
      case 1:
        gameData.quests[1].active = true;
        gameData.quests[2].active = true;
        break;
      case 2:
        gameData.quests[2].active = true;
        gameData.quests[3].active = true;
        break;
      case 3:
        gameData.quests[3].active = true;
        gameData.quests[0].active = true;
        break;
    }
  }

  // Helps the click event listener to determine if the mouse is over the table
  function mouseIsOverTable() {
    const tablePos = table.getBoundingClientRect();

    if (
      gameData.mousePos.x > tablePos.left &&
      gameData.mousePos.x < tablePos.right &&
      gameData.mousePos.y > tablePos.top &&
      gameData.mousePos.y < tablePos.bottom
    ) {
      return true;
    }
    return false;
  }

  function getRandomIdx(length, exclude) {
    const excludedSet = new Set(exclude);
    let i = 0;

    while (i < 100) {
      const rndIdx = Math.floor(Math.random() * length);
      if (!excludedSet.has(rndIdx)) {
        return rndIdx;
      }
      i++;
    }

    return getRandomIdx(length, []);
  }

  function getImagePath(type) {
    return imagePathMap[type] || "";
  }

  function minXOfShape() {
    let minX = 1000;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (gameData.currentShape.shape[i][j] === 1) {
          minX = Math.min(minX, j);
        }
      }
    }
    return minX + gameData.targetCenter.x - 1;
  }

  function minYOfShape() {
    let minY = 1000; // A very large initial value to ensure any actual value is smaller
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (gameData.currentShape.shape[i][j] === 1) {
          minY = Math.min(minY, i);
        }
      }
    }
    return minY + gameData.targetCenter.y - 1;
  }

  function maxXOfShape() {
    let maxX = -1;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (gameData.currentShape.shape[i][j] === 1) {
          maxX = Math.max(maxX, j);
        }
      }
    }
    return maxX + gameData.targetCenter.x - 1;
  }

  function maxYOfShape() {
    let maxY = -1;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (gameData.currentShape.shape[i][j] === 1) {
          maxY = Math.max(maxY, i);
        }
      }
    }
    return maxY + gameData.targetCenter.y - 1;
  }

  function inTargetArea(x, y) {
    const relX = x - gameData.targetCenter.x + 1;
    const relY = y - gameData.targetCenter.y + 1;
    return (
      relX >= 0 &&
      relX < 3 &&
      relY >= 0 &&
      relY < 3 &&
      gameData.currentShape.shape[relY][relX] === 1
    );
  }

  function isTarget(x, y) {
    const relX = x - gameData.targetCenter.x + 1;
    const relY = y - gameData.targetCenter.y + 1;
    return relX >= 0 && relX < 3 && relY >= 0 && relY < 3;
  }

  function checkOverlap(x, y) {
    return inTargetArea(x, y) && gameData.tableContent[y][x] !== 0;
  }

  function canSettle() {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (
          checkOverlap(
            gameData.targetCenter.x - 1 + j,
            gameData.targetCenter.y - 1 + i
          )
        ) {
          return false;
        }
      }
    }
    return true;
  }

  // Handlers

  // This function is called when the mouse is over a cell
  function mouseOverHandler(event) {
    const targetPos = event.target.id.split(" ");
    gameData.targetCenter.x = parseInt(targetPos[1]);
    gameData.targetCenter.y = parseInt(targetPos[0]);
    if (gameData.currentShape.shape[1][1] == 0) {
      if (gameData.currentShape.shape[0][1] == 1) {
        gameData.targetCenter.y++;
      } else if (gameData.currentShape.shape[1][0] == 1) {
        gameData.targetCenter.x++;
      } else if (gameData.currentShape.shape[1][2] == 1) {
        gameData.targetCenter.x--;
      } else if (gameData.currentShape.shape[2][1] == 1) {
        gameData.targetCenter.y--;
      }
    }
    alignShapeIfOutOfBounds();
    drawTable();
    drawSideBar();
  }

  // Drawing functions

  function initDraw() {
    initDrawTable();
    drawSideBar();
    initDrawQuestbar();
  }
  function initDrawQuestbar() {
    evalQuests();
    questBar.innerHTML = "";
    const col1 = document.createElement("div");
    const col2 = document.createElement("div");
    col1.className = "quest-column";
    col2.className = "quest-column";

    gameData.quests.forEach((quest, index) => {
      const questElement = document.createElement("div");
      questElement.className = "quest";
      questElement.classList.add(
        quest.active
          ? seasonNames[gameData.currentSeason] + "-quest"
          : "inactive-quest"
      );

      const title = document.createElement("p");
      title.textContent = quest.title;
      title.classList.add("quest-title");

      const description = document.createElement("p");
      description.textContent = quest.description;
      description.classList.add("quest-description");

      const points = document.createElement("p");
      if (quest.active) {
        points.textContent = "Pontok:" + quest.points;
      }
      points.classList.add("quest-point-text");

      const button = document.createElement("button");
      button.classList.add("button");
      button.classList.add("quest-button");
      button.id = "quest-button-" + index;
      button.innerText = "Mutat";
      button.addEventListener("click", function () {
        gameData.markedTiles = [];
        idx = parseInt(button.id.split("-")[2]);
        if (gameData.lastMarkedQuestIndex === idx) {
          gameData.lastMarkedQuestIndex = -1;
          button.innerText = "Mutat";
          return;
        }

        gameData.markedTiles = gameData.quests[idx].tiles;
        gameData.lastMarkedQuestIndex = idx;
        button.innerText = "Elrejt";
      });

      [title, description, points, button].forEach((element) =>
        questElement.appendChild(element)
      );
      questElement.classList.add("quest");
      if (index < 2) {
        col1.appendChild(questElement);
      }
      if (index >= 2) {
        col2.appendChild(questElement);
      }
    });

    questBar.appendChild(col1);
    questBar.appendChild(col2);
  }

  function drawQuestbar() {
    const questElements = document.getElementsByClassName("quest");
    for (let i = 0; i < questElements.length; i++) {
      if (gameData.quests[i].active) {
        questElements[i].classList.remove("inactive-quest");
        questElements[i].classList.add(
          seasonNames[gameData.currentSeason] + "-quest"
        );
      } else {
        questElements[i].classList.remove(
          seasonNames[gameData.currentSeason] + "-quest"
        );
        questElements[i].classList.add("inactive-quest");
      }
      const points =
        questElements[i].getElementsByClassName("quest-point-text")[0];
      if (gameData.quests[i].active) {
        points.textContent = "Pontok:" + gameData.quests[i].points;
      } else {
        points.textContent = "";
      }
    }
  }

  function drawSideBar() {
    sideBar.innerHTML = "";
    const shape = document.createElement("table");
    const hour = document.createElement("p");
    hour.textContent = "Idő: " + gameData.currentShape.time;
    hour.className = "sidebar-text";

    gameData.currentShape.shape.forEach((row, rowIndex) => {
      const tr = document.createElement("tr");
      row.forEach((cell, colIndex) => {
        const td = document.createElement("td");
        td.className = "cell";
        td.id = `${rowIndex} ${colIndex}`;

        if (cell === 1) {
          td.style.backgroundImage = `url(${getImagePath(
            gameData.currentShape.type
          )})`;
        }
        tr.appendChild(td);
      });
      tr.className = "row";
      shape.appendChild(tr);
    });

    sideBar.appendChild(shape);
    sideBar.appendChild(hour);
  }

  function drawTable() {
    for (let row in gameData.tableContent) {
      for (let col in gameData.tableContent[row]) {
        cell = tbody.rows[row].cells[col];

        cell.style.backgroundImage = `url(${getImagePath(
          gameData.tableContent[row][col]
        )})`;
        cell.className = "cell";
        if (gameData.tableContent[row][col] == "mountain") {
          cell.classList.add("mountain");
        }
        if (tileToWiggle.x == col && tileToWiggle.y == row) {
          cell.classList.add("wiggle");
        }
        if (tileToDodge.x == col && tileToDodge.y == row) {
          cell.classList.add("dodge");
        }
        if (tileToRotate.x == col && tileToRotate.y == row) {
          cell.classList.add("rotate");
        }
        if (isTarget(col, row)) {
          cell.classList.add("target-grid-cell");
        }
        for (let tile of gameData.markedTiles) {
          if (tile[1] == col && tile[0] == row) {
            cell.classList.add("marked-cell");
          }
        }

        if (inTargetArea(col, row)) {
          cell.className = "cell target-cell";
          cell.style.backgroundImage = `url(${getImagePath(
            gameData.currentShape.type
          )})`;
          if (checkOverlap(col, row)) {
            cell.classList.add("invalid-cell");
          } else {
            cell.classList.add("valid-cell");
          }
        }
      }
    }
  }

  function initDrawTable() {
    tbody.innerHTML = "";
    for (let row in gameData.tableContent) {
      let tr = document.createElement("tr");
      for (let col in gameData.tableContent[row]) {
        let cell = document.createElement("td");
        cell.addEventListener("mouseover", mouseOverHandler);
        cell.className = "cell";
        cell.id = `${row} ${col}`; // add id to cell
        cell.style.backgroundImage = `url(${getImagePath(
          gameData.tableContent[row][col]
        )})`;
        if (tileToWiggle.x == col && tileToWiggle.y == row) {
          cell.className = "cell wiggle";
        }

        if (inTargetArea(col, row)) {
          cell.className = "cell target-cell";
          if (checkOverlap(col, row)) {
            cell.className = "cell target-cell invalid-cell";
          } else {
            cell.style.backgroundImage = `url(${getImagePath(
              gameData.currentShape.type
            )})`;
          }
        }

        tr.appendChild(cell);
      }
      tbody.appendChild(tr);
    }
  }

  function drawTimerAndSeasonBar() {
    time.textContent = Math.max(gameData.timeLeft, 0);
    timer.className = `timer ${SEASONS[gameData.currentSeason]}`;

    springPointsE.textContent = points.spring;
    summerPointsE.textContent = points.summer;
    autumnPointsE.textContent = points.autumn;
    winterPointsE.textContent = points.winter;
  }

  function draw() {
    drawTable();
    drawSideBar();
    drawTimerAndSeasonBar();
    drawQuestbar();
  }

  function saveGame() {
    const dataToSave = {
      tableContent: gameData.tableContent,
      shapes: gameData.shapes,
      targetCenter: gameData.targetCenter,
      timeLeft: gameData.timeLeft,
      currentSeason: gameData.currentSeason,
      currentShape: gameData.currentShape,
      globalPoints: points.global,
      springPoints: points.spring,
      summerPoints: points.summer,
      autumnPoints: points.autumn,
      winterPoints: points.winter,
      quests: gameData.quests.map(({ title, points }) => ({ title, points })),
    };

    Object.entries(dataToSave).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  }

  function loadGame() {
    if (localStorage.getItem("tableContent") === null) {
      return;
    }
    const localStorageKeys = [
      "tableContent",
      "shapes",
      "targetCenter",
      "timeLeft",
      "currentSeason",
      "currentShape",
      "globalPoints",
      "springPoints",
      "summerPoints",
      "autumnPoints",
      "winterPoints",
      "quests",
    ];

    const loadedData = localStorageKeys.reduce((data, key) => {
      const item = localStorage.getItem(key);
      if (item) {
        data[key] = JSON.parse(item);
      }
      return data;
    }, {});

    {
      gameData.tableContent = loadedData.tableContent;
      gameData.shapes = loadedData.shapes;
      gameData.targetCenter = loadedData.targetCenter;
      gameData.timeLeft = loadedData.timeLeft;
      gameData.currentSeason = loadedData.currentSeason;
      gameData.currentShape = loadedData.currentShape;
      points.global = loadedData.globalPoints;
      points.spring = loadedData.springPoints;
      points.summer = loadedData.summerPoints;
      points.autumn = loadedData.autumnPoints;
      points.winter = loadedData.winterPoints;
      loadedQuests = loadedData.quests;

      gameData.quests = missions.basic
        .concat(missions.extra)
        .map((quest) => {
          const foundQuest = loadedQuests.find(
            (loadedQuest) => loadedQuest.title === quest.title
          );
          if (foundQuest) {
            quest.points = foundQuest.points;
            return quest;
          }
        })
        .filter(Boolean);

      activateQuests();
    }
  }

  function restart() {
    localStorage.clear();
    cleanData();
    init();
    draw();
  }

  function gameOver() {
    gameData.currentShape = nullShape;
    localStorage.clear();
    draw();

    const totalPoints =
      points.spring +
      points.summer +
      points.autumn +
      points.winter +
      surroundedMountains();

    setTimeout(() => {
      const message =
        `Játék vége!\nPontszámod: ${totalPoints} pont\n` +
        `Tavasz: ${points.spring} pont\n` +
        `Nyár: ${points.summer} pont\n` +
        `Ősz: ${points.autumn} pont\n` +
        `Tél: ${points.winter} pont\n` +
        `Körbevett hegyek: ${surroundedMountains()} pont`;

      alert(message);
      restart();
    }, 100);
  }

  function evalQuests() {
    points.global = gameData.quests.reduce((total, quest) => {
      quest.points = quest.active ? quest.eval(gameData.tableContent) : 0;
      return total + quest.points;
    }, 0);
  }

  function rotateCurrentShape() {
    const n = gameData.currentShape.shape.length;
    gameData.currentShape.rotation = (gameData.currentShape.rotation + 1) % 4;
    const rotatedShape = Array.from({ length: n }, () => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        rotatedShape[j][n - i - 1] = gameData.currentShape.shape[i][j];
      }
    }
    gameData.currentShape.shape = rotatedShape;
  }

  function mirrorCurrentShape() {
    const n = gameData.currentShape.shape.length;
    gameData.currentShape.mirrored = !gameData.currentShape.mirrored;
    const mirroredShape = Array.from({ length: n }, () => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        mirroredShape[i][n - j - 1] = gameData.currentShape.shape[i][j];
      }
    }
    gameData.currentShape.shape = mirroredShape;
  }

  function getRandomShape() {
    return gameData.shapes[Math.floor(Math.random() * gameData.shapes.length)];
  }

  function deactiveQuests() {
    for (quest of gameData.quests) {
      quest.active = false;
    }
  }

  // This function aligns the shape if it is out of bounds
  // This might happen if the shape is rotated or mirrored
  // Might be buggy if the shape is too big (so one in/decrement is not enough)

  function alignShapeIfOutOfBounds() {
    while (minYOfShape() < 0) {
      gameData.targetCenter.y++;
    }
    while (maxYOfShape() > TABLE_SIZE - 1) {
      gameData.targetCenter.y--;
    }
    while (minXOfShape() < 0) {
      gameData.targetCenter.x++;
    }
    while (maxXOfShape() > TABLE_SIZE - 1) {
      gameData.targetCenter.x--;
    }
  }

  // This function is called when the shape is settled
  function settleShape() {
    // Add the shape to the table
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (gameData.currentShape.shape[i][j] == 1) {
          gameData.tableContent[gameData.targetCenter.y - 1 + i][
            gameData.targetCenter.x - 1 + j
          ] = gameData.currentShape.type;
        }
      }
    }
    evalQuests();
    // Decrease the time left and change the season if necessary
    gameData.timeLeft -= gameData.currentShape.time;
    if (gameData.timeLeft <= 0) {
      gameData.timeLeft = 0;
      points.winter = points.global;
      points.global = 0;
    } else if (gameData.timeLeft <= 7) {
      gameData.currentSeason = 3;
      points.autumn = points.global;

      points.global = 0;
    } else if (gameData.timeLeft <= 14) {
      gameData.currentSeason = 2;
      points.summer = points.global;
      points.global = 0;
    } else if (gameData.timeLeft <= 21) {
      gameData.currentSeason = 1;
      points.spring = points.global;
      points.global = 0;
    }
    // Change the quests if necessary
    deactivateQuests();
    activateQuests();
    // Get a new shape from the list, if the list is empty, mix it again
    gameData.currentShape = gameData.shapes[0];
    gameData.shapes.splice(0, 1);
    saveGame();
    if (gameData.timeLeft <= 0) {
      gameOver(); //
    }
  }

  function objectTocode(obj) {
    len = obj.length;
    idxs = [];
    // Fill the array with numbers from 0 to n
    for (let i = 0; i < len; i++) {
      idxs.push(i);
    }
    // Perform Fisher-Yates shuffle
    for (let i = idxs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idxs[i], idxs[j]] = [idxs[j], idxs[i]]; // Swap elements
    }
    code = idxs.join("-");
    return code;
  }

  function generateShapecode() {
    return objectTocode(defaultShapes);
  }
  function generateQuestcode() {
    let basicQuestcode = objectTocode(missions.basic);
    let extraQuestcode = objectTocode(missions.extra);
    q1 = basicQuestcode.split("-")[0];
    q2 = basicQuestcode.split("-")[1];
    q3 = extraQuestcode.split("-")[0];
    q4 = extraQuestcode.split("-")[1];
    code = q1 + "-" + q2 + "/" + q3 + "-" + q4;

    return code;
  }

  function generateCode() {
    let code = "";
    for (i = 0; i < 4; i++) {
      code += generateShapecode();
      code += "/";
    }
    code = code.slice(0, -1);
    code += "x";
    code += generateQuestcode();

    return code;
  }
  function contentFromCode(code) {
    cleanData();
    gameData.shapes = extractShapes(code);
    gameData.quests = extractQuests(code);
    gameData.currentShape = gameData.shapes[0];
    gameData.shapes.splice(0, 1);
    initializeTableContent();
    addMountains();
  }

  function extractShapes(code) {
    const shapeCodes = code.split("x")[0].split("/");
    const extractedShapes = [];
    for (let shapecode of shapeCodes) {
      shapecode = shapecode.split("-");
      for (let i = 0; i < shapecode.length; i++) {
        extractedShapes.push(defaultShapes[shapecode[i]]);
      }
    }
    return extractedShapes;
  }

  function extractQuests(code) {
    const questCodes = code.split("x")[1].split("/");
    const basicQuestcode = questCodes[0].split("-");
    const extraQuestcode = questCodes[1].split("-");

    const basicQuests = extractQuestArray(missions.basic, basicQuestcode);
    const extraQuests = extractQuestArray(missions.extra, extraQuestcode);

    return [...basicQuests, ...extraQuests];
  }

  function extractQuestArray(questSource, questCodes) {
    const extractedQuests = [];
    for (let code of questCodes) {
      const quest = questSource[code];
      if (quest) {
        extractedQuests.push(quest);
      }
    }
    return extractedQuests;
  }

  // Random animations for a bit of fun

  function getRandomTile() {
    return {
      x: Math.floor(Math.random() * TABLE_SIZE),
      y: Math.floor(Math.random() * TABLE_SIZE),
    };
  }
  function randomButtonShake() {
    const buttons = [rotateButton, mirrorButton];
    const events = ["wiggle", "dodge"];
    const rndBtnIdx = Math.floor(Math.random() * buttons.length);
    const rndEventIdx = Math.floor(Math.random() * events.length);
    buttons[rndBtnIdx].classList.add(events[rndEventIdx]);
    setTimeout(() => {
      buttons[rndBtnIdx].classList.remove(events[rndEventIdx]);
    }, 5000);
  }

  const randomEvents = {
    randomWiggle: function () {
      tileToWiggle = getRandomTile();
    },
    randomDodge: function () {
      tileToDodge = getRandomTile();
    },
    randomRotate: function () {
      tileToRotate = getRandomTile();
    },
    randomButtonShake: randomButtonShake,
  };
  function setRandomEvent(func) {
    setInterval(func, Math.max(Math.round(Math.random() * 20000), 5000));
  }

  //MAIN
  init();
  Object.values(randomEvents).forEach((func) => setRandomEvent(func));
  setInterval(draw, 1000);
});
