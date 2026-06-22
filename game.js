const GRID_WIDTH = 8;
const GRID_HEIGHT = 6;
const SAVE_KEY = "song-eatery-game-save-v2";
const LEGACY_SAVE_KEY = "song-eatery-game-save-v1";

const tools = [
  {
    id: "floor",
    name: "铺木地",
    icon: "□",
    cost: 5,
    unlockRep: 0,
    tip: "扩大可经营区域",
    className: "floor",
  },
  {
    id: "table",
    name: "食案",
    icon: "桌",
    cost: 28,
    unlockRep: 0,
    tip: "客人坐下点菜",
    className: "table",
  },
  {
    id: "stove",
    name: "灶台",
    icon: "灶",
    cost: 45,
    unlockRep: 0,
    tip: "提高出菜速度",
    className: "stove",
  },
  {
    id: "decor",
    name: "花窗",
    icon: "景",
    cost: 22,
    unlockRep: 0,
    tip: "提升满意和名声",
    className: "decor",
  },
  {
    id: "counter",
    name: "柜台",
    icon: "柜",
    cost: 38,
    unlockRep: 0,
    tip: "理顺堂口动线",
    className: "counter",
  },
  {
    id: "wineRack",
    name: "酒柜",
    icon: "酒",
    cost: 40,
    unlockRep: 6,
    tip: "提高酒水消费",
    className: "wineRack",
  },
  {
    id: "kitchen",
    name: "后厨",
    icon: "厨",
    cost: 55,
    unlockRep: 10,
    tip: "配合灶台提速",
    className: "kitchen",
  },
  {
    id: "well",
    name: "水井",
    icon: "井",
    cost: 34,
    unlockRep: 14,
    tip: "净水让菜更稳",
    className: "well",
  },
  {
    id: "room",
    name: "雅间",
    icon: "雅",
    cost: 70,
    unlockRep: 20,
    tip: "招待高声望客人",
    className: "room",
  },
  {
    id: "remove",
    name: "拆除",
    icon: "×",
    cost: 0,
    unlockRep: 0,
    tip: "清空一个格子",
    className: "empty",
  },
];

const cuisines = [
  {
    id: "soup",
    name: "羹汤",
    bonusText: "满意更稳",
    effect: { mood: 1, coins: 0, reputation: 0 },
  },
  {
    id: "noodle",
    name: "面点",
    bonusText: "客单更高",
    effect: { mood: 0, coins: 1, reputation: 0 },
  },
  {
    id: "wine",
    name: "酒水",
    bonusText: "伶人与行商多付钱",
    effect: { mood: 0, coins: 2, reputation: 0 },
  },
  {
    id: "seasonal",
    name: "节令菜",
    bonusText: "节庆时名声更快涨",
    effect: { mood: 0, coins: 0, reputation: 1 },
  },
];

const dishes = [
  { name: "葱泼兔", cuisine: "羹汤", cuisineId: "soup", price: 18, reputation: 2 },
  { name: "梅花汤饼", cuisine: "面点", cuisineId: "noodle", price: 24, reputation: 3 },
  { name: "桂花酒", cuisine: "酒水", cuisineId: "wine", price: 30, reputation: 3 },
  { name: "蟹酿橙", cuisine: "节令菜", cuisineId: "seasonal", price: 36, reputation: 5 },
  { name: "拨霞供", cuisine: "羹汤", cuisineId: "soup", price: 42, reputation: 6 },
];

const guestTypes = [
  {
    name: "行商",
    face: "商",
    unlockRep: 0,
    spendBonus: 3,
    patienceBonus: 0,
    preference: "爱点贵菜，客单更高",
  },
  {
    name: "书生",
    face: "士",
    unlockRep: 0,
    spendBonus: 0,
    patienceBonus: 1,
    preference: "爱临窗雅座，满意更稳",
  },
  {
    name: "茶博士",
    face: "茶",
    unlockRep: 8,
    spendBonus: 1,
    patienceBonus: 2,
    preference: "等得起，但看重名声",
  },
  {
    name: "瓦舍伶人",
    face: "伶",
    unlockRep: 16,
    spendBonus: 5,
    patienceBonus: -1,
    preference: "出手阔，但催菜急",
  },
  {
    name: "船客",
    face: "舟",
    unlockRep: 24,
    spendBonus: 2,
    patienceBonus: 0,
    preference: "讨厌烟火贴席",
  },
];

