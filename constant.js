// Constants and core game mechanics for The Rice Farm
"use strict";

var startup = document.getElementById("startup");
var stats = document.getElementById("stats");
var game = document.getElementById("game");
var tiles = document.getElementById("tiles");
var fertilizer = document.getElementById("fertilizer");
var moneyAmount = document.getElementById("money");
var changename = document.getElementById("namechange");
var choosing = document.getElementById("choosing");
var shop = document.querySelectorAll(".shop-buttons button");
var science = document.querySelectorAll(".science-item button, .science-item span");
var riceAmount = document.getElementById("riceamount");
var waterAmount = document.getElementById("water");
var sellRice = document.getElementById("sell");
var hasFertile = false;
var seeds = true;
var deleteData = document.getElementById("delete");
var usefert = document.getElementById("usefert");
var mansave = document.getElementById("manualsave");
var welcome = document.getElementById("welcomename");
var formName = document.getElementById("name");
var intro = document.getElementById("introduction");
var achieves = document.getElementsByClassName("achievestats")[0];
var research = document.getElementById("research");

var farmerNames = ["Liu 刘", "Jiang 蒋", "Wang 王", "Zhang 张", "Li 李", "Chen 陈", "Yang 杨", "Huang 黄", "Zhao 赵"];
var greetings = ["Hope your hands aren't too full today.", "Hope your farm is doing well right now.", "Hope you are busy at work so far."];

// Utility functions
function round2(num) {
  return Math.round(num * 100) / 100;
}

function elt(type, attrs, inner, children) {
  let node = document.createElement(type);
  if (typeof attrs === "object") {
    for (let key in attrs) {
      node.setAttribute(key, attrs[key]);
    }
  }
  if (typeof inner === "string") {
    node.innerHTML = inner;
  }
  if (Array.isArray(children)) {
    children.forEach(item => { if (typeof item === "object") node.appendChild(item); else node.appendChild(document.createElement(item)); });
  } else if (typeof children === "object") {
    for (let child in children) {
      let aChild = document.createElement(child);
      aChild.innerHTML = children[child];
      node.appendChild(aChild);
    }
  }
  return node;
}

Object.defineProperties(Array.prototype, {
  count: {
    value: function (value) {
      return this.filter(x => x === value).length;
    }
  }
});

// Chance utility
function chance(successChance) {
  return Math.random() < successChance;
}

function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// Rice class with all properties per spec
// type: rice type name
// seconds: base grow time
// yieldBonus: added to base crop yield
// mutationChance: base chance to mutate (before research bonuses)
// success: base success rate (before research bonuses)
// sellPrice: yuan per rice when selling
// canMutateTo: what this rice can mutate into (if any)
class Rice {
  constructor(type, seconds, yieldBonus, mutationChance, success, sellPrice, canMutateTo = null) {
    this.type = type;
    this.seconds = seconds;
    this.yieldBonus = yieldBonus;
    this.baseMutationChance = mutationChance;
    this.baseSuccess = success;
    this.sellPrice = sellPrice;
    this.canMutateTo = canMutateTo;
    this.using = false;
  }

  // Get current mutation chance with research bonuses
  get mutationChance() {
    let baseChance = this.baseMutationChance;

    if (this.type === "better" || this.type === "true") {
      // Brown mutation: *1.025 per research purchase
      baseChance *= Math.pow(1.025, playerdata.researchPurchases.brownMutation);
    }
    if (this.type === "brown" || this.type === "true") {
      // Gold mutation: *1.02 per research purchase  
      if (this.canMutateTo === "gold") {
        baseChance *= Math.pow(1.02, playerdata.researchPurchases.goldMutation);
      }
    }

    // True rice has double standard mutation rate
    if (this.type === "true") {
      baseChance *= 2;
    }

    return Math.min(baseChance, 1); // Cap at 100%
  }

  // Get current success rate with research bonuses
  // Base multipliers + milestone bonus every 5 tiers
  get successRate() {
    let baseRate = this.baseSuccess;

    if (this.type === "brown") {
      const n = playerdata.researchPurchases.brownSuccess;
      // Base: *1.005 per tier, Milestone: *1.01 every 5 tiers
      baseRate *= Math.pow(1.005, n);
      baseRate *= Math.pow(1.01, Math.floor(n / 5)); // Milestone bonus
    } else if (this.type === "gold") {
      const n = playerdata.researchPurchases.goldSuccess;
      // Base: *1.02 per tier, Milestone: *1.04 every 5 tiers
      baseRate *= Math.pow(1.02, n);
      baseRate *= Math.pow(1.04, Math.floor(n / 5)); // Milestone bonus
    }

    return Math.min(baseRate, 1); // Cap at 100%
  }

