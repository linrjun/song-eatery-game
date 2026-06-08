const GRID_WIDTH = 8;
const GRID_HEIGHT = 6;
const SAVE_KEY = "song-eatery-game-save-v1";

const tools = [
  { id: "floor", name: "铺木地", icon: "□", cost: 5, tip: "扩大可经营区域" },
  { id: "table", name: "食案", icon: "桌", cost: 28, tip: "客人坐下点菜" },
  { id: "stove", name: "灶台", icon: "灶", cost: 45, tip: "提高出菜速度" },
  { id: "decor", name: "花窗", icon: "景", cost: 22, tip: "提升满意和名声" },
  { id: "remove", name: "拆除", icon: "×", cost: 0, tip: "清空一个格子" },
];

const dishes = [
  { name: "葱泼兔", price: 18, reputation: 2 },
  { name: "蟹酿橙", price: 28, reputation: 4 },
  { name: "拨霞供", price: 35, reputation: 5 },
  { name: "梅花汤饼", price: 42, reputation: 6 },
];

const guestTypes = [
  { name: "行商", face: "商", unlockRep: 0, spendBonus: 3, patienceBonus: 0, preference: "爱点贵菜，客单更高" },
  { name: "书生", face: "士", unlockRep: 0, spendBonus: 0, patienceBonus: 1, preference: "爱临窗雅座，满意更稳" },
  { name: "茶博士", face: "茶", unlockRep: 8, spendBonus: 1, patienceBonus: 2, preference: "等得起，但看重名声" },
  { name: "瓦舍伶人", face: "伶", unlockRep: 16, spendBonus: 5, patienceBonus: -1, preference: "出手阔，但催菜急" },
  { name: "船客", face: "舟", unlockRep: 24, spendBonus: 2, patienceBonus: 0, preference: "讨厌烟火贴席" },
];

const state = createInitialState();

const elements = {
  grid: document.querySelector("#grid"),
  buildTools: document.querySelector("#buildTools"),
  menuList: document.querySelector("#menuList"),
  customerList: document.querySelector("#customerList"),
  advisor: document.querySelector("#advisor"),
  day: document.querySelector("#day"),
  coins: document.querySelector("#coins"),
  reputation: document.querySelector("#reputation"),
  mood: document.querySelector("#mood"),
  layoutEffects: document.querySelector("#layoutEffects"),
  guestPanel: document.querySelector("#guestPanel"),
  guestBook: document.querySelector("#guestBook"),
  staffPanel: document.querySelector("#staffPanel"),
  saveStatus: document.querySelector("#saveStatus"),
  openDayBtn: document.querySelector("#openDayBtn"),
  researchBtn: document.querySelector("#researchBtn"),
  hireRunnerBtn: document.querySelector("#hireRunnerBtn"),
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
      ? savedState.tiles.map((tile, index) => ({ ...initialState.tiles[index], ...tile, customerId: null }))
      : initialState.tiles,
  });
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
    guestBook: state.guestBook,
    tiles: state.tiles.map((tile) => ({ type: tile.type, customerId: null })),
  };
}

function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(getSavePayload()));
  elements.saveStatus.textContent = `已自动保存：第 ${state.day} 日，铜钱 ${state.coins}。`;
}

function loadGame() {
  const rawSave = localStorage.getItem(SAVE_KEY);
  if (!rawSave) return;
  try {
    hydrateState(JSON.parse(rawSave));
    elements.saveStatus.textContent = `已读取存档：第 ${state.day} 日。`;
  } catch (error) {
    localStorage.removeItem(SAVE_KEY);
    elements.saveStatus.textContent = "旧存档读取失败，已重新开始。";
  }
}

function resetGame() {
  localStorage.removeItem(SAVE_KEY);
  hydrateState(createInitialState());
  say("旧账本收起，宋肆小筑重新开张。");
  saveGame();
  render();
}

function countTiles(type) {
  return state.tiles.filter((tile) => tile.type === type).length;
}

function getTool(id) {
  return tools.find((tool) => tool.id === id);
}

function unlockedDishes() {
  return dishes.slice(0, state.unlockedDishCount);
}

function availableGuestTypes() {
  return guestTypes.filter((guest) => state.reputation >= guest.unlockRep);
}