const festivals = [
  {
    month: "正月",
    name: "上元灯会",
    effect: "客流 +1，名声 +1",
    guestBonus: 1,
    moodBonus: 0,
    coinBonus: 0,
    reputationBonus: 1,
  },
  {
    month: "三月",
    name: "寒食踏青",
    effect: "满意 +4",
    guestBonus: 0,
    moodBonus: 4,
    coinBonus: 0,
    reputationBonus: 0,
  },
  {
    month: "五月",
    name: "端午竞渡",
    effect: "船客更早出现，客单 +2",
    guestBonus: 0,
    moodBonus: 0,
    coinBonus: 2,
    reputationBonus: 0,
  },
  {
    month: "八月",
    name: "中秋赏月",
    effect: "客流 +1，满意 +3",
    guestBonus: 1,
    moodBonus: 3,
    coinBonus: 1,
    reputationBonus: 0,
  },
];

const compatibilities = [
  {
    id: "stoveLine",
    name: "双灶成房",
    hint: "两口灶台相邻",
    description: "出菜能力 +1",
    effect: { capacity: 1, mood: 0, price: 0, reputation: 0, guests: 0 },
  },
  {
    id: "windowScene",
    name: "花窗成景",
    hint: "花窗达到 2 扇",
    description: "满意 +4，名声 +1",
    effect: { capacity: 0, mood: 4, price: 0, reputation: 1, guests: 0 },
  },
  {
    id: "windowSeats",
    name: "雅座成区",
    hint: "临窗食案达到 2 张",
    description: "客单 +2，名声 +1",
    effect: { capacity: 0, mood: 0, price: 2, reputation: 1, guests: 0 },
  },
  {
    id: "openHall",
    name: "堂口开阔",
    hint: "食案达到 3 张",
    description: "客流 +1",
    effect: { capacity: 0, mood: 0, price: 0, reputation: 0, guests: 1 },
  },
  {
    id: "frontCounter",
    name: "前柜迎客",
    hint: "摆下 1 个柜台",
    description: "客流 +1",
    effect: { capacity: 0, mood: 0, price: 0, reputation: 0, guests: 1 },
  },
  {
    id: "wineSales",
    name: "席旁酒香",
    hint: "酒柜贴近食案",
    description: "客单 +3",
    effect: { capacity: 0, mood: 0, price: 3, reputation: 0, guests: 0 },
  },
  {
    id: "backKitchen",
    name: "灶连后厨",
    hint: "后厨贴近灶台",
    description: "出菜能力 +2",
    effect: { capacity: 2, mood: 0, price: 0, reputation: 0, guests: 0 },
  },
  {
    id: "clearWater",
    name: "井水入厨",
    hint: "水井贴近灶台或后厨",
    description: "满意 +2，名声 +1",
    effect: { capacity: 0, mood: 2, price: 0, reputation: 1, guests: 0 },
  },
  {
    id: "quietRoom",
    name: "雅间成名",
    hint: "雅间配花窗",
    description: "满意 +2，名声 +2",
    effect: { capacity: 0, mood: 2, price: 0, reputation: 2, guests: 0 },
  },
];

const state = createInitialState();

const elements = {
  grid: document.querySelector("#grid"),
  buildTools: document.querySelector("#buildTools"),
  menuList: document.querySelector("#menuList"),
  customerList: document.querySelector("#customerList"),
  advisor: document.querySelector("#advisor"),
  day: document.querySelector("#day"),
  monthName: document.querySelector("#monthName"),
  coins: document.querySelector("#coins"),
  reputation: document.querySelector("#reputation"),
  mood: document.querySelector("#mood"),
  layoutEffects: document.querySelector("#layoutEffects"),
  guestPanel: document.querySelector("#guestPanel"),
  guestBook: document.querySelector("#guestBook"),
  festivalPanel: document.querySelector("#festivalPanel"),
  staffPanel: document.querySelector("#staffPanel"),
  saveStatus: document.querySelector("#saveStatus"),
  openDayBtn: document.querySelector("#openDayBtn"),
  researchBtn: document.querySelector("#researchBtn"),
  hireRunnerBtn: document.querySelector("#hireRunnerBtn"),
  trainRunnerBtn: document.querySelector("#trainRunnerBtn"),
  resetGameBtn: document.querySelector("#resetGameBtn"),
  goalTables: document.querySelector("#goalTables"),
  goalStove: document.querySelector("#goalStove"),
  goalRep: document.querySelector("#goalRep"),
};

function createInitialState() {
  return {
    day: 1,
    coins: 120,
    reputation: 0,
    mood: 80,
    selectedTool: "floor",
    unlockedDishCount: 1,
    runners: 0,
    runnerLevel: 1,
    customers: [],
    guestBook: Object.fromEntries(guestTypes.map((guest) => [guest.name, { visits: 0, coins: 0 }])),
    tiles: Array.from({ length: GRID_WIDTH * GRID_HEIGHT }, (_, index) => ({
      type: index === 16 ? "entrance" : index === 17 || index === 18 || index === 25 ? "floor" : "empty",
      customerId: null,
    })),
  };
}

