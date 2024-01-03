// Constants
// DO NOT MODIFY: These are the most important constants, changing them might break the game
const TALBE_SIZE = 11;
const SEASONS = ["spring", "summer", "autumn", "winter"];

const missions = {
  basic: [
    {
      title: "Az erdő széle",
      description:
        "A térképed szélével szomszédos erdőmezőidért egy-egy pontot kapsz.",
      eval: function (tableContent) {
        let points = 0;
        for (let i = 0; i < TALBE_SIZE; i++) {
          for (let j = 0; j < TALBE_SIZE; j++) {
            if (tableContent[i][j] == "forest") {
              if (
                i == 0 ||
                i == TALBE_SIZE - 1 ||
                j == 0 ||
                j == TALBE_SIZE - 1
              ) {
                points++;
              }
            }
          }
        }
        return points;
      },
      active: false,
      points: 0,
    },
    {
      title: "Álmos-völgy",
      description:
        "Minden olyan sorért, amelyben három erdőmező van, négy-négy pontot kapsz.",
      eval: function (tableContent) {
        let points = 0;
        for (let i = 0; i < TALBE_SIZE; i++) {
          let forestCount = 0;
          for (let j = 0; j < TALBE_SIZE; j++) {
            if (tableContent[i][j] == "forest") {
              forestCount++;
            }
          }
          if (forestCount == 3) {
            points += 4;
          }
        }
        return points;
      },
      active: false,
      points: 0,
    },
    {
      title: "Krumpliöntözés",
      description:
        "A farmmezőiddel szomszédos vízmezőidért két-két pontot kapsz.",
      eval: function (tableContent) {
        let points = 0;
        for (let i = 0; i < TALBE_SIZE; i++) {
          for (let j = 0; j < TALBE_SIZE; j++) {
            if (tableContent[i][j] == "farm") {
              if (i > 0 && tableContent[i - 1][j] == "water") {
                points += 2;
              }
              if (i < TALBE_SIZE - 1 && tableContent[i + 1][j] == "water") {
                points += 2;
              }
              if (j > 0 && tableContent[i][j - 1] == "water") {
                points += 2;
              }
              if (j < TALBE_SIZE - 1 && tableContent[i][j + 1] == "water") {
                points += 2;
              }
            }
          }
        }
        return points;
      },
      active: false,
      points: 0,
    },
    {
      title: "Határvidék",
      description: "Minden teli sorért vagy oszlopért 6-6 pontot kapsz.",
      eval: function (tableContent) {
        let points = 0;
        for (let i = 0; i < TALBE_SIZE; i++) {
          let rowFull = true;
          let colFull = true;
          for (let j = 0; j < TALBE_SIZE; j++) {
            if (tableContent[i][j] == 0) {
              rowFull = false;
            }
            if (tableContent[j][i] == 0) {
              colFull = false;
            }
          }
          if (rowFull) {
            points += 6;
          }
          if (colFull) {
            points += 6;
          }
        }
        return points;
      },
      active: false,
      points: 0,
    },
  ],
  extra: [
    {
      title: "Fasor",
      description:
        "A leghosszabb, függőlegesen megszakítás nélkül egybefüggő erdőmezők mindegyikéért kettő-kettő pontot kapsz. Két azonos hosszúságú esetén csak az egyikért.",
      eval: function (tableContent) {
        let points = 0;
        let maxForestCount = 0;
        for (let i = 0; i < TALBE_SIZE; i++) {
          let forestCount = 0;
          for (let j = 0; j < TALBE_SIZE; j++) {
            if (tableContent[j][i] == "forest") {
              forestCount++;
            } else {
              if (forestCount > maxForestCount) {
                maxForestCount = forestCount;
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
    },
    {
      title: "Gazdag város",
      description:
        "A legalább három különböző tereptípussal szomszédos falurégióidért három-három pontot kapsz.",
      eval: function (tableContent) {
        let points = 0;
        for (let i = 0; i < TALBE_SIZE; i++) {
          for (let j = 0; j < TALBE_SIZE; j++) {
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
              if (i < TALBE_SIZE - 1 && tableContent[i + 1][j] != 0) {
                types[tableContent[i + 1][j]] = true;
              }
              if (j > 0 && tableContent[i][j - 1] != 0) {
                types[tableContent[i][j - 1]] = true;
              }
              if (j < TALBE_SIZE - 1 && tableContent[i][j + 1] != 0) {
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
              }
            }
          }
        }
        return points;
      },
      active: false,
      points: 0,
    },
    {
      title: "Öntözőcsatorna",
      description:
        "Minden olyan oszlopodért, amelyben a farm illetve a vízmezők száma megegyezik, négy-négy pontot kapsz. Mindkét tereptípusból legalább egy-egy mezőnek lennie kell az oszlopban ahhoz, hogy pontot kaphass érte.",
      eval: function (tableContent) {
        let points = 0;
        for (let i = 0; i < TALBE_SIZE; i++) {
          let farmCount = 0;
          let waterCount = 0;
          for (let j = 0; j < TALBE_SIZE; j++) {
            if (tableContent[j][i] == "farm") {
              farmCount++;
            }
            if (tableContent[j][i] == "water") {
              waterCount++;
            }
          }
          if (farmCount == waterCount && farmCount > 0 && waterCount > 0) {
            points += 4;
          }
        }
        return points;
      },
      active: false,
      points: 0,
    },
    {
      title: "Mágusok völgye",
      description:
        "A hegymezőiddel szomszédos vízmezőidért három-három pontot kapsz.",
      eval: function (tableContent) {
        let points = 0;
        for (let i = 0; i < TALBE_SIZE; i++) {
          for (let j = 0; j < TALBE_SIZE; j++) {
            if (tableContent[i][j] == "mountain") {
              if (i > 0 && tableContent[i - 1][j] == "water") {
                points += 3;
              }
              if (i < TALBE_SIZE - 1 && tableContent[i + 1][j] == "water") {
                points += 3;
              }
              if (j > 0 && tableContent[i][j - 1] == "water") {
                points += 3;
              }
              if (j < TALBE_SIZE - 1 && tableContent[i][j + 1] == "water") {
                points += 3;
              }
            }
          }
        }
        return points;
      },
      active: false,
      points: 0,
    },
    {
      title: "Üres telek",
      description:
        "A városmezőiddel szomszédos üres mezőkért 2-2 pontot kapsz.",
      eval: function (tableContent) {
        let points = 0;
        for (let i = 0; i < TALBE_SIZE; i++) {
          for (let j = 0; j < TALBE_SIZE; j++) {
            if (tableContent[i][j] == "town") {
              if (i > 0 && tableContent[i - 1][j] == 0) {
                points += 2;
              }
              if (i < TALBE_SIZE - 1 && tableContent[i + 1][j] == 0) {
                points += 2;
              }
              if (j > 0 && tableContent[i][j - 1] == 0) {
                points += 2;
              }
              if (j < TALBE_SIZE - 1 && tableContent[i][j + 1] == 0) {
                points += 2;
              }
            }
          }
        }
        return points;
      },
      active: false,
      points: 0,
    },
    {
      title: "Sorház",
      description:
        "A leghosszabb, vízszintesen megszakítás nélkül egybefüggő falumezők mindegyikéért kettő-kettő pontot kapsz.",
      eval: function (tableContent) {
        let points = 0;
        let maxTownCount = 0;
        for (let i = 0; i < TALBE_SIZE; i++) {
          let townCount = 0;
          for (let j = 0; j < TALBE_SIZE; j++) {
            if (tableContent[i][j] == "town") {
              townCount++;
            } else {
              if (townCount > maxTownCount) {
                maxTownCount = townCount;
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
    },
    {
      title: "Páratlan silók",
      description:
        "Minden páratlan sorszámú teli oszlopodért 10-10 pontot kapsz.",
      eval: function (tableContent) {
        let points = 0;
        for (let i = 0; i < TALBE_SIZE; i += 2) {
          let full = true;
          for (let j = 0; j < TALBE_SIZE; j++) {
            if (tableContent[j][i] == 0) {
              full = false;
            }
          }
          if (full) {
            points += 10;
          }
        }
        return points;
      },
      active: false,
      points: 0,
    },
    {
      title: "Gazdag vidék",
      description:
        "Minden legalább öt különböző tereptípust tartalmazó sorért négy-négy pontot kapsz.",
      eval: function (tableContent) {
        let points = 0;
        for (let i = 0; i < TALBE_SIZE; i++) {
          let types = [];
          for (let j = 0; j < TALBE_SIZE; j++) {
            if (!types.includes(tableContent[i][j])) {
              types.push(tableContent[i][j]);
            }
          }
          if (types.length >= 5) {
            points += 4;
          }
        }
        return points;
      },
      active: false,
      points: 0,
    },
  ],
};

const default_shapes = [
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

// HTML elements: Must be in sync with the HTML file
const table = document.getElementById("table");
const tbody = table.querySelector("tbody");
const mountainPath = "./assets/mountain.png";
const forestPath = "./assets/forest.png";
const waterPath = "./assets/water2.png";
const farmPath = "./assets/farm.png";
const townPath = "./assets/town.png";
const sideBar = document.getElementById("side-bar");
const timer = document.getElementById("timer");
const rotateButton = document.getElementById("rotate");
const mirrorButton = document.getElementById("mirror");
const time = document.getElementById("time");
const questBar = document.getElementById("quest-bar");
const springPointsE = document.getElementById("spring-points");
const summerPointsE = document.getElementById("summer-points");
const autumnPointsE = document.getElementById("autumn-points");
const winterPointsE = document.getElementById("winter-points");
const restartButton = document.getElementById("restart");
const seedButton = document.getElementById("seed-button");
const seedContainer = document.getElementById("seed");
const seedInput = document.getElementById("seed-input");
const seedLoadButton = document.getElementById("seed-load");

// Global variables

let keyRepeatCounter = 0;
let longKeyRepeateTimeout = null;
let shortKeyRepeateTimeout = null;
let justPressedRestart = false;
let justPressedRestartTimeout = null;
let shapes = []; // This is the list of shapes that are still available
let targetCenter = { x: 5, y: 5 };
let mousePos = { x: 0, y: 0 };
let timeLeft = 28; // This will determine the current season
let currentSeason = 0; // 0: spring, 1: summer, 2: autumn, 3: winter
let quests = {};
let currentShape = nullShape; // This is the shape that is currently being placed
let tableContent = []; // This is the content of the table

let globalPoints = 0;
let springPoints = 0;
let summerPoints = 0;
let autumnPoints = 0;
let winterPoints = 0;

// Selected tiles for random animations, only used for visual effects
let tileToWiggle = { x: 0, y: 0 };
let tileToDodge = { x: 0, y: 0 };
let tileToRotate = { x: 0, y: 0 };

// Functions for initialisation
quests = getMissions();
init();

// This function is called when the game is over to reset the game
function resetData() {
  shapes = [];
  targetCenter = { x: 5, y: 5 };
  mousePos = { x: 0, y: 0 };
  timeLeft = 28;
  currentSeason = 0;

  quests = {};
  currentShape = nullShape;
  tableContent = [];
  globalPoints = 0;
  springPoints = 0;
  summerPoints = 0;
  autumnPoints = 0;
  winterPoints = 0;
  tileToWiggle = { x: 0, y: 0 };
  tileToDodge = { x: 0, y: 0 };
  tileToRotate = { x: 0, y: 0 };
  currentSeason = 0;

  init();

  currentShape = shapes[0];
  changeQuests();
}

// This function mixes the shapes in a random order
function mixShapes() {
  shapes = JSON.parse(JSON.stringify(default_shapes));
  const mixedShapes = [];
  while (shapes.length > 0) {
    const rndIdx = getRandomIdx(shapes.length, []);
    mixedShapes.push(shapes[rndIdx]);
    shapes.splice(rndIdx, 1);
  }
  shapes = mixedShapes;
}
// This function chooses the missions for the game
function getMissions() {
  const missionList = [];
  const basicMissionList = missions.basic;
  const extraMissionList = missions.extra;

  const rndIdxListBasic = [];
  const rndIdxListExtra = [];
  for (let i = 0; i < 2; i++) {
    rndIdxListBasic.push(
      getRandomIdx(Object.keys(basicMissionList).length, rndIdxListBasic)
    );
    missionList.push(basicMissionList[rndIdxListBasic[i]]);
  }
  for (let i = 0; i < 2; i++) {
    rndIdxListExtra.push(
      getRandomIdx(Object.keys(extraMissionList).length, rndIdxListExtra)
    );
    missionList.push(extraMissionList[rndIdxListExtra[i]]);
  }
  return missionList;
}

// Initialisation of the table
function init() {
  // Initilaise table content
  for (let i = 0; i < TALBE_SIZE; i++) {
    tableContent.push([]);
    for (let j = 0; j < TALBE_SIZE; j++) {
      tableContent[i].push(0);
    }
  }
  // Add the mountains
  tableContent[1][1] = "mountain";
  tableContent[3][8] = "mountain";
  tableContent[5][3] = "mountain";
  tableContent[8][9] = "mountain";
  tableContent[9][5] = "mountain";

  contentFromSeed(generateSeed());

  changeQuests();

  if (checkLocalStorageForGame()) {
    try {
      loadGame();
    } catch {
      localStorage.clear();
    }
  }
  initDraw();
  draw();
}

// Event listeners

seedLoadButton.addEventListener("click", () => {
  localStorage.clear();
  seed = seedInput.value;
  seedContainer.innerHTML = seed;
  contentFromSeed(seed);
  draw();
});

restartButton.addEventListener("click", () => {
  restart();
});

rotateButton.addEventListener("click", () => {
  rotateCurrentShape();
  draw();
});

mirrorButton.addEventListener("click", () => {
  mirrorCurrentShape();
  draw();
});

document.addEventListener("mousemove", (event) => {
  mousePos = { x: event.clientX, y: event.clientY };
});

document.addEventListener("click", (event) => {
  if (canSettle() && mouseIsOverTable()) {
    settleShape();
  }
  draw();
});

seedButton.addEventListener("click", () => {
  localStorage.clear();
  resetData();
  seed = generateSeed();
  seedContainer.innerHTML = seed;
  contentFromSeed(seed);
});

// This will listen to the restart button, but will only restart the game if the button was pressed twice in a short time and holding the button down will not trigger the restart
document.addEventListener("keydown", (event) => {
  if (event.repeat) {
    keyRepeatCounter++;
    clearTimeout(longKeyRepeateTimeout);
    longKeyRepeateTimeout = setTimeout(() => {
      keyRepeatCounter = 0;
    }, 400);
  }
  if (keyRepeatCounter >= 2) {
    clearTimeout(shortKeyRepeateTimeout);
    shortKeyRepeateTimeout = setTimeout(() => {
      keyRepeatCounter = 0;
    }, 50);
    return;
  }
  switch (event.key) {
    case "r":
      if (justPressedRestart) {
        restart();
      }
      justPressedRestart = true;
      clearTimeout(justPressedRestartTimeout);
      justPressedRestartTimeout = setTimeout(() => {
        justPressedRestart = false;
      }, 400);
      break;
  }
});

// This will listen to the rotate and mirror buttons, but holding the button down will not trigger the action more than 3 times at once
document.addEventListener("keydown", (event) => {
  if (event.repeat) {
    keyRepeatCounter++;
    clearTimeout(longKeyRepeateTimeout);
    longKeyRepeateTimeout = setTimeout(() => {
      keyRepeatCounter = 0;
    }, 400);
  }
  if (keyRepeatCounter >= 4) {
    clearTimeout(shortKeyRepeateTimeout);
    shortKeyRepeateTimeout = setTimeout(() => {
      keyRepeatCounter = 0;
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
});

document.addEventListener("keypress", (event) => {
  switch (event.key) {
    case "w":
      targetCenter.y--;
      break;
    case "s":
      targetCenter.y++;
      break;
    case "a":
      targetCenter.x--;
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
});

// Helper functions

function surroundedMountains() {
  result = 0;
  for (let i = 0; i < TALBE_SIZE; i++) {
    for (let j = 0; j < TALBE_SIZE; j++) {
      if (tableContent[i][j] == "mountain") {
        isSurrounded = true;
        if (i > 0 && tableContent[i - 1][j] == 0) {
          isSurrounded = false;
        }
        if (i < TALBE_SIZE - 1 && tableContent[i + 1][j] == 0) {
          isSurrounded = false;
        }
        if (j > 0 && tableContent[i][j - 1] == 0) {
          isSurrounded = false;
        }
        if (j < TALBE_SIZE - 1 && tableContent[i][j + 1] == 0) {
          isSurrounded = false;
        }
        if (isSurrounded) {
          result++;
        }
      }
    }
  }
  return result;
}

function changeQuests() {
  deactiveQuests();
  activateQuests();
}

// Makes the quests for the current season active
function activateQuests() {
  switch (currentSeason) {
    case 0:
      quests[0].active = true;
      quests[1].active = true;
      break;
    case 1:
      quests[1].active = true;
      quests[2].active = true;
      break;
    case 2:
      quests[2].active = true;
      quests[3].active = true;
      break;
    case 3:
      quests[3].active = true;
      quests[0].active = true;
      break;
  }
}

// Helps the click event listener to determine if the mouse is over the table
function mouseIsOverTable() {
  const tablePos = table.getBoundingClientRect();

  if (
    mousePos.x > tablePos.left &&
    mousePos.x < tablePos.right &&
    mousePos.y > tablePos.top &&
    mousePos.y < tablePos.bottom
  ) {
    return true;
  }
  return false;
}
// Returns a random index, reduces redundancy
function getRandomIdx(length, exclude) {
  let rndIdx = Math.floor(Math.random() * length);
  i = 0;
  while (exclude.includes(rndIdx)) {
    rndIdx = Math.floor(Math.random() * length);
    i++;
    if (i > 100) {
      return getRandomIdx(length, []);
    }
  }
  return rndIdx;
}

// Helps with finding the image path for a given type
function getImagePath(type) {
  switch (type) {
    case "mountain":
      return mountainPath;
    case "forest":
      return forestPath;
    case "water":
      return waterPath;
    case "farm":
      return farmPath;
    case "town":
      return townPath;
  }
  return "";
}

function getSeasonName() {
  switch (currentSeason) {
    case 0:
      return "spring";
    case 1:
      return "summer";
    case 2:
      return "autumn";
    case 3:
      return "winter";
  }
}

function minXOfShape() {
  let minX = 2;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (currentShape.shape[i][j] == 1 && j < minX) {
        minX = j;
      }
    }
  }
  return minX + targetCenter.x - 1;
}

function minYOfShape() {
  let minY = 2;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (currentShape.shape[i][j] == 1 && i < minY) {
        minY = i;
      }
    }
  }
  return minY + targetCenter.y - 1;
}

function maxXOfShape() {
  let maxX = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (currentShape.shape[i][j] == 1 && j > maxX) {
        maxX = j;
      }
    }
  }
  return maxX + targetCenter.x - 1;
}

function maxYOfShape() {
  let maxY = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (currentShape.shape[i][j] == 1 && i > maxY) {
        maxY = i;
      }
    }
  }
  return maxY + targetCenter.y - 1;
}

// Returns true if the given coordinates are in in overlap with the current shape
function inTargetArea(x, y) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (
        currentShape.shape[i][j] == 1 &&
        targetCenter.x - 1 + j == x &&
        targetCenter.y - 1 + i == y
      ) {
        return true;
      }
    }
  }
  return false;
}

// Returns true if the given coordinates are in the 3x3 target area
function isTarget(x, y) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (targetCenter.x - 1 + j == x && targetCenter.y - 1 + i == y) {
        return true;
      }
    }
  }
  return false;
}

