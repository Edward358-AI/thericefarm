"use strict";

// Game initialization - name handling
if (localStorage.getItem("name")) {
  var farmerName = localStorage.getItem("name");
  formName.style.opacity = 0;
  startup.children[1].innerHTML = `Welcome back, ${playerdata.rank} Peasant ${farmerName}. Glad to see you here.<br>(Click to continue)`;
  document.documentElement.addEventListener("click", function clicktocontinue() {
    startup.style.display = "none";
    game.style.display = "inline";
    welcome.innerHTML = `Welcome back, ${playerdata.rank} Peasant ${farmerName}. ${greetings[Math.floor(Math.random() * greetings.length)]}`;
    document.documentElement.removeEventListener("click", clicktocontinue);
  });
} else {
  formName.onsubmit = () => {
    if (formName[0].value == null || formName[0].value == "") {
      var farmerName = farmerNames[Math.floor(Math.random() * farmerNames.length)];
      localStorage.setItem("name", farmerName);
      startup.style.display = "none";
      game.style.display = "inline";
      welcome.innerHTML = `Welcome, ${playerdata.rank} Peasant ${farmerName}. ${greetings[Math.floor(Math.random() * greetings.length)]}`;
    } else {
      var farmerName = formName[0].value;
      localStorage.setItem("name", farmerName);
      startup.style.display = "none";
      game.style.display = "block";
      welcome.innerHTML = `Welcome, ${playerdata.rank} Peasant ${farmerName}. ${greetings[Math.floor(Math.random() * greetings.length)]}`;
    }
    return false;
  };
}

// Update tiles display
updateTiles();

// Initialize default seed selection if player has regular seeds
if (playerdata.seed.seeds > 0) {
  regular.using = true;
  choosing.value = "regular";
}

// Seed selection handler
choosing.addEventListener("change", (e) => {
  // Reset all rice types
  for (let rice of rices) {
    rice.using = false;
  }

  // Set the selected rice type
  switch (e.target.value) {
    case "regular":
      regular.using = true;
      break;
    case "better":
      better.using = true;
      break;
    case "brown":
      brown.using = true;
      break;
    case "gold":
      gold.using = true;
      break;
    case "true":
      trueRice.using = true;
      break;
  }
});

