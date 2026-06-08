const GRID_WIDTH = 8;
const GRID_HEIGHT = 6;

const tools = [
  {
    id: "floor",
    name: "铺木地",
    icon: "□",
    cost: 5,
    tip: "扩大可经营区域",
    className: "floor",
  },
  {
    id: "table",
    name: "食案",
    icon: "桌",
    cost: 28,
    tip: "客人坐下点菜",
    className: "table",
  },
  {
    id: "stove",
    name: "灶台",
    icon: "灶",
    cost: 45,
    tip: "提高出菜速度",
    className: "stove",
  },
  {
    id: "decor",
    name: "花窗",
    icon: "景",
    cost: 22,
    tip: "提升满意和名声",
    className: "decor",
  },
  {
    id: "remove",
    name: "拆除",
    icon: "×",
    cost: 0,
    tip: "清空一个格子",
    className: "empty",
  },
];

const dishes = [
  { name: "葱泼兔", price: 18, reputation: 2 },
  { name: "蟹酿橙", price: 28, reputation: 4 },
  { name: "拨霞供", price: 35, reputation: 5 },
  { name: "梅花汤饼", price: 42, reputation: 6 },
];

const customerNames = ["行商", "书生", "茶博士", "瓦舍伶人", "船娘", "画师"];
const customerFaces = ["商", "士", "茶", "伶", "舟", "画"];

const state = {
  day: 1,
  coins: 120,
  reputation: 0,
  mood: 80,
  selectedTool: "floor",
  unlockedDishCount: 1,
  customers: [],
  tiles: Array.from({ length: GRID_WIDTH * GRID_HEIGHT }, (_, index) => ({
    type: index === 16 ? "entrance" : index === 17 || index === 18 || index === 25 ? "floor" : "empty",
    customerId: null,
  })),
};

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
  openDayBtn: document.querySelector("#openDayBtn"),
  researchBtn: document.querySelector("#researchBtn"),
  goalTables: document.querySelector("#goalTables"),
  goalStove: document.querySelector("#goalStove"),
  goalRep: document.querySelector("#goalRep"),
};

function countTiles(type) {
  return state.tiles.filter((tile) => tile.type === type).length;
}

function getTool(id) {
  return tools.find((tool) => tool.id === id);
}

function unlockedDishes() {
  return dishes.slice(0, state.unlockedDishCount);
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

  return {
    tableCount: tableIndexes.length,
    windowSeats,
    smokySeats,
    moodBonus,
    priceBonus,
    reputationBonus,
  };
}

function updateStats() {
  elements.day.textContent = state.day;
  elements.coins.textContent = state.coins;
  elements.reputation.textContent = state.reputation;
  elements.mood.textContent = state.mood;

  const tableCount = countTiles("table");
  const stoveCount = countTiles("stove");
  elements.goalTables.classList.toggle("done", tableCount >= 2);
  elements.goalStove.classList.toggle("done", stoveCount >= 1);
  elements.goalRep.classList.toggle("done", state.reputation >= 15);
  renderLayoutEffects();
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
  elements.researchBtn.textContent =
    state.unlockedDishCount >= dishes.length ? "菜谱已全" : `研制新菜 ${nextCost} 钱`;
  elements.researchBtn.disabled = state.unlockedDishCount >= dishes.length || state.coins < nextCost;
}

function renderLayoutEffects() {
  const summary = getLayoutSummary();
  const moodLabel = summary.moodBonus >= 0 ? `+${summary.moodBonus}` : String(summary.moodBonus);
  const priceLabel = summary.priceBonus > 0 ? `+${summary.priceBonus}` : "0";
  const reputationLabel = summary.reputationBonus > 0 ? `+${summary.reputationBonus}` : "0";

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
    node.querySelector(".name").textContent = `${customer.name} 点了 ${customer.dish.name}`;
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
  say(`厨娘试成了「${dish.name}」，客人愿意多付些钱。`);
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

  const decorBonus = countTiles("decor") * 2;
  const guestCount = Math.min(tableIndexes.length, 2 + Math.floor(state.reputation / 10));
  const cookingCapacity = Math.max(1, stoveCount * 2);
  const layoutSummary = getLayoutSummary();
  let earned = 0;
  let gainedRep = 0;
  let moodDelta = decorBonus;
  const newCustomers = [];

  for (let i = 0; i < guestCount; i += 1) {
    const dish = pick(unlockedDishes());
    const patient = i < cookingCapacity;
    const tableIndex = tableIndexes[i];
    const tableLayout = getTableLayout(tableIndex);
    const layoutNote = describeTableLayout(tableLayout);
    const customer = {
      id: createId(),
      name: pick(customerNames),
      face: customerFaces[i % customerFaces.length],
      dish,
      status: patient ? `吃得舒展，${layoutNote}` : `等得久了，${layoutNote}`,
    };

    state.tiles[tableIndex].customerId = customer.id;
    newCustomers.push(customer);
    earned += patient ? dish.price + tableLayout.priceBonus : Math.floor((dish.price + tableLayout.priceBonus) * 0.6);
    gainedRep += patient ? dish.reputation + tableLayout.reputationBonus : 0;
    moodDelta += (patient ? 3 : -9) + tableLayout.moodBonus;
  }

  const rent = 12 + state.day * 2;
  state.coins += earned - rent;
  state.reputation += gainedRep + Math.floor(decorBonus / 3);
  state.mood = clamp(state.mood + moodDelta - 6, 0, 100);
  state.customers = newCustomers;
  state.day += 1;

  setTimeout(() => {
    state.tiles.forEach((tile) => {
      tile.customerId = null;
    });
    render();
  }, 1800);

  say(`今日收入 ${earned} 钱，扣除柴米租脚 ${rent} 钱。布局带来满意 ${layoutSummary.moodBonus >= 0 ? "+" : ""}${layoutSummary.moodBonus}。`);
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

render();