function neighborIndexes(index) {
  const row = Math.floor(index / GRID_WIDTH);
  const col = index % GRID_WIDTH;
  return [
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1],
  ]
    .filter(([nextRow, nextCol]) => nextRow >= 0 && nextRow < GRID_HEIGHT && nextCol >= 0 && nextCol < GRID_WIDTH)
    .map(([nextRow, nextCol]) => nextRow * GRID_WIDTH + nextCol);
}

function countNeighborType(index, type) {
  return neighborIndexes(index).filter((neighborIndex) => state.tiles[neighborIndex].type === type).length;
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
  return {
    tableCount: tableIndexes.length,
    windowSeats: layouts.filter((layout) => layout.decorCount > 0).length,
    smokySeats: layouts.filter((layout) => layout.stoveCount > 0).length,
    moodBonus: layouts.reduce((total, layout) => total + layout.moodBonus, 0),
    priceBonus: layouts.reduce((total, layout) => total + layout.priceBonus, 0),
    reputationBonus: layouts.reduce((total, layout) => total + layout.reputationBonus, 0),
  };
}

function updateStats() {
  elements.day.textContent = state.day;
  elements.coins.textContent = state.coins;
  elements.reputation.textContent = state.reputation;
  elements.mood.textContent = state.mood;
  elements.goalTables.classList.toggle("done", countTiles("table") >= 2);
  elements.goalStove.classList.toggle("done", countTiles("stove") >= 1);
  elements.goalRep.classList.toggle("done", state.reputation >= 15);
  renderLayoutEffects();
  renderStaff();
  renderGuestPanel();
  renderGuestBook();
}

