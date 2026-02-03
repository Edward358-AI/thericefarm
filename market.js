// Market System with Dynamic Pricing
// Prices fluctuate based on supply/demand, reset hourly

// Check and reset market prices if a new hour has passed
function checkMarketReset() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentDate = now.toDateString();

  // Reset if hour or date changed
  if (currentHour !== playerdata.market.lastResetHour ||
    currentDate !== playerdata.market.lastResetDate) {
    playerdata.market = {
      lastResetHour: currentHour,
      lastResetDate: currentDate,
      regularSold: 0,
      brownSold: 0,
      goldSold: 0,
      seedsBought: 0,
      btrSeedsBought: 0,
      waterBought: 0,
      brownTraded: 0,
      goldTraded: 0,
      fertilizerBought: 0,
    };
    dialog("Market prices have reset!");
  }
}

// Calculate current sell price multiplier for rice
function getSellPriceMultiplier(riceType) {
  // Expert rank: prices don't fluctuate
  if (playerdata.rank === "Expert") return 1;

  let multiplier = 1;
  switch (riceType) {
    case "regular":
      // Per 10k sold: -10% sell price
      multiplier -= Math.floor(playerdata.market.regularSold / 10000) * 0.10;
      break;
    case "brown":
      // Per 2.5k sold: -5% sell price
      multiplier -= Math.floor(playerdata.market.brownSold / 2500) * 0.05;
      break;
    case "gold":
      // Per 50 sold: -10% sell price
      multiplier -= Math.floor(playerdata.market.goldSold / 50) * 0.10;
      break;
  }
  return Math.max(0.1, multiplier); // Minimum 10% of base price
}

// Calculate current buy price multiplier
function getBuyPriceMultiplier(itemType) {
  // Expert rank: prices don't fluctuate
  if (playerdata.rank === "Expert") return 1;

  let multiplier = 1;
  switch (itemType) {
    case "seeds":
      // Per 5k bought: +15% price (fixed, no randomness)
      const seedIncreases = Math.floor(playerdata.market.seedsBought / 5000);
      multiplier += seedIncreases * 0.15;
      break;
    case "water":
      // Per 5k bought: +20% price (fixed, no randomness)
      const waterIncreases = Math.floor(playerdata.market.waterBought / 5000);
      multiplier += waterIncreases * 0.20;
      break;
    case "fertilizer":
      // Per 1k bought: +15% price (fixed, no randomness)
      const fertIncreases = Math.floor(playerdata.market.fertilizerBought / 1000);
      multiplier += fertIncreases * 0.15;
      break;
  }
  return Math.min(4, multiplier); // Cap at 400%
}

// Get current better seed chance (base 10%, -1% per 1k bought, min 0%)
function getBetterSeedChance() {
  const baseChance = 0.10;
  const reduction = Math.floor(playerdata.market.btrSeedsBought / 1000) * 0.01;

  // Average rank gives +5% bonus
  let bonus = 0;
  if (playerdata.rank === "Average" || playerdata.rank === "Advanced" ||
    playerdata.rank === "Pro" || playerdata.rank === "Expert" || playerdata.rank === "True") {
    bonus = 0.05;
  }

  return Math.max(0, baseChance - reduction + bonus);
}

// Get brown seed trade cost (base 20 better seeds, +3 per 100 traded)
function getBrownTradeCost() {
  const base = 20;
  const increases = Math.floor(playerdata.market.brownTraded / 100);
  const additionalCost = increases * 3;  // Fixed +3 per 100 traded
  return base + additionalCost;
}

// Get gold seed trade cost (base 2.5k brown seeds, +100 per 1 traded)
function getGoldTradeCost() {
  const base = 2500;
  return base + playerdata.market.goldTraded * 100;
}