function hydrateState(savedState) {
  const initialState = createInitialState();
  Object.assign(state, {
    ...initialState,
    ...savedState,
    customers: [],
    guestBook: {
      ...initialState.guestBook,
      ...(savedState.guestBook || {}),
    },
    tiles: Array.isArray(savedState.tiles) && savedState.tiles.length === GRID_WIDTH * GRID_HEIGHT
      ? savedState.tiles.map((tile, index) => ({
          ...initialState.tiles[index],
          ...tile,
          customerId: null,
        }))
      : initialState.tiles,
  });
}

function countTiles(type) {
  return state.tiles.filter((tile) => tile.type === type).length;
}

function getTool(id) {
  return tools.find((tool) => tool.id === id);
}

function isToolUnlocked(tool) {
  return state.reputation >= tool.unlockRep;
}

function unlockedDishes() {
  return dishes.slice(0, state.unlockedDishCount);
}

function cuisineProgress() {
  const unlocked = unlockedDishes();
  return cuisines.map((cuisine) => {
    const unlockedCount = unlocked.filter((dish) => dish.cuisineId === cuisine.id).length;
    const totalCount = dishes.filter((dish) => dish.cuisineId === cuisine.id).length;
    return {
      ...cuisine,
      unlockedCount,
      totalCount,
      active: unlockedCount > 0,
    };
  });
}

function getCuisineBonus(dish, guest) {
  const cuisine = cuisines.find((item) => item.id === dish.cuisineId);
  if (!cuisine) {
    return {
      coins: 0,
      mood: 0,
      reputation: 0,
      note: "",
    };
  }

  const progress = cuisineProgress().find((item) => item.id === cuisine.id);
  const level = progress?.unlockedCount || 0;
  const festival = currentFestival();
  const wineGuestBonus = cuisine.id === "wine" && (guest.name === "行商" || guest.name === "瓦舍伶人") ? level : 0;
  const seasonalRepBonus = cuisine.id === "seasonal" && festival.name !== "寒食踏青" ? 1 : 0;

  return {
    coins: cuisine.effect.coins * level + wineGuestBonus,
    mood: cuisine.effect.mood * level,
    reputation: cuisine.effect.reputation * level + seasonalRepBonus,
    note: ` ${cuisine.name}菜线加成。`,
  };
}

function availableGuestTypes() {
  const festival = currentFestival();
  return guestTypes.filter(
    (guest) => state.reputation >= guest.unlockRep || (festival.name === "端午竞渡" && guest.name === "船客"),
  );
}

function currentFestivalIndex() {
  return Math.floor((state.day - 1) / 3) % festivals.length;
}

function currentFestival() {
  return festivals[currentFestivalIndex()];
}

function nextFestival() {
  return festivals[(currentFestivalIndex() + 1) % festivals.length];
}

function getSavePayload() {
  return {
    day: state.day,
    coins: state.coins,
    reputation: state.reputation,
    mood: state.mood,
    selectedTool: state.selectedTool,
    unlockedDishCount: state.unlockedDishCount,
    runners: state.runners,
    runnerLevel: state.runnerLevel,
    guestBook: state.guestBook,
    tiles: state.tiles.map((tile) => ({
      type: tile.type,
      customerId: null,
    })),
  };
}

function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(getSavePayload()));
  elements.saveStatus.textContent = `已自动保存：第 ${state.day} 日，铜钱 ${state.coins}。`;
}

function loadGame() {
  const rawSave = localStorage.getItem(SAVE_KEY) || localStorage.getItem(LEGACY_SAVE_KEY);
  if (!rawSave) {
    return;
  }

  try {
    hydrateState(JSON.parse(rawSave));
    saveGame();
    elements.saveStatus.textContent = `已读取存档：第 ${state.day} 日。`;
  } catch (error) {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(LEGACY_SAVE_KEY);
    elements.saveStatus.textContent = "旧存档读取失败，已重新开始。";
  }
}

function resetGame() {
  localStorage.removeItem(SAVE_KEY);
  localStorage.removeItem(LEGACY_SAVE_KEY);
  hydrateState(createInitialState());
  say("旧账本收起，宋肆小筑重新开张。");
  saveGame();
  render();
}

