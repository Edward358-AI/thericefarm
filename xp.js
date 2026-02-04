// XP and Leveling System
// XP formula: 100 * 1.2^(N-1) where N is the target level
// Credit to @Dodge1 for original XP bar solution

const XP_BASE = 100;
const XP_MULTIPLIER = 1.2;

// Farmer ranks with their level ranges
const RANKS = {
  Amateur: { min: 0, max: 9 },
  Beginner: { min: 10, max: 19 },
  Average: { min: 20, max: 29 },
  Advanced: { min: 30, max: 49 },
  Pro: { min: 50, max: 69 },
  Expert: { min: 70, max: 99 },
  True: { min: 100, max: Infinity }
};

// Calculate XP required for next level
// Formula: 100 * 1.2^(N-1) where N is the NEXT level
function calculateRequiredXP() {
  const nextLevel = playerdata.level + 1;
  return Math.ceil(XP_BASE * Math.pow(XP_MULTIPLIER, nextLevel - 1));
}

// Get rank based on level
function getRank(level) {
  for (let [rank, range] of Object.entries(RANKS)) {
    if (level >= range.min && level <= range.max) {
      return rank;
    }
  }
  return "Amateur";
}

// Apply rank-up rewards when transitioning to a new rank
function applyRankRewards(newRank) {
  switch (newRank) {
    case "Beginner":
      playerdata.yuan += 5000;
      playerdata.stats.yuan += 5000;
      playerdata.fertile += 1000;
      dialog("Rank Up! Beginner! +10k 元 and 1k fertilizer");
      break;
    case "Average":
      playerdata.yuan += 10000;
      playerdata.stats.yuan += 10000;
      playerdata.fertile += 2000;
      playerdata.seed.btrSeeds += 100;
      playerdata.stats.seed.btrSeeds += 100;
      dialog("Rank Up! Average! +10k 元, 2k fertilizer, 100 better seeds");
      break;
    case "Advanced":
      playerdata.yuan += 100000;
      playerdata.stats.yuan += 100000;
      playerdata.research += 1000;
      playerdata.stats.research += 1000;
      playerdata.seed.btrSeeds += 1000;
      playerdata.stats.seed.btrSeeds += 1000;
      dialog("Rank Up! Advanced! +100k 元, 1k research, 1k better seeds");
      break;
    case "Pro":
      playerdata.yuan += 500000;
      playerdata.stats.yuan += 500000;
      playerdata.research += 10000;
      playerdata.stats.research += 10000;
      playerdata.seed.brnSeeds += 10000;
      playerdata.stats.seed.brnSeeds += 10000;
      playerdata.unlocked.brnSeed = true;
      dialog("Rank Up! Pro! +500k 元, 10k research, 10k brown seeds. Double XP and research!");
      break;
    case "Expert":
      playerdata.yuan += 1000000;
      playerdata.stats.yuan += 1000000;
      playerdata.research += 50000;
      playerdata.stats.research += 50000;
      playerdata.seed.goldSeeds += 10;
      playerdata.stats.seed.goldSeeds += 10;
      playerdata.unlocked.goldSeed = true;
      dialog("Rank Up! Expert! +1m 元, 50k research, 10 gold seeds. Market prices stabilized!");
      break;
    case "True":
      playerdata.yuan += 10000000;
      playerdata.stats.yuan += 10000000;
      playerdata.research += 200000;
      playerdata.stats.research += 200000;
      playerdata.seed.goldSeeds += 50;
      playerdata.stats.seed.goldSeeds += 50;
      playerdata.seed.seeds += 1000000000;
      playerdata.stats.seed.seeds += 1000000000;
      playerdata.unlocked.trueSeed = true;
      dialog("RANK UP! TRUE RICE FARMER! +10m 元, 200k research, 50 gold seeds, 1b regular seeds!");
      break;
  }
}

// Gain XP with multipliers from level and rank
function gainXP(min, max) {
  let xpGained = Math.floor(Math.random() * (parseInt(max) - parseInt(min) + 1)) + parseInt(min);

  // Level 40+ gives permanent +25% XP bonus
  if (playerdata.level >= 40) {
    xpGained = Math.floor(xpGained * 1.25);
  }

  // Pro rank doubles XP (stacks with level 40 bonus)
  if (playerdata.rank === "Pro") {
    xpGained *= 2;
  }

  playerdata.xp += xpGained;

  while (playerdata.xp >= calculateRequiredXP()) {
    playerdata.xp -= calculateRequiredXP();
    levelUp();
  }

  updateXPBar();
}