// Sell all rice
sellRice.addEventListener("click", function sell() {
  checkMarketReset();

  const regularPrice = regular.sellPrice * getSellPriceMultiplier("regular");
  const brownPrice = brown.sellPrice * getSellPriceMultiplier("brown");
  const goldPrice = gold.sellPrice * getSellPriceMultiplier("gold");

  // Store amounts before clearing
  const regularAmount = playerdata.rice.rice;
  const brownAmount = playerdata.rice.brnRice;
  const goldAmount = playerdata.rice.goldRice;

  let total = regularAmount + brownAmount + goldAmount;

  if (total === 0) {
    dialog("No rice to sell!");
    return;
  }

  let sold = Math.floor(regularAmount * regularPrice) +
    Math.floor(brownAmount * brownPrice) +
    Math.floor(goldAmount * goldPrice);

  // Track market activity
  playerdata.market.regularSold += regularAmount;
  playerdata.market.brownSold += brownAmount;
  playerdata.market.goldSold += goldAmount;

  playerdata.yuan += sold;
  playerdata.stats.yuan += sold;
  playerdata.stats.sold += total;

  playerdata.rice.rice = 0;
  playerdata.rice.brnRice = 0;
  playerdata.rice.goldRice = 0;

  // Calculate XP based on rice sold:
  // Regular: 1 XP per 100 rice (min 1 if any sold)
  // Brown: 1 XP per 10 rice (more valuable)
  // Gold: 5 XP per gold rice (very valuable)
  let xpGained = 0;

  if (regularAmount > 0) {
    xpGained += Math.max(1, Math.floor(regularAmount / 100));
  }
  if (brownAmount > 0) {
    xpGained += Math.max(1, Math.floor(brownAmount / 10));
  }
  if (goldAmount > 0) {
    xpGained += goldAmount * 5;
  }

  // Cap XP gained per sale to prevent extreme gains (max 1000 base XP per sale)
  xpGained = Math.min(xpGained, 1000);

  // Apply XP (level 40+ and Pro rank bonuses apply inside gainXP)
  if (xpGained > 0) {
    // gainXP expects min/max, so we simulate with a small range
    const minXP = Math.max(1, Math.floor(xpGained * 0.9));
    const maxXP = Math.ceil(xpGained * 1.1);
    gainXP(minXP, maxXP);
  }

  dialog("All rice sold for " + sold.toLocaleString() + " 元!");
});

// Buy regular seeds (with chance for better seeds when unlocked)
shop[0].addEventListener("click", async function buySeeds() {
  checkMarketReset();

  if (playerdata.yuan > 0) {
    const priceMultiplier = getBuyPriceMultiplier("seeds");
    const pricePerTwo = round2(0.5 * priceMultiplier); // Base: 1 yuan = 2 seeds

    const howMuch = await gamePrompt(
      "🌾 Buy Seeds",
      `Current price: <b>${round2(pricePerTwo * 2)} 元</b> = 2 seeds`,
      "Enter amount...",
      "",
      `You have: ${playerdata.yuan.toLocaleString()} 元`
    );

    if (howMuch !== null && Number.isInteger(parseFloat(howMuch))) {
      const cost = round2(parseInt(howMuch) * pricePerTwo);
      if (cost > playerdata.yuan || parseInt(howMuch) < 1) {
        dialog("Not enough yuan or invalid amount!");
      } else {
        playerdata.yuan -= cost;
        playerdata.stats.spent += cost;
        playerdata.market.seedsBought += parseInt(howMuch);

        // Better seeds chance if unlocked
        if (playerdata.unlocked.btrSeeds) {
          let btrCount = 0;
          const btrChance = getBetterSeedChance();
          for (let i = 0; i < parseInt(howMuch); i++) {
            if (chance(btrChance)) {
              btrCount++;
            }
          }
          playerdata.market.btrSeedsBought += btrCount;

          const regularCount = parseInt(howMuch) - btrCount;
          playerdata.seed.seeds += regularCount;
          playerdata.stats.seed.seeds += regularCount;
          playerdata.seed.btrSeeds += btrCount;
          playerdata.stats.seed.btrSeeds += btrCount;

          dialog(`Bought ${regularCount} regular + ${btrCount} better seeds for ${cost} 元`);
        } else {
          playerdata.seed.seeds += parseInt(howMuch);
          playerdata.stats.seed.seeds += parseInt(howMuch);
          dialog(`Bought ${howMuch} seeds for ${cost} 元!`);
        }

        gainXP(1, 2);
        checkAchievements();
      }
    } else if (howMuch !== null) {
      dialog("Please enter a valid number!");
    }
  } else {
    dialog("No money left! Go farm some rice!");
  }
});