  // Calculate crop yield
  get cropYield() {
    return this.calcYield();
  }

  calcYield() {
    if (chance(this.successRate)) {
      let baseYield = playerdata.baseCrop + this.yieldBonus;

      // Advanced rank gives +1 crop yield
      if (playerdata.rank === "Advanced" || playerdata.rank === "Pro" ||
        playerdata.rank === "Expert" || playerdata.rank === "True") {
        baseYield += 1;
      }

      // Gold rice uses floor of half yield
      if (this.type === "gold") {
        baseYield = Math.floor(baseYield / 2);
      }

      // Better Regular research: yield multipliers for regular seeds
      // Tier 1: ×2, Tier 2: ×4, Tier 3: ×6 (replaces, not stacks)
      if (this.type === "regular") {
        const tier = playerdata.researchPurchases.betterRegular || 0;
        if (tier >= 3) {
          baseYield *= 6;
        } else if (tier === 2) {
          baseYield *= 4;
        } else if (tier === 1) {
          baseYield *= 2;
        }
      }

      // Better Better research: yield multipliers for better seeds
      // Tier 1: ×2, Tier 2: ×3, Tier 3: ×4 (replaces, not stacks)
      if (this.type === "better") {
        const tier = playerdata.researchPurchases.betterBetter || 0;
        if (tier >= 3) {
          baseYield *= 4;
        } else if (tier === 2) {
          baseYield *= 3;
        } else if (tier === 1) {
          baseYield *= 2;
        }
      }

      return Math.max(1, baseYield); // Minimum 1
    } else {
      dialog("Crop failure!");
      return 0;
    }
  }

  // Get grow time with fertilizer effects
  getGrowTime(usedFertilizer) {
    if (!usedFertilizer) return this.seconds;

    const fertLevel = playerdata.researchPurchases.betterFert;
    switch (fertLevel) {
      case 0: return this.seconds - 1; // Base fertilizer
      case 1: return Math.floor(this.seconds * 3 / 4); // Better fert tier 1
      case 2: return Math.floor(this.seconds * 1 / 2); // Better fert tier 2  
      case 3: return Math.floor(this.seconds * 1 / 4); // Better fert tier 3
      default: return Math.floor(this.seconds * 1 / 4);
    }
  }

  // Get yield multiplier from fertilizer
  getFertilizerYieldMultiplier() {
    const fertLevel = playerdata.researchPurchases.betterFert;
    switch (fertLevel) {
      case 0: return 1.5; // Base fertilizer
      case 1: return 2;   // Better fert tier 1
      case 2: return 3;   // Better fert tier 2
      case 3: return 4;   // Better fert tier 3
      default: return 4;
    }
  }
}

// Rice types per spec:
// Regular: 5s, +0 yield, no mutations, 1元, 100% success
// Better: 7s, +4 yield, brown mutations 10%, 1元, 100% success
// Brown: 9s, +2 yield, gold mutations 0.5%, 9元, 90% success
// Gold: 11s, ½ floor yield, no mutations, 1000元, 20% success
// True: 4s, +50 yield, brown/gold mutations at 2x rate, 1元, 100% success (yields regular rice)

var regular = new Rice("regular", 5, 0, 0, 1, 1, null);
var better = new Rice("better", 7, 4, 0.10, 1, 1, "brown");
var brown = new Rice("brown", 9, 2, 0.005, 0.9, 9, "gold");
var gold = new Rice("gold", 11, -1, 0, 0.2, 1000, null); // yieldBonus -1 because it uses floor(half)
var trueRice = new Rice("true", 4, 50, 0.10, 1, 1, "brown"); // Can mutate to brown, then gold

var rices = [regular, better, brown, gold, trueRice];

// Achievement thresholds
const ACHIEVEMENT_THRESHOLDS = {
  rice: [10000, 100000, 1000000, 1000000000],
  btrSeeds: [500, 5000, 50000, 500000],
  brnSeeds: [100, 1000, 10000, 100000],
  goldSeeds: [1, 10, 100, 1000],
  trueSeeds: [1, 1000, 100000, 1000000],
  spend: [10000, 100000, 1000000, 10000000],
  land: [2, 5, 8, 12],
};

const ACHIEVEMENT_XP = {
  rice: [500, 5000, 500000, 500000000],
  btrSeeds: [1000, 5000, 50000, 500000],
  brnSeeds: [1000, 10000, 100000, 1000000],
  goldSeeds: [1000, 100000, 1000000, 1000000000],
  trueSeeds: [1000, 100000, 1000000, 10000000],
  spend: [1000, 10000, 500000, 50000000],
  land: [200, 1000, 5000, 15000],
};

