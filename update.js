// Game Update Loop - Handles display updates and unlock checks
"use strict";

function update() {
  localStorage.setItem("playerdata", JSON.stringify(playerdata));

  // Update resource displays
  research.innerHTML = `Research: ${playerdata.research.toLocaleString()}`;
  riceAmount.innerHTML = `Rice: ${playerdata.rice.rice.toLocaleString()}<br>Brown rice: ${playerdata.rice.brnRice.toLocaleString()}<br>Gold rice: ${playerdata.rice.goldRice.toLocaleString()}`;
  moneyAmount.innerHTML = "Money: " + round2(playerdata.yuan).toLocaleString() + " 元";
  fertilizer.innerHTML = "Fertilizer: " + playerdata.fertile.toLocaleString();
  waterAmount.innerHTML = "Water left: " + playerdata.water.toLocaleString() + " L";

  // Update seed selector display
  choosing.children[1].innerHTML = `Regular (${playerdata.seed.seeds.toLocaleString()})`;
  choosing.children[2].innerHTML = `Better (${playerdata.seed.btrSeeds.toLocaleString()})`;
  choosing.children[3].innerHTML = `Brown (${playerdata.seed.brnSeeds.toLocaleString()})`;
  choosing.children[4].innerHTML = `Gold (${playerdata.seed.goldSeeds.toLocaleString()})`;
  if (choosing.children[5]) {
    choosing.children[5].innerHTML = `True (${playerdata.seed.trueSeeds.toLocaleString()})`;
  }

  // Update rank display
  const rankDisplay = document.getElementById('rankDisplay');
  if (rankDisplay) {
    rankDisplay.innerHTML = playerdata.rank;
  }

  // Check if any seeds available
  if (playerdata.seed.seeds == 0 && playerdata.seed.btrSeeds == 0 &&
    playerdata.seed.brnSeeds == 0 && playerdata.seed.goldSeeds == 0 &&
    playerdata.seed.trueSeeds == 0) {
    seeds = false;
  } else {
    seeds = true;
  }

  // Fertilizer toggle state
  if (playerdata.fertile <= 0) {
    hasFertile = false;
    usefert.disabled = true;
    usefert.value = "false";
  } else {
    usefert.disabled = false;
  }

  // Sell button state
  if (playerdata.rice.rice == 0 && playerdata.rice.brnRice == 0 && playerdata.rice.goldRice == 0) {
    sellRice.disabled = true;
  } else {
    sellRice.disabled = false;
  }

  // Seed selector states
  choosing.children[1].disabled = playerdata.seed.seeds <= 0;

  // Better seeds - need to be unlocked
  if (playerdata.unlocked.btrSeeds && playerdata.seed.btrSeeds > 0) {
    choosing.children[2].disabled = false;
  } else {
    choosing.children[2].disabled = true;
    if (better.using) {
      better.using = false;
      choosing.value = "noselect";
    }
  }

  // Brown seeds - need to have obtained one
  if (playerdata.unlocked.brnSeed && playerdata.seed.brnSeeds > 0) {
    choosing.children[3].disabled = false;
  } else {
    choosing.children[3].disabled = true;
    if (brown.using) {
      brown.using = false;
      choosing.value = "noselect";
    }
  }

  // Gold seeds - need to have obtained one
  if (playerdata.unlocked.goldSeed && playerdata.seed.goldSeeds > 0) {
    choosing.children[4].disabled = false;
  } else {
    choosing.children[4].disabled = true;
    if (gold.using) {
      gold.using = false;
      choosing.value = "noselect";
    }
  }

  // True seeds - need level 100
  if (choosing.children[5]) {
    if (playerdata.unlocked.trueSeed && playerdata.seed.trueSeeds > 0) {
      choosing.children[5].disabled = false;
    } else {
      choosing.children[5].disabled = true;
      if (trueRice.using) {
        trueRice.using = false;
        choosing.value = "noselect";
      }
    }
  }

  // Update shop labels based on unlocks
  if (shop[1].innerHTML === "???????" && playerdata.unlocked.brnSeed) {
    shop[1].innerHTML = "Trade for brown seeds";
  }

  if (shop[4].innerHTML === "???????" && playerdata.unlocked.land) {
    shop[4].innerHTML = "Buy land";
  }

  // Update research labels  
  if (typeof updateScienceLabels === 'function') {
    updateScienceLabels();
  }

  // Update achievements/stats display
  updateAchievementsDisplay();
  updateStatsDisplay();

  // Update market price board
  if (typeof updatePriceBoard === 'function') {
    updatePriceBoard();
  }

  // Check for level 100 ending
  if (playerdata.level >= 100) {
    const showEndBtn = document.getElementById("showend");
    if (showEndBtn) showEndBtn.style.display = "block";
  }

  return;
}