function neighborIndexes(index) {
  const row = Math.floor(index / GRID_WIDTH);
  const col = index % GRID_WIDTH;
  const candidates = [
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1],
  ];

  return candidates
    .filter(([nextRow, nextCol]) => nextRow >= 0 && nextRow < GRID_HEIGHT && nextCol >= 0 && nextCol < GRID_WIDTH)
    .map(([nextRow, nextCol]) => nextRow * GRID_WIDTH + nextCol);
}

function countNeighborType(index, type) {
  return neighborIndexes(index).filter((neighborIndex) => state.tiles[neighborIndex].type === type).length;
}

function countAdjacentPairs(type) {
  return state.tiles.reduce((total, tile, index) => {
    if (tile.type !== type) {
      return total;
    }

    const matchingLaterNeighbors = neighborIndexes(index).filter(
      (neighborIndex) => neighborIndex > index && state.tiles[neighborIndex].type === type,
    );
    return total + matchingLaterNeighbors.length;
  }, 0);
}

function hasAdjacentTypes(firstType, secondType) {
  return state.tiles.some((tile, index) => {
    if (tile.type !== firstType) {
      return false;
    }

    return neighborIndexes(index).some((neighborIndex) => state.tiles[neighborIndex].type === secondType);
  });
}

function getTableLayout(index) {
  const decorCount = countNeighborType(index, "decor");
  const stoveCount = countNeighborType(index, "stove");

  return {
    decorCount,
    stoveCount,
    moodBonus: decorCount * 5 - stoveCount * 6,
    priceBonus: decorCount * 2,
    reputationBonus: decorCount > 0 ? 1 : 0,
  };
}

function getLayoutSummary() {
  const tableIndexes = state.tiles
    .map((tile, index) => ({ tile, index }))
    .filter(({ tile }) => tile.type === "table")
    .map(({ index }) => index);
  const layouts = tableIndexes.map(getTableLayout);
  const windowSeats = layouts.filter((layout) => layout.decorCount > 0).length;
  const smokySeats = layouts.filter((layout) => layout.stoveCount > 0).length;
  const moodBonus = layouts.reduce((total, layout) => total + layout.moodBonus, 0);
  const priceBonus = layouts.reduce((total, layout) => total + layout.priceBonus, 0);
  const reputationBonus = layouts.reduce((total, layout) => total + layout.reputationBonus, 0);
  const compatibility = getCompatibilitySummary({
    tableCount: tableIndexes.length,
    windowSeats,
  });

  return {
    tableCount: tableIndexes.length,
    windowSeats,
    smokySeats,
    moodBonus,
    priceBonus,
    reputationBonus,
    compatibility,
  };
}

function getCompatibilitySummary(layout) {
  const active = compatibilities.filter((compatibility) => {
    if (compatibility.id === "stoveLine") {
      return countAdjacentPairs("stove") > 0;
    }

    if (compatibility.id === "windowScene") {
      return countTiles("decor") >= 2;
    }

    if (compatibility.id === "windowSeats") {
      return layout.windowSeats >= 2;
    }

    if (compatibility.id === "openHall") {
      return layout.tableCount >= 3;
    }

    if (compatibility.id === "frontCounter") {
      return countTiles("counter") > 0;
    }

    if (compatibility.id === "wineSales") {
      return hasAdjacentTypes("wineRack", "table");
    }

    if (compatibility.id === "backKitchen") {
      return hasAdjacentTypes("kitchen", "stove");
    }

    if (compatibility.id === "clearWater") {
      return hasAdjacentTypes("well", "stove") || hasAdjacentTypes("well", "kitchen");
    }

    if (compatibility.id === "quietRoom") {
      return countTiles("room") > 0 && countTiles("decor") > 0;
    }

    return false;
  });

  return active.reduce(
    (summary, compatibility) => ({
      active: [...summary.active, compatibility],
      capacityBonus: summary.capacityBonus + compatibility.effect.capacity,
      moodBonus: summary.moodBonus + compatibility.effect.mood,
      priceBonus: summary.priceBonus + compatibility.effect.price,
      reputationBonus: summary.reputationBonus + compatibility.effect.reputation,
      guestBonus: summary.guestBonus + compatibility.effect.guests,
    }),
    {
      active: [],
      capacityBonus: 0,
      moodBonus: 0,
      priceBonus: 0,
      reputationBonus: 0,
      guestBonus: 0,
    },
  );
}