// Check and award achievements
function checkAchievements() {
  // Rice achievements
  for (let i = 0; i < 4; i++) {
    if (!playerdata.achievements.rice[i] && playerdata.stats.rice.rice >= ACHIEVEMENT_THRESHOLDS.rice[i]) {
      playerdata.achievements.rice[i] = true;
      gainXP(ACHIEVEMENT_XP.rice[i], ACHIEVEMENT_XP.rice[i]);
      dialog(`Achievement! ${ACHIEVEMENT_THRESHOLDS.rice[i].toLocaleString()} rice acquired! +${ACHIEVEMENT_XP.rice[i].toLocaleString()} XP`);
    }
  }

  // Better seeds achievements
  for (let i = 0; i < 4; i++) {
    if (!playerdata.achievements.btrSeeds[i] && playerdata.stats.seed.btrSeeds >= ACHIEVEMENT_THRESHOLDS.btrSeeds[i]) {
      playerdata.achievements.btrSeeds[i] = true;
      gainXP(ACHIEVEMENT_XP.btrSeeds[i], ACHIEVEMENT_XP.btrSeeds[i]);
      dialog(`Achievement! ${ACHIEVEMENT_THRESHOLDS.btrSeeds[i].toLocaleString()} better seeds acquired! +${ACHIEVEMENT_XP.btrSeeds[i].toLocaleString()} XP`);
    }
  }

  // Brown seeds achievements
  for (let i = 0; i < 4; i++) {
    if (!playerdata.achievements.brnSeeds[i] && playerdata.stats.seed.brnSeeds >= ACHIEVEMENT_THRESHOLDS.brnSeeds[i]) {
      playerdata.achievements.brnSeeds[i] = true;
      gainXP(ACHIEVEMENT_XP.brnSeeds[i], ACHIEVEMENT_XP.brnSeeds[i]);
      dialog(`Achievement! ${ACHIEVEMENT_THRESHOLDS.brnSeeds[i].toLocaleString()} brown seeds acquired! +${ACHIEVEMENT_XP.brnSeeds[i].toLocaleString()} XP`);
    }
  }

  // Gold seeds achievements
  for (let i = 0; i < 4; i++) {
    if (!playerdata.achievements.goldSeeds[i] && playerdata.stats.seed.goldSeeds >= ACHIEVEMENT_THRESHOLDS.goldSeeds[i]) {
      playerdata.achievements.goldSeeds[i] = true;
      gainXP(ACHIEVEMENT_XP.goldSeeds[i], ACHIEVEMENT_XP.goldSeeds[i]);
      dialog(`Achievement! ${ACHIEVEMENT_THRESHOLDS.goldSeeds[i].toLocaleString()} gold seeds acquired! +${ACHIEVEMENT_XP.goldSeeds[i].toLocaleString()} XP`);
    }
  }

  // True seeds achievements
  for (let i = 0; i < 4; i++) {
    if (!playerdata.achievements.trueSeeds[i] && playerdata.stats.seed.trueSeeds >= ACHIEVEMENT_THRESHOLDS.trueSeeds[i]) {
      playerdata.achievements.trueSeeds[i] = true;
      gainXP(ACHIEVEMENT_XP.trueSeeds[i], ACHIEVEMENT_XP.trueSeeds[i]);
      dialog(`Achievement! ${ACHIEVEMENT_THRESHOLDS.trueSeeds[i].toLocaleString()} true seeds acquired! +${ACHIEVEMENT_XP.trueSeeds[i].toLocaleString()} XP`);
    }
  }

  // Spending achievements
  for (let i = 0; i < 4; i++) {
    if (!playerdata.achievements.spend[i] && playerdata.stats.spent >= ACHIEVEMENT_THRESHOLDS.spend[i]) {
      playerdata.achievements.spend[i] = true;
      gainXP(ACHIEVEMENT_XP.spend[i], ACHIEVEMENT_XP.spend[i]);
      dialog(`Achievement! ${ACHIEVEMENT_THRESHOLDS.spend[i].toLocaleString()} 元 spent! +${ACHIEVEMENT_XP.spend[i].toLocaleString()} XP`);
    }
  }

  // Land achievements
  for (let i = 0; i < 4; i++) {
    if (!playerdata.achievements.land[i] && playerdata.land >= ACHIEVEMENT_THRESHOLDS.land[i]) {
      playerdata.achievements.land[i] = true;
      gainXP(ACHIEVEMENT_XP.land[i], ACHIEVEMENT_XP.land[i]);
      dialog(`Achievement! ${ACHIEVEMENT_THRESHOLDS.land[i]} farmlands acquired! +${ACHIEVEMENT_XP.land[i].toLocaleString()} XP`);
    }
  }
}