// Update market price board display
function updatePriceBoard() {
  // Safety check - market.js may not be loaded yet
  if (typeof getSellPriceMultiplier !== 'function' || typeof getBuyPriceMultiplier !== 'function') {
    return;
  }

  // Base prices
  const basePrices = {
    regular: 1,
    brown: 9,
    gold: 1000,
    seeds: 1,
    water: 1,
    fertilizer: (playerdata.researchPurchases.betterFert >= 1) ? 1 : 1.5
  };

  // Get current multipliers
  const sellRegular = getSellPriceMultiplier("regular");
  const sellBrown = getSellPriceMultiplier("brown");
  const sellGold = getSellPriceMultiplier("gold");
  const buySeeds = getBuyPriceMultiplier("seeds");
  const buyWater = getBuyPriceMultiplier("water");
  const buyFert = getBuyPriceMultiplier("fertilizer");

  // Helper to format price and get CSS class
  function formatPrice(basePrice, multiplier, isSell) {
    const price = round2(basePrice * multiplier);
    const percent = Math.round(multiplier * 100);
    let cssClass = "";

    if (isSell) {
      // For selling: lower is bad
      if (percent < 50) cssClass = "bad";
      else if (percent < 100) cssClass = "moderate";
    } else {
      // For buying: higher is bad
      if (percent > 150) cssClass = "bad";
      else if (percent > 100) cssClass = "moderate";
    }

    return { text: `${price.toLocaleString()} 元 (${percent}%)`, cssClass };
  }

  // Update sell prices
  const priceRegular = document.querySelector("#priceRegular .price-value");
  const priceBrown = document.querySelector("#priceBrown .price-value");
  const priceGold = document.querySelector("#priceGold .price-value");

  if (priceRegular) {
    const { text, cssClass } = formatPrice(basePrices.regular, sellRegular, true);
    priceRegular.textContent = text;
    priceRegular.className = "price-value " + cssClass;
  }
  if (priceBrown) {
    const { text, cssClass } = formatPrice(basePrices.brown, sellBrown, true);
    priceBrown.textContent = text;
    priceBrown.className = "price-value " + cssClass;
  }
  if (priceGold) {
    const { text, cssClass } = formatPrice(basePrices.gold, sellGold, true);
    priceGold.textContent = text;
    priceGold.className = "price-value " + cssClass;
  }

  // Update buy prices
  const priceSeeds = document.querySelector("#priceSeeds .price-value");
  const priceWater = document.querySelector("#priceWater .price-value");
  const priceFert = document.querySelector("#priceFert .price-value");

  if (priceSeeds) {
    const { text, cssClass } = formatPrice(basePrices.seeds, buySeeds, false);
    priceSeeds.textContent = text;
    priceSeeds.className = "price-value " + cssClass;
  }
  if (priceWater) {
    const { text, cssClass } = formatPrice(basePrices.water, buyWater, false);
    priceWater.textContent = text;
    priceWater.className = "price-value " + cssClass;
  }
  if (priceFert) {
    const { text, cssClass } = formatPrice(basePrices.fertilizer, buyFert, false);
    priceFert.textContent = text;
    priceFert.className = "price-value " + cssClass;
  }

  // Update trade rates
  const priceBetterChance = document.querySelector("#priceBetterChance .price-value");
  const priceBrownTrade = document.querySelector("#priceBrownTrade .price-value");

  if (priceBetterChance && typeof getBetterSeedChance === 'function') {
    const chance = Math.round(getBetterSeedChance() * 100);
    priceBetterChance.textContent = chance + "%";
    // Color code: green if >= 10%, yellow if < 10%, red if 0%
    if (chance >= 10) {
      priceBetterChance.className = "price-value";
    } else if (chance > 0) {
      priceBetterChance.className = "price-value moderate";
    } else {
      priceBetterChance.className = "price-value bad";
    }
  }

  if (priceBrownTrade && typeof getBrownTradeCost === 'function') {
    const cost = getBrownTradeCost();
    priceBrownTrade.textContent = cost + " better seeds";
    // Color code: green if 20, yellow if > 20, red if > 30
    if (cost <= 20) {
      priceBrownTrade.className = "price-value";
    } else if (cost <= 30) {
      priceBrownTrade.className = "price-value moderate";
    } else {
      priceBrownTrade.className = "price-value bad";
    }
  }
}