function updateStats() {
  elements.day.textContent = state.day;
  elements.monthName.textContent = currentFestival().month;
  elements.coins.textContent = state.coins;
  elements.reputation.textContent = state.reputation;
  elements.mood.textContent = state.mood;

  const tableCount = countTiles("table");
  const stoveCount = countTiles("stove");
  elements.goalTables.classList.toggle("done", tableCount >= 2);
  elements.goalStove.classList.toggle("done", stoveCount >= 1);
  elements.goalRep.classList.toggle("done", state.reputation >= 15);
  renderLayoutEffects();
  renderStaff();
  renderFestivalPanel();
  renderGuestPanel();
  renderGuestBook();
}

function renderFestivalPanel() {
  const festival = currentFestival();
  const upcoming = nextFestival();
  const daysLeft = 3 - ((state.day - 1) % 3);

  elements.festivalPanel.innerHTML = `
    <article class="festival-card active">
      <span class="festival-month">${festival.month}</span>
      <div>
        <strong>${festival.name}</strong>
        <p>${festival.effect}</p>
        <small>还剩 ${daysLeft} 日</small>
      </div>
    </article>
    <article class="festival-card">
      <span class="festival-month">${upcoming.month}</span>
      <div>
        <strong>下个节令：${upcoming.name}</strong>
        <p>${upcoming.effect}</p>
      </div>
    </article>
  `;
}

function renderTools() {
  elements.buildTools.innerHTML = "";

  tools.forEach((tool) => {
    const unlocked = isToolUnlocked(tool);
    const button = document.createElement("button");
    button.className = `tool-button${unlocked ? "" : " locked"}`;
    button.type = "button";
    button.dataset.tool = tool.id;
    button.disabled = !unlocked;
    button.setAttribute("aria-pressed", String(unlocked && tool.id === state.selectedTool));
    button.innerHTML = `
      <span class="tool-icon">${tool.icon}</span>
      <span class="tool-copy">
        <strong>${tool.name}</strong>
        <small>${unlocked ? tool.tip : `名声 ${tool.unlockRep} 解锁`}</small>
      </span>
      <span class="price">${unlocked ? tool.cost : "锁"}</span>
    `;
    button.addEventListener("click", () => {
      if (!unlocked) {
        say(`${tool.name} 要等名声达到 ${tool.unlockRep} 才能请匠人营造。`);
        return;
      }

      state.selectedTool = tool.id;
      render();
    });
    elements.buildTools.appendChild(button);
  });
}

function renderMenu() {
  elements.menuList.innerHTML = "";

  unlockedDishes().forEach((dish) => {
    const item = document.createElement("div");
    item.className = "menu-item";
    item.innerHTML = `
      <div>
        <strong>${dish.name}</strong>
        <small>${dish.cuisine}</small>
      </div>
      <span>${dish.price} 钱</span>
    `;
    elements.menuList.appendChild(item);
  });

  const progressList = document.createElement("div");
  progressList.className = "cuisine-progress";
  progressList.innerHTML = cuisineProgress()
    .map(
      (cuisine) => `
        <article class="cuisine-card${cuisine.active ? "" : " locked"}">
          <strong>${cuisine.name}</strong>
          <span>${cuisine.unlockedCount}/${cuisine.totalCount}</span>
          <small>${cuisine.active ? cuisine.bonusText : "待研制"}</small>
        </article>
      `,
    )
    .join("");
  elements.menuList.appendChild(progressList);

  const nextCost = researchCost();
  const nextDish = dishes[state.unlockedDishCount];
  elements.researchBtn.textContent =
    state.unlockedDishCount >= dishes.length ? "菜谱已全" : `研制${nextDish.cuisine} ${nextCost} 钱`;
  elements.researchBtn.disabled = state.unlockedDishCount >= dishes.length || state.coins < nextCost;
}

function staffWage() {
  return state.runners * (10 + state.runnerLevel * 4);
}

function hireRunnerCost() {
  return 65 + state.runners * 35;
}

function runnerCapacity() {
  return state.runners * (1 + state.runnerLevel);
}

function trainRunnerCost() {
  return 80 + state.runnerLevel * 55;
}

function renderStaff() {
  const hireCost = hireRunnerCost();
  const trainCost = trainRunnerCost();
  const capacityBonus = runnerCapacity();
  const maxLevel = state.runnerLevel >= 4;
  elements.staffPanel.innerHTML = `
    <article class="staff-card">
      <span class="staff-icon">跑</span>
      <div>
        <strong>跑堂 ${state.runners} 人 · ${state.runnerLevel} 级</strong>
        <p>每日薪水 ${staffWage()} 钱，接待能力 +${capacityBonus}</p>
        <small>升级会提高效率，也会抬高薪水。</small>
      </div>
    </article>
  `;
  elements.hireRunnerBtn.textContent = `雇跑堂 ${hireCost} 钱`;
  elements.hireRunnerBtn.disabled = state.coins < hireCost;
  elements.trainRunnerBtn.textContent = maxLevel ? "跑堂满级" : `升跑堂 ${trainCost} 钱`;
  elements.trainRunnerBtn.disabled = state.runners === 0 || maxLevel || state.coins < trainCost;
}