// Trade for brown seeds (20 better seeds = 1 brown seed, scales with market)
shop[1].addEventListener("click", async function tradeBrown() {
  checkMarketReset();

  if (playerdata.unlocked.brnSeed) {
    const tradeCost = getBrownTradeCost();

    if (playerdata.seed.btrSeeds >= tradeCost) {
      const howMuch = await gamePrompt(
        "🤎 Trade for Brown Seeds",
        `Current rate: <b>${tradeCost}</b> better seeds = 1 brown seed`,
        "Enter amount...",
        "",
        `You have: ${playerdata.seed.btrSeeds.toLocaleString()} better seeds`
      );

      if (howMuch !== null && Number.isInteger(parseFloat(howMuch))) {
        const totalCost = parseInt(howMuch) * tradeCost;
        if (totalCost > playerdata.seed.btrSeeds || parseInt(howMuch) < 1) {
          dialog("Not enough better seeds or invalid amount!");
        } else {
          playerdata.seed.btrSeeds -= totalCost;
          playerdata.seed.brnSeeds += parseInt(howMuch);
          playerdata.stats.seed.brnSeeds += parseInt(howMuch);
          playerdata.market.brownTraded += parseInt(howMuch);

          dialog(`Traded ${totalCost} better seeds for ${howMuch} brown seeds!`);
          gainXP(1, 2);
          checkAchievements();
        }
      } else if (howMuch !== null) {
        dialog("Please enter a valid number!");
      }
    } else {
      dialog(`Not enough better seeds! Need at least ${tradeCost}.`);
    }
  } else {
    dialog("Not unlocked yet! Obtain a brown seed first.");
  }
});

// Trade for gold seeds (10k brown seeds = 1 gold seed, scales with market)
shop[5] && shop[5].addEventListener("click", async function tradeGold() {
  checkMarketReset();

  if (playerdata.unlocked.goldSeed) {
    const tradeCost = getGoldTradeCost();

    if (playerdata.seed.brnSeeds >= tradeCost) {
      const howMuch = await gamePrompt(
        "💛 Trade for Gold Seeds",
        `Current rate: <b>${tradeCost.toLocaleString()}</b> brown seeds = 1 gold seed`,
        "Enter amount...",
        "",
        `You have: ${playerdata.seed.brnSeeds.toLocaleString()} brown seeds`
      );

      if (howMuch !== null && Number.isInteger(parseFloat(howMuch))) {
        const totalCost = parseInt(howMuch) * tradeCost;
        if (totalCost > playerdata.seed.brnSeeds || parseInt(howMuch) < 1) {
          dialog("Not enough brown seeds or invalid amount!");
        } else {
          playerdata.seed.brnSeeds -= totalCost;
          playerdata.seed.goldSeeds += parseInt(howMuch);
          playerdata.stats.seed.goldSeeds += parseInt(howMuch);
          playerdata.market.goldTraded += parseInt(howMuch);

          dialog(`Traded ${totalCost.toLocaleString()} brown seeds for ${howMuch} gold seeds!`);
          gainXP(3, 5);
          checkAchievements();
        }
      } else if (howMuch !== null) {
        dialog("Please enter a valid number!");
      }
    } else {
      dialog(`Not enough brown seeds! Need at least ${tradeCost.toLocaleString()}.`);
    }
  } else {
    dialog("Not unlocked yet! Obtain a gold seed first.");
  }
});

// Buy water
shop[2].addEventListener("click", async function buyWater() {
  checkMarketReset();

  if (playerdata.yuan > 0) {
    const priceMultiplier = getBuyPriceMultiplier("water");
    const pricePerTwo = round2(0.5 * priceMultiplier); // Base: 1 yuan = 2 water

    const howMuch = await gamePrompt(
      "💧 Buy Water",
      `Current price: <b>${round2(pricePerTwo * 2)} 元</b> = 2 liters`,
      "Enter amount...",
      "",
      `You have: ${playerdata.yuan.toLocaleString()} 元`
    );

    if (howMuch !== null && Number.isInteger(parseFloat(howMuch))) {
      const cost = round2(parseInt(howMuch) * pricePerTwo);
      if (cost > playerdata.yuan || parseInt(howMuch) < 1) {
        dialog("Not enough yuan or invalid amount!");
      } else {
        playerdata.yuan -= cost;
        playerdata.stats.spent += cost;
        playerdata.water += parseInt(howMuch);
        playerdata.stats.water += parseInt(howMuch);
        playerdata.market.waterBought += parseInt(howMuch);

        dialog(`Bought ${howMuch} liters of water for ${cost} 元!`);
        gainXP(1, 2);
        checkAchievements();
      }
    } else if (howMuch !== null) {
      dialog("Please enter a valid number!");
    }
  } else {
    dialog("No money left! Go farm some rice!");
  }
});