function updateAchievementsDisplay() {
  const achievementsContainer = document.getElementById('achievementsContent');
  if (!achievementsContainer) return;

  // Helper to create achievement category
  function createCategory(name, icon, thresholds, achievements, currentValue, unit = '') {
    const completed = achievements.filter(a => a).length;
    const total = achievements.length;
    const progressPercent = (completed / total) * 100;

    let itemsHTML = '';
    for (let i = 0; i < thresholds.length; i++) {
      const isCompleted = achievements[i];
      const checkmark = isCompleted
        ? '<span class="achieve-check done">✓</span>'
        : '<span class="achieve-check">○</span>';
      const itemClass = isCompleted ? 'achieve-item done' : 'achieve-item';
      itemsHTML += `<div class="${itemClass}">${checkmark} ${thresholds[i].toLocaleString()}${unit}</div>`;
    }

    return `
      <details class="achieve-category" ${completed > 0 ? 'open' : ''}>
        <summary class="achieve-header">
          <span class="achieve-icon">${icon}</span>
          <span class="achieve-name">${name}</span>
          <span class="achieve-progress">${completed}/${total}</span>
        </summary>
        <div class="achieve-bar-container">
          <div class="achieve-bar" style="width: ${progressPercent}%"></div>
        </div>
        <div class="achieve-items">${itemsHTML}</div>
      </details>
    `;
  }

  // Unlocks section
  let unlocksHTML = `
    <div class="unlocks-section">
      <div class="unlock-item ${playerdata.unlocked.land ? 'done' : ''}">
        ${playerdata.unlocked.land ? '✓' : '🔒'} Land (Lvl 15)
      </div>
      <div class="unlock-item ${playerdata.unlocked.btrSeeds ? 'done' : ''}">
        ${playerdata.unlocked.btrSeeds ? '✓' : '🔒'} Better Seeds (Lvl 20)
      </div>
      <div class="unlock-item ${playerdata.unlocked.research ? 'done' : ''}">
        ${playerdata.unlocked.research ? '✓' : '🔒'} Research (Lvl 30)
      </div>
      <div class="unlock-item ${playerdata.switches.brnSwitch ? 'done' : playerdata.unlocked.brnSwitch ? 'available' : ''}">
        ${playerdata.switches.brnSwitch ? '✓' : playerdata.unlocked.brnSwitch ? '◇' : '🔒'} Brown Switch (Lvl ${playerdata.unlocked.brnLock})
      </div>
      <div class="unlock-item ${playerdata.switches.goldSwitch ? 'done' : playerdata.unlocked.goldSwitch ? 'available' : ''}">
        ${playerdata.switches.goldSwitch ? '✓' : playerdata.unlocked.goldSwitch ? '◇' : '🔒'} Gold Switch (Lvl ${playerdata.unlocked.goldLock})
      </div>
      <div class="unlock-item ${playerdata.unlocked.trueSeed ? 'done' : ''}">
        ${playerdata.unlocked.trueSeed ? '✓' : '🔒'} True Rice (Lvl 100)
      </div>
    </div>
  `;

  // Build achievement categories
  let achieveHTML = `
    <div class="achieve-header-main">
      <span class="rank-badge ${playerdata.rank.toLowerCase()}">${playerdata.rank}</span>
      <span class="level-display">Level ${playerdata.level}</span>
    </div>
    
    <div class="achieve-section-title">🔓 Unlocks</div>
    ${unlocksHTML}
    
    <div class="achieve-section-title">🏆 Achievements</div>
    <div class="achieve-grid">
  `;

  // Add all categories
  achieveHTML += createCategory('Rice', '🍚', [10000, 100000, 1000000, 1000000000],
    playerdata.achievements.rice, playerdata.stats.rice.rice);

  achieveHTML += createCategory('Better Seeds', '🌱', [500, 5000, 50000, 500000],
    playerdata.achievements.btrSeeds, playerdata.stats.seed.btrSeeds);

  achieveHTML += createCategory('Brown Seeds', '🤎', [100, 1000, 10000, 100000],
    playerdata.achievements.brnSeeds, playerdata.stats.seed.brnSeeds);

  achieveHTML += createCategory('Gold Seeds', '💛', [1, 10, 100, 1000],
    playerdata.achievements.goldSeeds, playerdata.stats.seed.goldSeeds);

  achieveHTML += createCategory('True Seeds', '✨', [1, 1000, 100000, 1000000],
    playerdata.achievements.trueSeeds, playerdata.stats.seed.trueSeeds);

  achieveHTML += createCategory('Spending', '💰', [10000, 100000, 1000000, 10000000],
    playerdata.achievements.spend, playerdata.stats.spent, ' 元');

  achieveHTML += createCategory('Farmlands', '🏞️', [2, 5, 8, 12],
    playerdata.achievements.land, playerdata.land);

  achieveHTML += '</div>';

  achievementsContainer.innerHTML = achieveHTML;
}