function renderGuestPanel() {
  elements.guestPanel.innerHTML = "";

  guestTypes.forEach((guest) => {
    const unlocked = state.reputation >= guest.unlockRep;
    const card = document.createElement("article");
    card.className = `guest-card${unlocked ? "" : " locked"}`;
    card.innerHTML = `
      <span class="guest-face">${guest.face}</span>
      <div>
        <strong>${guest.name}</strong>
        <p>${unlocked ? guest.preference : `名声 ${guest.unlockRep} 解锁`}</p>
      </div>
    `;
    elements.guestPanel.appendChild(card);
  });
}

function renderGuestBook() {
  elements.guestBook.innerHTML = "";

  guestTypes.forEach((guest) => {
    const unlocked = state.reputation >= guest.unlockRep;
    const record = state.guestBook[guest.name];
    const card = document.createElement("article");
    card.className = `guest-record${unlocked ? "" : " locked"}`;
    card.innerHTML = `
      <span class="guest-face">${guest.face}</span>
      <div>
        <strong>${guest.name}</strong>
        <p>${unlocked ? `到访 ${record.visits} 次，贡献 ${record.coins} 钱` : `名声 ${guest.unlockRep} 后可记录`}</p>
      </div>
    `;
    elements.guestBook.appendChild(card);
  });
}

function hireRunner() {
  const cost = hireRunnerCost();
  if (state.coins < cost) {
    say(`铜钱不够，雇跑堂需要 ${cost} 钱。`);
    return;
  }

  state.coins -= cost;
  state.runners += 1;
  say("新跑堂上工了，客人催菜时有人照应。");
  saveGame();
  render();
}

function trainRunner() {
  const cost = trainRunnerCost();
  if (state.runners === 0) {
    say("先雇一个跑堂，再谈调教手脚。");
    return;
  }

  if (state.runnerLevel >= 4) {
    say("跑堂已经练到头了，再升就该自己开店了。");
    return;
  }

  if (state.coins < cost) {
    say(`铜钱不够，升跑堂需要 ${cost} 钱。`);
    return;
  }

  state.coins -= cost;
  state.runnerLevel += 1;
  say(`跑堂升到 ${state.runnerLevel} 级，端菜、收钱、安抚客人都更利索了。`);
  saveGame();
  render();
}

function renderLayoutEffects() {
  const summary = getLayoutSummary();
  const moodTotal = summary.moodBonus + summary.compatibility.moodBonus;
  const priceTotal = summary.priceBonus + summary.compatibility.priceBonus;
  const reputationTotal = summary.reputationBonus + summary.compatibility.reputationBonus;
  const moodLabel = moodTotal >= 0 ? `+${moodTotal}` : String(moodTotal);
  const priceLabel = priceTotal > 0 ? `+${priceTotal}` : "0";
  const reputationLabel = reputationTotal > 0 ? `+${reputationTotal}` : "0";
  const compatibilityRows = summary.compatibility.active.length
    ? summary.compatibility.active
        .map(
          (compatibility) => `
            <div class="compatibility-row">
              <dt>${compatibility.name}</dt>
              <dd>${compatibility.description}</dd>
            </div>
          `,
        )
        .join("")
    : `
      <div class="compatibility-row muted">
        <dt>相性</dt>
        <dd>暂无成套设施</dd>
      </div>
    `;

  elements.layoutEffects.innerHTML = `
    <div>
      <dt>临窗食案</dt>
      <dd>${summary.windowSeats}/${summary.tableCount}</dd>
    </div>
    <div>
      <dt>烟火扰客</dt>
      <dd>${summary.smokySeats}</dd>
    </div>
    <div>
      <dt>满意修正</dt>
      <dd>${moodLabel}</dd>
    </div>
    <div>
      <dt>客单加成</dt>
      <dd>${priceLabel} 钱</dd>
    </div>
    <div>
      <dt>名声加成</dt>
      <dd>${reputationLabel}</dd>
    </div>
    <div>
      <dt>出菜能力</dt>
      <dd>+${summary.compatibility.capacityBonus}</dd>
    </div>
    <div>
      <dt>额外客流</dt>
      <dd>+${summary.compatibility.guestBonus}</dd>
    </div>
    ${compatibilityRows}
  `;
}