// Tile click handler - main farming logic
tiles.addEventListener("click", (e) => {
  if (e.target.innerHTML === "Empty soil" && playerdata.water > 0) {
    // Find which rice type is being used
    let activeRice = null;
    for (let rice of rices) {
      if (rice.using) {
        activeRice = rice;
        break;
      }
    }

    if (!activeRice) {
      dialog("No seed type selected!");
      return;
    }

    // Check if we have seeds of this type
    let hasSeeds = false;
    switch (activeRice.type) {
      case "regular":
        hasSeeds = playerdata.seed.seeds > 0;
        break;
      case "better":
        hasSeeds = playerdata.seed.btrSeeds > 0;
        break;
      case "brown":
        hasSeeds = playerdata.seed.brnSeeds > 0;
        break;
      case "gold":
        hasSeeds = playerdata.seed.goldSeeds > 0;
        break;
      case "true":
        hasSeeds = playerdata.seed.trueSeeds > 0;
        break;
    }

    if (!hasSeeds) {
      dialog(`No ${activeRice.type} seeds left!`);
      return;
    }

    // Deduct seed
    switch (activeRice.type) {
      case "regular":
        playerdata.seed.seeds--;
        break;
      case "better":
        playerdata.seed.btrSeeds--;
        break;
      case "brown":
        playerdata.seed.brnSeeds--;
        break;
      case "gold":
        playerdata.seed.goldSeeds--;
        break;
      case "true":
        playerdata.seed.trueSeeds--;
        break;
    }

    // Deduct water
    playerdata.water--;

    // Check fertilizer usage
    let usedFert = false;
    if (hasFertile && usefert.value === "true") {
      usedFert = true;
      playerdata.fertile -= Math.round(Math.random() + 1);
    }

    // Calculate harvest time
    let harvestSeconds = activeRice.getGrowTime(usedFert);

    // Set tile to growing state
    e.target.style.backgroundColor = "#0040ff";
    e.target.innerHTML = `${activeRice.type.toUpperCase()} rice growing!<br>Ready in ${harvestSeconds}`;

    // Store rice type for harvest
    const plantedRice = activeRice;
    const usedFertilizer = usedFert;

    // Growing timer
    var harvesting = setInterval(() => {
      if (harvestSeconds > 1) {
        harvestSeconds--;
        e.target.innerHTML = `${plantedRice.type.toUpperCase()} rice growing!<br>Ready in ${harvestSeconds}`;
      } else {
        // Ready to harvest!
        e.target.style.animation = "flash 2s";
        e.target.innerHTML = `${plantedRice.type.toUpperCase()} rice ready!`;

        e.target.addEventListener("click", function harvestRice() {
          // Calculate yield
          let cropYield = plantedRice.calcYield();

          // Apply fertilizer multiplier
          if (usedFertilizer && cropYield > 0) {
            cropYield = Math.ceil(cropYield * plantedRice.getFertilizerYieldMultiplier());
          }

          // Check for mutations
          let mutated = false;

          // Better rice can mutate to brown (if switch purchased AND active)
          if (plantedRice.type === "better" && playerdata.switches.brnSwitch &&
            playerdata.switches.brnSwitchActive && chance(plantedRice.mutationChance)) {
            dialog("Mutation! +1 brown seed");
            playerdata.seed.brnSeeds++;
            playerdata.stats.seed.brnSeeds++;
            playerdata.unlocked.brnSeed = true;
            mutated = true;
            gainXP(7, 9);
          }

          // Brown rice can mutate to gold (if switch purchased AND active)
          if (plantedRice.type === "brown" && playerdata.switches.goldSwitch &&
            playerdata.switches.goldSwitchActive && chance(plantedRice.mutationChance)) {
            dialog("Mutation! +1 gold seed");
            playerdata.seed.goldSeeds++;
            playerdata.stats.seed.goldSeeds++;
            playerdata.unlocked.goldSeed = true;
            mutated = true;
            gainXP(10, 15);
          }

          // True rice can mutate to brown or gold (if respective switches purchased AND active)
          // Checks gold FIRST, then brown. Uses 2x base mutation rates.
          if (plantedRice.type === "true") {
            // Check gold mutation FIRST (2x base = 1%, with research scaling)
            if (playerdata.switches.trueGoldSwitch && playerdata.switches.trueGoldSwitchActive &&
              chance(0.01 * Math.pow(1.02, playerdata.researchPurchases.goldMutation))) {
              dialog("Mutation! +1 gold seed from true rice");
              playerdata.seed.goldSeeds++;
              playerdata.stats.seed.goldSeeds++;
              playerdata.unlocked.goldSeed = true;
              mutated = true;
              gainXP(15, 20);
            }
            // Then check brown mutation (2x base = 20%, with research scaling)
            else if (playerdata.switches.trueBrnSwitch && playerdata.switches.trueBrnSwitchActive &&
              chance(0.20 * Math.pow(1.025, playerdata.researchPurchases.brownMutation))) {
              dialog("Mutation! +1 brown seed from true rice");
              playerdata.seed.brnSeeds++;
              playerdata.stats.seed.brnSeeds++;
              mutated = true;
              gainXP(7, 9);
            }
          }

          // Add harvested rice (only if not a failure)
          if (cropYield > 0) {
            if (plantedRice.type === "brown") {
              playerdata.rice.brnRice += cropYield;
              playerdata.stats.rice.brnRice += cropYield;
              gainXP(5, 7);
            } else if (plantedRice.type === "gold") {
              playerdata.rice.goldRice += cropYield;
              playerdata.stats.rice.goldRice += cropYield;
              // Tier 2+ fert gives +25% XP on harvest
              if (usedFertilizer && playerdata.researchPurchases.betterFert >= 2) {
                gainXP(13, 19); // 10-15 * 1.25 rounded up
              } else {
                gainXP(10, 15);
              }
            } else {
              // Regular, better, and true rice all yield regular rice
              playerdata.rice.rice += cropYield;
              playerdata.stats.rice.rice += cropYield;

              if (plantedRice.type === "true") {
                // Tier 2+ fert gives +25% XP
                if (usedFertilizer && playerdata.researchPurchases.betterFert >= 2) {
                  gainXP(7, 10); // 5-8 * 1.25
                } else {
                  gainXP(5, 8);
                }
              } else if (plantedRice.type === "better") {
                if (usedFertilizer && playerdata.researchPurchases.betterFert >= 2) {
                  gainXP(5, 8); // 4-6 * 1.25
                } else {
                  gainXP(4, 6);
                }
              } else {
                if (usedFertilizer && playerdata.researchPurchases.betterFert >= 2) {
                  gainXP(4, 7); // 3-5 * 1.25
                } else {
                  gainXP(3, 5);
                }
              }
            }
          }

          // Research gain on harvest (1-2 per harvest when research unlocked)
          // Tier 3 fert gives +50% research (2-3 instead of 1-2)
          if (playerdata.unlocked.research && cropYield > 0) {
            let baseMin = 1, baseMax = 2;

            // Tier 3 fertilizer: 50% research boost (2-3 base)
            if (usedFertilizer && playerdata.researchPurchases.betterFert >= 3) {
              baseMin = 2;
              baseMax = 3;
            }

            let researchGain = Math.floor(Math.random() * (baseMax - baseMin + 1)) + baseMin;

            // Pro rank doubles research
            if (playerdata.rank === "Pro") {
              researchGain *= 2;
            }

            // True rice doubles research gain
            if (plantedRice.type === "true") {
              researchGain *= 2;
            }

            playerdata.research += researchGain;
            playerdata.stats.research += researchGain;
          }

          // Check achievements
          checkAchievements();

          // Reset tile
          e.target.removeEventListener("click", harvestRice);
          e.target.innerHTML = "Preparing soil for next crop! Please wait...";
          e.target.style.backgroundColor = "#1438a3";
          e.target.style.animation = "none";
          setTimeout(() => { e.target.innerHTML = "Empty soil"; }, 1000);
        });

        clearInterval(harvesting);
      }
    }, 1000);

  } else if (e.target.innerHTML === "Empty soil" && !seeds) {
    dialog("No seeds left.");
  } else if (e.target.innerHTML === "Empty soil" && playerdata.water <= 0) {
    dialog("No water left.");
  }
  return;
});