function updateStatsDisplay() {
  const statsContainer = document.getElementById('statsContent');
  if (!statsContainer) return;

  // Helper to create a stat item
  function statItem(icon, label, value, unit = '') {
    return `
      <div class="stat-item">
        <span class="stat-icon">${icon}</span>
        <span class="stat-label">${label}</span>
        <span class="stat-value">${value.toLocaleString()}${unit}</span>
      </div>
    `;
  }

  // Helper to create a stat category
  function statCategory(title, icon, items) {
    return `
      <div class="stat-category">
        <div class="stat-category-header">
          <span class="stat-category-icon">${icon}</span>
          <span class="stat-category-title">${title}</span>
        </div>
        <div class="stat-category-items">${items}</div>
      </div>
    `;
  }

  // Rice stats
  const riceStats =
    statItem('🍚', 'Rice', playerdata.stats.rice.rice) +
    statItem('🤎', 'Brown Rice', playerdata.stats.rice.brnRice) +
    statItem('💛', 'Gold Rice', playerdata.stats.rice.goldRice) +
    statItem('📦', 'Rice Sold', playerdata.stats.sold);

  // Seed stats  
  const seedStats =
    statItem('🌾', 'Regular', playerdata.stats.seed.seeds) +
    statItem('🌱', 'Better', playerdata.stats.seed.btrSeeds) +
    statItem('🤎', 'Brown', playerdata.stats.seed.brnSeeds) +
    statItem('💛', 'Gold', playerdata.stats.seed.goldSeeds) +
    statItem('✨', 'True', playerdata.stats.seed.trueSeeds);

  // Economy stats
  const economyStats =
    statItem('💧', 'Water', playerdata.stats.water) +
    statItem('💰', 'Yuan Earned', playerdata.stats.yuan, ' 元') +
    statItem('🛒', 'Yuan Spent', playerdata.stats.spent, ' 元') +
    statItem('🔬', 'Research', playerdata.stats.research) +
    statItem('🏞️', 'Farmlands', playerdata.land);

  // Research progress
  const researchItems = `
    <div class="research-grid">
      <div class="research-item">
        <span class="research-label">Brown Mutation</span>
        <span class="research-tier">Tier ${playerdata.researchPurchases.brownMutation}</span>
      </div>
      <div class="research-item">
        <span class="research-label">Brown Success</span>
        <span class="research-tier">Tier ${playerdata.researchPurchases.brownSuccess}</span>
      </div>
      <div class="research-item">
        <span class="research-label">Gold Mutation</span>
        <span class="research-tier">Tier ${playerdata.researchPurchases.goldMutation}</span>
      </div>
      <div class="research-item">
        <span class="research-label">Gold Success</span>
        <span class="research-tier">Tier ${playerdata.researchPurchases.goldSuccess}</span>
      </div>
      <div class="research-item full-width">
        <span class="research-label">Fertilizer</span>
        <div class="research-bar-container">
          <div class="research-bar" style="width: ${(playerdata.researchPurchases.betterFert / 3) * 100}%"></div>
        </div>
        <span class="research-tier">${playerdata.researchPurchases.betterFert}/3</span>
      </div>
    </div>
  `;

  statsContainer.innerHTML = `
    <div class="stats-container">
      ${statCategory('Rice Acquired', '🍚', riceStats)}
      ${statCategory('Seeds Acquired', '🌾', seedStats)}
      ${statCategory('Economy', '💰', economyStats)}
      <div class="stat-category">
        <div class="stat-category-header">
          <span class="stat-category-icon">🔬</span>
          <span class="stat-category-title">Research Progress</span>
        </div>
        ${researchItems}
      </div>
    </div>
  `;
}

// Update tiles based on land count
function updateTiles() {
  for (let i = 0; i < playerdata.land && i < tiles.children.length; i++) {
    tiles.children[i].style.display = 'inline-block';
  }
  for (let i = playerdata.land; i < tiles.children.length; i++) {
    tiles.children[i].style.display = 'none';
  }
}

// Initial update
update();
updateTiles();

// Use proxy to auto-update on changes
playerdata = observe(playerdata, (target, prop, changes) => {
  target[prop] = changes;
  update();
  return true;
});