function renderGrid() {
  elements.grid.innerHTML = "";

  state.tiles.forEach((tile, index) => {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = `tile ${tile.type}`;
    cell.dataset.index = String(index);
    cell.setAttribute("role", "gridcell");
    cell.setAttribute("aria-label", `第 ${index + 1} 格，${tileName(tile.type)}`);
    cell.innerHTML = `<span class="asset">${tileIcon(tile.type)}</span>${tile.customerId ? '<span class="bubble">客</span>' : ""}`;
    cell.addEventListener("click", () => buildAt(index));
    elements.grid.appendChild(cell);
  });
}

function renderCustomers() {
  elements.customerList.innerHTML = "";

  if (state.customers.length === 0) {
    const empty = document.createElement("p");
    empty.className = "advisor";
    empty.textContent = "还未开市。先把店面布置好，再迎客。";
    elements.customerList.appendChild(empty);
    return;
  }

  const template = document.querySelector("#customerTemplate");
  state.customers.forEach((customer) => {
    const node = template.content.cloneNode(true);
    node.querySelector(".avatar").textContent = customer.face;
    node.querySelector(".name").textContent = `${customer.name} 点了 ${customer.dish.name}，付 ${customer.paid} 钱`;
    node.querySelector(".status").textContent = customer.status;
    elements.customerList.appendChild(node);
  });
}

function tileName(type) {
  return {
    empty: "空地",
    floor: "木地",
    table: "食案",
    stove: "灶台",
    decor: "花窗",
    counter: "柜台",
    wineRack: "酒柜",
    kitchen: "后厨",
    well: "水井",
    room: "雅间",
    entrance: "门面",
  }[type];
}

function tileIcon(type) {
  return {
    empty: "",
    floor: "□",
    table: "桌",
    stove: "灶",
    decor: "景",
    counter: "柜",
    wineRack: "酒",
    kitchen: "厨",
    well: "井",
    room: "雅",
    entrance: "门",
  }[type];
}

function buildAt(index) {
  const tile = state.tiles[index];
  const tool = getTool(state.selectedTool);

  if (tile.type === "entrance") {
    say("门面不能改，客人要从这里进来。");
    return;
  }

  if (tile.customerId) {
    say("客人正在用膳，先别动这一格。");
    return;
  }

  if (tool.id === "remove") {
    tile.type = "empty";
    say("拆除完成，腾出了一块地。");
    saveGame();
    render();
    return;
  }

  if (!isToolUnlocked(tool)) {
    say(`${tool.name} 要等名声达到 ${tool.unlockRep} 才能请匠人营造。`);
    return;
  }

  if (state.coins < tool.cost) {
    say(`铜钱不够，${tool.name} 需要 ${tool.cost} 钱。`);
    return;
  }

  if (tool.id !== "floor" && tile.type === "empty") {
    say("先铺木地，再摆设施。");
    return;
  }

  if (tile.type === tool.id) {
    say("这里已经是这个设施了。");
    return;
  }

  state.coins -= tool.cost;
  tile.type = tool.id;
  say(`${tool.name} 已安置。`);
  saveGame();
  render();
}

function researchCost() {
  return 55 + state.unlockedDishCount * 35;
}

function researchDish() {
  const cost = researchCost();
  if (state.unlockedDishCount >= dishes.length || state.coins < cost) {
    return;
  }

  state.coins -= cost;
  state.unlockedDishCount += 1;
  const dish = dishes[state.unlockedDishCount - 1];
  say(`厨娘试成了${dish.cuisine}「${dish.name}」，这条菜线开始给经营带来额外加成。`);
  saveGame();
  render();
}