// Return true if the given coordinates are in overlap with the current shape and the table is not empty at that position
function checkOverlap(x, y) {
  if (inTargetArea(x, y) && tableContent[y][x] != 0) {
    return true;
  }
  return false;
}

// If the targeted are is empty, the shape can be settled
function canSettle() {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (checkOverlap(targetCenter.x - 1 + j, targetCenter.y - 1 + i)) {
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
  targetCenter.x = parseInt(targetPos[1]);
  targetCenter.y = parseInt(targetPos[0]);
  if (currentShape.shape[1][1] == 0) {
    if (currentShape.shape[0][1] == 1) {
      targetCenter.y++;
    } else if (currentShape.shape[1][0] == 1) {
      targetCenter.x++;
    } else if (currentShape.shape[1][2] == 1) {
      targetCenter.x--;
    } else if (currentShape.shape[2][1] == 1) {
      targetCenter.y--;
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
  drawTimer();
  drawQuestbar();
}

function drawQuestbar() {
  evalQuests();
  questBar.innerHTML = "";
  const row1 = document.createElement("div");
  row1.className = "quest-row";
  const row2 = document.createElement("div");
  row2.className = "quest-row";
  const col1 = document.createElement("div");
  col1.className = "quest-column";
  const col2 = document.createElement("div");
  col2.className = "quest-column";
  const col3 = document.createElement("div");
  col3.className = "quest-column";
  const col4 = document.createElement("div");
  col4.className = "quest-column";
  for (let i = 0; i < quests.length; i++) {
    const quest = document.createElement("div");
    quest.className = "quest";
    if (quests[i].active) {
      quest.classList.add(getSeasonName() + "-quest");
    } else {
      quest.classList.add("inactive-quest");
    }
    const title = document.createElement("p");
    title.classList.add("quest-title");
    title.innerHTML = quests[i].title;
    title.className = "quest-title";
    const description = document.createElement("p");
    description.classList.add("quest-description");
    description.innerHTML = quests[i].description;
    description.className = "quest-description";
    const points = document.createElement("p");
    if (quests[i].active) {
      points.innerHTML = "Pontok:" + quests[i].points;
    }
    points.className = "quest-point-text";
    quest.appendChild(title);
    quest.appendChild(description);
    quest.appendChild(points);
    switch (i % 4) {
      case 0:
        col1.appendChild(quest);
        break;
      case 1:
        col2.appendChild(quest);
        break;
      case 2:
        col3.appendChild(quest);
        break;
      case 3:
        col4.appendChild(quest);
        break;
    }
  }
  row1.appendChild(col1);
  row1.appendChild(col2);
  row2.appendChild(col3);
  row2.appendChild(col4);
  questBar.appendChild(row1);
  questBar.appendChild(row2);
}
function drawTimer() {
  time.innerHTML = timeLeft;
  if (timeLeft <= 0) {
    time.innerHTML = "0";
  }
  timer.className = "timer " + SEASONS[currentSeason];
}

function drawSideBar() {
  sideBar.innerHTML = "";
  const shape = document.createElement("table");

  const hour = document.createElement("p");
  hour.innerHTML = "Idő: " + currentShape.time;
  hour.className = "sidebar-text";

  for (let i = 0; i < currentShape.shape.length; i++) {
    const tr = document.createElement("tr");
    for (let j = 0; j < currentShape.shape[0].length; j++) {
      const td = document.createElement("td");
      if (currentShape.shape[i][j] == 1) {
        td.style.backgroundImage = `url(${getImagePath(currentShape.type)})`;
      }
      td.className = "cell";
      td.id = `${i} ${j}`;
      tr.appendChild(td);
    }
    tr.className = "row";
    shape.appendChild(tr);
  }
  sideBar.appendChild(shape);
  sideBar.appendChild(hour);
}

function drawTable() {
  for (let row in tableContent) {
    for (let col in tableContent[row]) {
      cell = tbody.rows[row].cells[col];

      cell.style.backgroundImage = `url(${getImagePath(
        tableContent[row][col]
      )})`;
      cell.className = "cell";
      if (tableContent[row][col] == "mountain") {
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

      if (inTargetArea(col, row)) {
        cell.className = "cell target-cell";
        cell.style.backgroundImage = `url(${getImagePath(currentShape.type)})`;
        if (checkOverlap(col, row)) {
          cell.classList.add("invalid-cell");
        } else {
          cell.classList.add("valid-cell");
        }
      }
    }
  }
}
function drawSeasonBar() {
  springPointsE.innerHTML = springPoints;
  summerPointsE.innerHTML = summerPoints;
  autumnPointsE.innerHTML = autumnPoints;
  winterPointsE.innerHTML = winterPoints;
}

function initDrawTable() {
  tbody.innerHTML = "";
  for (let row in tableContent) {
    let tr = document.createElement("tr");
    for (let col in tableContent[row]) {
      let cell = document.createElement("td");
      cell.addEventListener("mouseover", mouseOverHandler);
      cell.className = "cell";
      cell.id = `${row} ${col}`; // add id to cell
      cell.style.backgroundImage = `url(${getImagePath(
        tableContent[row][col]
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
            currentShape.type
          )})`;
        }
      }

      tr.appendChild(cell);
    }
    tbody.appendChild(tr);
  }
}

function draw() {
  drawSeasonBar();
  drawTable();
  drawSideBar();
  drawTimer();
  drawQuestbar();
}

// Game logic functions
function saveGame() {
  localStorage.setItem("tableContent", JSON.stringify(tableContent));
  localStorage.setItem("shapes", JSON.stringify(shapes));
  localStorage.setItem("targetCenter", JSON.stringify(targetCenter));
  localStorage.setItem("timeLeft", JSON.stringify(timeLeft));
  localStorage.setItem("currentSeason", JSON.stringify(currentSeason));
  localStorage.setItem("currentShape", JSON.stringify(currentShape));
  localStorage.setItem("globalPoints", JSON.stringify(globalPoints));
  localStorage.setItem("springPoints", JSON.stringify(springPoints));
  localStorage.setItem("summerPoints", JSON.stringify(summerPoints));
  localStorage.setItem("autumnPoints", JSON.stringify(autumnPoints));
  localStorage.setItem("winterPoints", JSON.stringify(winterPoints));

  const questsToSave = [];
  for (let i = 0; i < quests.length; i++) {
    data = { title: quests[i].title, points: quests[i].points };
    questsToSave.push(data);
  }
  localStorage.setItem("quests", JSON.stringify(questsToSave));
}
function loadGame() {
  tableContent = JSON.parse(localStorage.getItem("tableContent"));
  shapes = JSON.parse(localStorage.getItem("shapes"));
  targetCenter = JSON.parse(localStorage.getItem("targetCenter"));
  timeLeft = JSON.parse(localStorage.getItem("timeLeft"));
  currentSeason = JSON.parse(localStorage.getItem("currentSeason"));

  currentShape = JSON.parse(localStorage.getItem("currentShape"));
  globalPoints = JSON.parse(localStorage.getItem("globalPoints"));
  springPoints = JSON.parse(localStorage.getItem("springPoints"));
  summerPoints = JSON.parse(localStorage.getItem("summerPoints"));
  autumnPoints = JSON.parse(localStorage.getItem("autumnPoints"));
  winterPoints = JSON.parse(localStorage.getItem("winterPoints"));

  loadedQuests = JSON.parse(localStorage.getItem("quests"));
  quests = [];

  for (let i = 0; i < loadedQuests.length; i++) {
    for (quest of missions.basic) {
      if (quest.title == loadedQuests[i].title) {
        quest.points = loadedQuests[i].points;
        quests.push(quest);
      }
    }
    for (quest of missions.extra) {
      if (quest.title == loadedQuests[i].title) {
        quest.points = loadedQuests[i].points;
        quests.push(quest);
      }
    }
  }
  changeQuests();
}
function checkLocalStorageForGame() {
  if (localStorage.getItem("tableContent") != null) {
    return true;
  }
  return false;
}
function restart() {
  localStorage.clear();
  resetData();
  draw();
}

function gameOver() {
  currentShape = nullShape;
  localStorage.clear();
  draw();
  let points = 0;
  points += springPoints;
  points += summerPoints;
  points += autumnPoints;
  points += winterPoints;
  points += surroundedMountains();
  setTimeout(() => {
    alert(
      "Játék vége! \nPontszámod: " +
        points +
        " pont\nTavasz: " +
        springPoints +
        " pont\nNyár: " +
        summerPoints +
        " pont\nŐsz: " +
        autumnPoints +
        " pont\nTél: " +
        winterPoints +
        " pont\nKörbevett hegyek: " +
        surroundedMountains() +
        " pont"
    );
    restart();
  }, 100);
}

function evalQuests() {
  globalPoints = 0;
  for (let i = 0; i < quests.length; i++) {
    quests[i].points = 0;
    if (quests[i].active) {
      quests[i].points = quests[i].eval(tableContent);
      globalPoints += quests[i].points;
    }
  }
}

function rotateCurrentShape() {
  currentShape.rotation = (currentShape.rotation + 1) % 4;
  const tmp = JSON.parse(JSON.stringify(currentShape));
  for (let i = 0; i < tmp.shape.length; i++) {
    for (let j = 0; j < tmp.shape.length; j++) {
      tmp.shape[j][tmp.shape[0].length - i - 1] = currentShape.shape[i][j];
    }
  }
  currentShape = tmp;
}

function mirrorCurrentShape() {
  currentShape.mirrored = !currentShape.mirrored;
  const tmp = JSON.parse(JSON.stringify(currentShape));
  for (let i = 0; i < tmp.shape.length; i++) {
    for (let j = 0; j < tmp.shape.length; j++) {
      tmp.shape[i][tmp.shape[0].length - j - 1] = currentShape.shape[i][j];
    }
  }
  currentShape = tmp;
}

function getRandomShape() {
  return shapes[Math.floor(Math.random() * shapes.length)];
}

function deactiveQuests() {
  for (quest of quests) {
    quest.active = false;
  }
}

// This function aligns the shape if it is out of bounds
// This might happen if the shape is rotated or mirrored
// Might be buggy if the shape is too big (so one in/decrement is not enough)

function alignShapeIfOutOfBounds() {
  while (minYOfShape() < 0) {
    targetCenter.y++;
  }
  while (maxYOfShape() > TALBE_SIZE - 1) {
    targetCenter.y--;
  }
  while (minXOfShape() < 0) {
    targetCenter.x++;
  }
  while (maxXOfShape() > TALBE_SIZE - 1) {
    targetCenter.x--;
  }
}

// This function is called when the shape is settled
function settleShape() {
  // Add the shape to the table
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (currentShape.shape[i][j] == 1) {
        tableContent[targetCenter.y - 1 + i][targetCenter.x - 1 + j] =
          currentShape.type;
      }
    }
  }
  evalQuests();
  // Decrease the time left and change the season if necessary
  timeLeft -= currentShape.time;
  if (timeLeft <= 0) {
    timeLeft = 0;
    winterPoints = globalPoints;
    globalPoints = 0;
  } else if (timeLeft <= 7) {
    currentSeason = 3;
    autumnPoints = globalPoints;

    globalPoints = 0;
  } else if (timeLeft <= 14) {
    currentSeason = 2;
    summerPoints = globalPoints;
    globalPoints = 0;
  } else if (timeLeft <= 21) {
    currentSeason = 1;
    springPoints = globalPoints;
    globalPoints = 0;
  }
  // Change the quests if necessary
  changeQuests();
  // Get a new shape from the list, if the list is empty, mix it again
  currentShape = shapes[0];
  shapes.splice(0, 1);
  if (shapes.length == 0) {
    mixShapes();
    currentShape = shapes[0];
  }
  saveGame();
  if (timeLeft <= 0) {
    gameOver();
  }
}