function renderTools() {
  elements.buildTools.innerHTML = "";
  tools.forEach((tool) => {
    const button = document.createElement("button");
    button.className = "tool-button";
    button.type = "button";
    button.dataset.tool = tool.id;
    button.setAttribute("aria-pressed", String(tool.id === state.selectedTool));
    button.innerHTML = `
      <span class="tool-icon">${tool.icon}</span>
      <span class="tool-copy">
        <strong>${tool.name}</strong>
        <small>${tool.tip}</small>
      </span>
      <span class="price">${tool.cost}</span>
    `;
    button.addEventListener("click", () => {
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
    item.innerHTML = `<strong>${dish.name}</strong><span>${dish.price} 钱</span>`;
    elements.menuList.appendChild(item);
  });
  const nextCost = researchCost();
  elements.researchBtn.textContent = state.unlockedDishCount >= dishes.length ? "菜谱已全" : `研制新菜 ${nextCost} 钱`;
  elements.researchBtn.disabled = state.unlockedDishCount >= dishes.length || state.coins < nextCost;
}

function staffWage() {
  return state.runners * 12;
}

function hireRunnerCost() {
  return 65 + state.runners * 35;
}

function renderStaff() {
  const hireCost = hireRunnerCost();
  elements.staffPanel.innerHTML = `
    <article class="staff-card">
      <span class="staff-icon">跑</span>
      <div>
        <strong>跑堂 ${state.runners} 人</strong>
        <p>每日薪水 ${staffWage()} 钱，接待能力 +${state.runners * 2}</p>
      </div>
    </article>
  `;
  elements.hireRunnerBtn.textContent = `雇跑堂 ${hireCost} 钱`;
  elements.hireRunnerBtn.disabled = state.coins < hireCost;
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

function renderLayoutEffects() {
  const summary = getLayoutSummary();
  const moodLabel = summary.moodBonus >= 0 ? `+${summary.moodBonus}` : String(summary.moodBonus);
  const priceLabel = summary.priceBonus > 0 ? `+${summary.priceBonus}` : "0";
  const reputationLabel = summary.reputationBonus > 0 ? `+${summary.reputationBonus}` : "0";
  elements.layoutEffects.innerHTML = `
    <div><dt>临窗食案</dt><dd>${summary.windowSeats}/${summary.tableCount}</dd></div>
    <div><dt>烟火扰客</dt><dd>${summary.smokySeats}</dd></div>
    <div><dt>满意修正</dt><dd>${moodLabel}</dd></div>
    <div><dt>客单加成</dt><dd>${priceLabel} 钱</dd></div>
    <div><dt>名声加成</dt><dd>${reputationLabel}</dd></div>
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
  return { empty: "空地", floor: "木地", table: "食案", stove: "灶台", decor: "花窗", entrance: "门面" }[type];
}

function tileIcon(type) {
  return { empty: "", floor: "□", table: "桌", stove: "灶", decor: "景", entrance: "门" }[type];
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
  if (state.unlockedDishCount >= dishes.length || state.coins < cost) return;
  state.coins -= cost;
  state.unlockedDishCount += 1;
  const dish = dishes[state.unlockedDishCount - 1];
  say(`厨娘试成了「${dish.name}」，客人愿意多付些钱。`);
  saveGame();
  render();
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

function openDay() {
  const tableIndexes = state.tiles
    .map((tile, index) => ({ tile, index }))
    .filter(({ tile }) => tile.type === "table" && !tile.customerId)
    .map(({ index }) => index);
  if (tableIndexes.length === 0) {
    say("没有食案，客人来了也坐不下。");
    return;
  }
  const decorBonus = countTiles("decor") * 2;
  const guestCount = Math.min(tableIndexes.length, 2 + Math.floor(state.reputation / 10));
  const cookingCapacity = Math.max(1, countTiles("stove") * 2 + state.runners * 2);
  const layoutSummary = getLayoutSummary();
  const wage = staffWage();
  const guests = availableGuestTypes();
  let earned = 0;
  let gainedRep = 0;
  let moodDelta = decorBonus;
  const newCustomers = [];

  for (let i = 0; i < guestCount; i += 1) {
    const dish = pick(unlockedDishes());
    const guest = pick(guests);
    const patient = i < cookingCapacity + guest.patienceBonus;
    const tableIndex = tableIndexes[i];
    const tableLayout = getTableLayout(tableIndex);
    const layoutNote = describeTableLayout(tableLayout);
    const preference = applyGuestPreference(guest, tableLayout);
    const dishValue = dish.price + tableLayout.priceBonus + guest.spendBonus + preference.coins;
    const paid = patient ? dishValue : Math.floor(dishValue * 0.6);
    const customer = {
      id: createId(),
      name: guest.name,
      face: guest.face,
      dish,
      paid,
      status: patient
        ? `吃得舒展，${layoutNote}${preference.note}`
        : `等得久了，跑堂也忙不过来，${layoutNote}${preference.note}`,
    };
    state.tiles[tableIndex].customerId = customer.id;
    newCustomers.push(customer);
    state.guestBook[guest.name].visits += 1;
    state.guestBook[guest.name].coins += paid;
    earned += paid;
    gainedRep += patient ? dish.reputation + tableLayout.reputationBonus + preference.reputation : 0;
    moodDelta += (patient ? 3 : -9) + tableLayout.moodBonus + preference.mood;
  }

  const rent = 12 + state.day * 2;
  state.coins += earned - rent - wage;
  state.reputation += gainedRep + Math.floor(decorBonus / 3);
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

  say(`今日收入 ${earned} 钱，扣除柴米租脚 ${rent} 钱、薪水 ${wage} 钱。布局带来满意 ${layoutSummary.moodBonus >= 0 ? "+" : ""}${layoutSummary.moodBonus}。`);
  render();
}

function describeTableLayout(layout) {
  if (layout.decorCount > 0 && layout.stoveCount > 0) return "临窗有雅趣，可惜烟火略扰。";
  if (layout.decorCount > 0) return "临窗见景，多添了几分兴致。";
  if (layout.stoveCount > 0) return "灶烟贴席，心里有些不爽利。";
  return "觉得座位寻常。";
}

function applyGuestPreference(guest, layout) {
  if (guest.name === "书生" && layout.decorCount > 0) return { coins: 0, mood: 3, reputation: 1, note: "书生尤爱这处雅座。" };
  if (guest.name === "茶博士" && state.reputation >= 12) return { coins: 1, mood: 1, reputation: 1, note: "茶博士觉得店名传得不虚。" };
  if (guest.name === "瓦舍伶人" && state.runners > 0) return { coins: 3, mood: 2, reputation: 0, note: "伶人见跑堂利索，添赏了几文。" };
  if (guest.name === "船客" && layout.stoveCount > 0) return { coins: 0, mood: -4, reputation: 0, note: "船客嫌灶烟太近。" };
  return { coins: 0, mood: 0, reputation: 0, note: "" };
}

function createId() {
  if (crypto.randomUUID) return crypto.randomUUID();
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
elements.resetGameBtn.addEventListener("click", resetGame);

loadGame();
render();