function openDay() {
  const tableIndexes = state.tiles
    .map((tile, index) => ({ tile, index }))
    .filter(({ tile }) => tile.type === "table" && !tile.customerId)
    .map(({ index }) => index);
  const stoveCount = countTiles("stove");

  if (tableIndexes.length === 0) {
    say("没有食案，客人来了也坐不下。");
    return;
  }

  const festival = currentFestival();
  const decorBonus = countTiles("decor") * 2;
  const layoutSummary = getLayoutSummary();
  const compatibility = layoutSummary.compatibility;
  const guestCount = Math.min(
    tableIndexes.length,
    2 + Math.floor(state.reputation / 10) + festival.guestBonus + compatibility.guestBonus,
  );
  const cookingCapacity = Math.max(1, stoveCount * 2 + runnerCapacity() + compatibility.capacityBonus);
  const wage = staffWage();
  const guests = availableGuestTypes();
  let earned = 0;
  let gainedRep = 0;
  let moodDelta = decorBonus + festival.moodBonus + compatibility.moodBonus;
  const newCustomers = [];

  for (let i = 0; i < guestCount; i += 1) {
    const dish = pick(unlockedDishes());
    const guest = pick(guests);
    const patient = i < cookingCapacity + guest.patienceBonus;
    const tableIndex = tableIndexes[i];
    const tableLayout = getTableLayout(tableIndex);
    const layoutNote = describeTableLayout(tableLayout);
    const preference = applyGuestPreference(guest, tableLayout);
    const cuisineBonus = getCuisineBonus(dish, guest);
    const dishValue =
      dish.price +
      tableLayout.priceBonus +
      guest.spendBonus +
      preference.coins +
      cuisineBonus.coins +
      festival.coinBonus +
      compatibility.priceBonus;
    const paid = patient ? dishValue : Math.floor(dishValue * 0.6);
    const customer = {
      id: createId(),
      name: guest.name,
      face: guest.face,
      dish,
      paid,
      status: patient
        ? `吃得舒展，${layoutNote}${preference.note}${cuisineBonus.note}`
        : `等得久了，跑堂也忙不过来，${layoutNote}${preference.note}${cuisineBonus.note}`,
    };

    state.tiles[tableIndex].customerId = customer.id;
    newCustomers.push(customer);
    state.guestBook[guest.name].visits += 1;
    state.guestBook[guest.name].coins += paid;
    earned += paid;
    gainedRep += patient
      ? dish.reputation + tableLayout.reputationBonus + preference.reputation + cuisineBonus.reputation
      : 0;
    moodDelta += (patient ? 3 : -9) + tableLayout.moodBonus + preference.mood + cuisineBonus.mood;
  }

  const rent = 12 + state.day * 2;
  state.coins += earned - rent - wage;
  state.reputation += gainedRep + Math.floor(decorBonus / 3) + festival.reputationBonus + compatibility.reputationBonus;
  state.mood = clamp(state.mood + moodDelta - 6, 0, 100);
  state.customers = newCustomers;
  state.day += 1;
  saveGame();

  setTimeout(() => {
    state.tiles.forEach((tile) => {
      tile.customerId = null;
    });
    render();
  }, 1800);

  const compatibilityText = compatibility.active.length
    ? `相性「${compatibility.active.map((item) => item.name).join("、")}」生效。`
    : "尚未形成设施相性。";
  const layoutMoodTotal = layoutSummary.moodBonus + compatibility.moodBonus;
  say(`节庆「${festival.name}」生效：${festival.effect}。${compatibilityText}今日收入 ${earned} 钱，扣除柴米租脚 ${rent} 钱、薪水 ${wage} 钱。布局带来满意 ${layoutMoodTotal >= 0 ? "+" : ""}${layoutMoodTotal}。`);
  render();
}

function describeTableLayout(layout) {
  if (layout.decorCount > 0 && layout.stoveCount > 0) {
    return "临窗有雅趣，可惜烟火略扰。";
  }

  if (layout.decorCount > 0) {
    return "临窗见景，多添了几分兴致。";
  }

  if (layout.stoveCount > 0) {
    return "灶烟贴席，心里有些不爽利。";
  }

  return "觉得座位寻常。";
}

function applyGuestPreference(guest, layout) {
  if (guest.name === "书生" && layout.decorCount > 0) {
    return {
      coins: 0,
      mood: 3,
      reputation: 1,
      note: "书生尤爱这处雅座。",
    };
  }

  if (guest.name === "茶博士" && state.reputation >= 12) {
    return {
      coins: 1,
      mood: 1,
      reputation: 1,
      note: "茶博士觉得店名传得不虚。",
    };
  }

  if (guest.name === "瓦舍伶人" && state.runners > 0) {
    return {
      coins: 3,
      mood: 2,
      reputation: 0,
      note: "伶人见跑堂利索，添赏了几文。",
    };
  }

  if (guest.name === "船客" && layout.stoveCount > 0) {
    return {
      coins: 0,
      mood: -4,
      reputation: 0,
      note: "船客嫌灶烟太近。",
    };
  }

  return {
    coins: 0,
    mood: 0,
    reputation: 0,
    note: "",
  };
}

function createId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function say(message) {
  elements.advisor.textContent = message;
}

function render() {
  renderTools();
  renderMenu();
  renderGrid();
  renderCustomers();
  updateStats();
}

elements.openDayBtn.addEventListener("click", openDay);
elements.researchBtn.addEventListener("click", researchDish);
elements.hireRunnerBtn.addEventListener("click", hireRunner);
elements.trainRunnerBtn.addEventListener("click", trainRunner);
elements.resetGameBtn.addEventListener("click", resetGame);

loadGame();
render();