function objectToSeed(obj) {
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
  seed = idxs.join("-");
  return seed;
}

function generateShapeSeed() {
  return objectToSeed(default_shapes);
}
function generateQuestSeed() {
  let basicQuestSeed = objectToSeed(missions.basic);
  let extraQuestSeed = objectToSeed(missions.extra);
  q1 = basicQuestSeed.split("-")[0];
  q2 = basicQuestSeed.split("-")[1];
  q3 = extraQuestSeed.split("-")[0];
  q4 = extraQuestSeed.split("-")[1];
  seed = q1 + "-" + q2 + "/" + q3 + "-" + q4;

  return seed;
}

// Seed generation for multiplayer
function generateSeed() {
  let seed = "";
  for (i = 0; i < 4; i++) {
    seed += generateShapeSeed();
    seed += "/";
  }
  seed = seed.slice(0, -1);
  seed += "x";
  seed += generateQuestSeed();

  return seed;
}
function contentFromSeed(seed) {
  shapes = [];
  quests = [];
  const shapeSeeds = seed.split("x")[0].split("/");
  const questSeeds = seed.split("x")[1].split("/");
  for (shapeSeed of shapeSeeds) {
    shapeSeed = shapeSeed.split("-");
    for (let i = 0; i < shapeSeed.length; i++) {
      shapes.push(default_shapes[shapeSeed[i]]);
    }
  }

  basicQuestSeed = questSeeds[0].split("-");
  extraQuestSeed = questSeeds[1].split("-");
  const basicQuest1 = missions.basic[basicQuestSeed[0]];
  const basicQuest2 = missions.basic[basicQuestSeed[1]];
  const extraQuest1 = missions.extra[extraQuestSeed[0]];
  const extraQuest2 = missions.extra[extraQuestSeed[1]];

  quests.push(basicQuest1);
  quests.push(basicQuest2);
  quests.push(extraQuest1);
  quests.push(extraQuest2);

  currentShape = shapes[0];
}

// Random animations for a bit of fun

function getRandomTile() {
  const row = Math.floor(Math.random() * TALBE_SIZE);
  const col = Math.floor(Math.random() * TALBE_SIZE);
  return { x: col, y: row };
}

function randomWiggle() {
  tileToWiggle = getRandomTile();
}

function randomDodge() {
  tileToDodge = getRandomTile();
}

function randomRotate() {
  tileToRotate = getRandomTile();
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
// Set random events with a suitable random time interval
function setRandomEvent(func) {
  setInterval(func, Math.max(Math.round(Math.random() * 20000), 5000));
}
setRandomEvent(randomWiggle);
setRandomEvent(randomDodge);
setRandomEvent(randomRotate);
setRandomEvent(randomButtonShake);
// Make sure that the table is redrawn every second
setInterval(drawTable, 1000);