// Buy fertilizer
shop[3].addEventListener("click", async function buyFertilizer() {
  checkMarketReset();

  // Tier 1+ fertilizer research = 1 yuan per fertilizer instead of 1.5
  const basePrice = (playerdata.researchPurchases.betterFert >= 1) ? 1 : 1.5;

  if (playerdata.yuan >= basePrice) {
    const priceMultiplier = getBuyPriceMultiplier("fertilizer");
    const pricePerUnit = round2(basePrice * priceMultiplier);

    const howMuch = await gamePrompt(
      "🌿 Buy Fertilizer",
      `Current price: <b>${pricePerUnit} 元</b> each${playerdata.researchPurchases.betterFert >= 1 ? ' (Tier 1 discount!)' : ''}`,
      "Enter amount...",
      "",
      `You have: ${playerdata.yuan.toLocaleString()} 元`
    );

    if (howMuch !== null && Number.isInteger(parseFloat(howMuch))) {
      const cost = round2(parseInt(howMuch) * pricePerUnit);
      if (cost > playerdata.yuan || parseInt(howMuch) < 1) {
        dialog("Not enough yuan or invalid amount!");
      } else {
        playerdata.yuan -= cost;
        playerdata.stats.spent += cost;
        playerdata.fertile += parseInt(howMuch);
        playerdata.market.fertilizerBought += parseInt(howMuch);

        dialog(`Bought ${howMuch} fertilizer for ${cost} 元!`);
        gainXP(2, 3);
        checkAchievements();
      }
    } else if (howMuch !== null) {
      dialog("Please enter a valid number!");
    }
  } else {
    dialog(`Not enough money! Need at least ${basePrice} 元.`);
  }
});

// Buy land (unlocked at level 15)
shop[4].addEventListener("click", async function buyLand() {
  checkMarketReset();

  if (playerdata.unlocked.land) {
    const landPrice = 2500; // 2.5k yuan per spec

    if (playerdata.yuan >= landPrice) {
      if (playerdata.land < 12) { // Max 12 farmlands
        const yesland = await gameConfirm(
          "🏞️ Buy Land",
          `Purchase a plot of land for <b>${landPrice.toLocaleString()} 元</b>?<br><br>Current farmlands: ${playerdata.land}/12`,
          "Buy",
          "Cancel"
        );
        if (yesland) {
          playerdata.land += 1;
          playerdata.yuan -= landPrice;
          playerdata.stats.spent += landPrice;

          dialog(`Farmland purchased for ${landPrice.toLocaleString()} 元!`);
          gainXP(5, 7);
          updateTiles();
          checkAchievements();
        }
      } else {
        dialog("Maximum farmlands reached (12)!");
      }
    } else {
      dialog(`Not enough money! Need ${landPrice.toLocaleString()} 元.`);
    }
  } else {
    dialog("Not unlocked yet! Reach level 15.");
  }
});

// Buy true seeds (unlocked at level 100, 10 yuan each)
if (shop[6]) {
  shop[6].addEventListener("click", async function buyTrueSeeds() {
    if (playerdata.unlocked.trueSeed) {
      const pricePerSeed = 10;

      if (playerdata.yuan >= pricePerSeed) {
        const howMuch = await gamePrompt(
          "✨ Buy True Seeds",
          `Price: <b>${pricePerSeed} 元</b> each`,
          "Enter amount...",
          "",
          `You have: ${playerdata.yuan.toLocaleString()} 元`
        );

        if (howMuch !== null && Number.isInteger(parseFloat(howMuch))) {
          const cost = parseInt(howMuch) * pricePerSeed;
          if (cost > playerdata.yuan || parseInt(howMuch) < 1) {
            dialog("Not enough yuan or invalid amount!");
          } else {
            playerdata.yuan -= cost;
            playerdata.stats.spent += cost;
            playerdata.seed.trueSeeds += parseInt(howMuch);
            playerdata.stats.seed.trueSeeds += parseInt(howMuch);

            dialog(`Bought ${howMuch} true seeds for ${cost} 元!`);
            gainXP(5, 10);
            checkAchievements();
          }
        } else if (howMuch !== null) {
          dialog("Please enter a valid number!");
        }
      } else {
        dialog(`Not enough money! Need at least ${pricePerSeed} 元.`);
      }
    } else {
      dialog("Not unlocked yet! Reach level 100.");
    }
  });
}