// Handle level up
function levelUp() {
  playerdata.level += 1;

  const oldRank = playerdata.rank;
  const newRank = getRank(playerdata.level);

  // Check for rank change
  if (newRank !== oldRank) {
    playerdata.rank = newRank;
    applyRankRewards(newRank);
  }

  // Level up rewards
  let yuanReward;
  if (playerdata.unlocked.research) {
    // After research unlocked: 10x level, every 10 levels: 20x
    if (playerdata.level % 10 === 0) {
      yuanReward = 20 * playerdata.level;
    } else {
      yuanReward = 10 * playerdata.level;
    }
  } else {
    // Before research: 40x level, every 10 levels: 80x
    if (playerdata.level % 10 === 0) {
      yuanReward = 120 * playerdata.level;
    } else {
      yuanReward = 60 * playerdata.level;
    }
  }

  playerdata.yuan += yuanReward;
  playerdata.stats.yuan += yuanReward;

  // Show level up message (only if not a rank-up, to avoid double messages)
  if (getRank(playerdata.level) === getRank(playerdata.level - 1)) {
    dialog(`Level Up! Level ${playerdata.level}! +${yuanReward} 元`);
  }

  // Check for level-based unlocks
  checkLevelUnlocks();

  document.getElementById('xpLevel').innerText = `${playerdata.level}`;
}

// Check and apply level-based unlocks
function checkLevelUnlocks() {
  // Level 15: Unlock buy land
  if (playerdata.level >= 15 && !playerdata.unlocked.land) {
    playerdata.unlocked.land = true;
    dialog("Unlocked: Buy Land!");
  }

  // Level 20: Unlock better seeds
  if (playerdata.level >= 20 && !playerdata.unlocked.btrSeeds) {
    playerdata.unlocked.btrSeeds = true;
    dialog("Unlocked: Better Seeds in Market!");
  }

  // Level 30: Unlock research
  if (playerdata.level >= 30 && !playerdata.unlocked.research) {
    playerdata.unlocked.research = true;
    dialog("Unlocked: Research!");
  }

  // Level 30-40: Unlock brown mutation switch (at the predetermined random level)
  if (playerdata.level >= playerdata.unlocked.brnLock && !playerdata.unlocked.brnSwitch) {
    playerdata.unlocked.brnSwitch = true;
    dialog("Unlocked: Brown Rice Mutation Switch available for purchase!");
  }

  // Level 50-60: Unlock gold mutation switch (at the predetermined random level)
  if (playerdata.level >= playerdata.unlocked.goldLock && !playerdata.unlocked.goldSwitch) {
    playerdata.unlocked.goldSwitch = true;
    dialog("Unlocked: Gold Rice Mutation Switch available for purchase!");
  }

  // Level 100: Unlock true rice and mutation switch
  if (playerdata.level >= 100 && !playerdata.unlocked.trueSwitch) {
    playerdata.unlocked.trueSwitch = true;
    dialog("Unlocked: True Rice and True Mutation Switches!");
  }
}

// Update the XP bar display
function updateXPBar() {
  const filledXP = document.getElementById('filledXP');
  const xpPercentage = (playerdata.xp / calculateRequiredXP()) * 100;
  filledXP.style.width = `${xpPercentage}%`;
  document.getElementById('xpLevel').innerText = `${playerdata.level}`;

  // Update rank display if it exists
  const rankDisplay = document.getElementById('rankDisplay');
  if (rankDisplay) {
    rankDisplay.innerText = playerdata.rank;
  }
}

window.onload = function () {
  updateXPBar();
  checkLevelUnlocks(); // Check unlocks on load in case of save data
};

// Function to display XP info on hover
function showXPInfo() {
  const xpLevelEl = document.getElementById('xpLevel');
  const requiredXP = calculateRequiredXP();
  xpLevelEl.innerText = `Lvl ${playerdata.level} | ${playerdata.xp}/${requiredXP} XP | ${playerdata.rank}`;
}

// Function to restore XP level on mouseout
function hideXPInfo() {
  const xpLevelEl = document.getElementById('xpLevel');
  xpLevelEl.innerText = `${playerdata.level}`;
}

// Attach hover and mouseout events to the XP bar container
const xpBarContainer = document.getElementById('xpBarContainer');
xpBarContainer.addEventListener('mouseover', showXPInfo);
xpBarContainer.addEventListener('mouseout', hideXPInfo);
