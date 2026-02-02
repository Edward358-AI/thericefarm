// Research System with Infinite Scaling Tiers and One-Time Purchases

// Calculate cost with 1.15x scaling per purchase (reduced from 1.2)
function getScaledCost(baseCost, timesPurchased) {
  return Math.ceil(baseCost * Math.pow(1.15, timesPurchased));
}

// Research: Increase brown mutation chance (*1.025 per purchase)
// Cost: 1k*1.2^n research and 500*1.2^n better seeds
science[0].addEventListener("click", async function researchBrownMutation() {
  if (!playerdata.switches.brnSwitch) {
    dialog("Purchase the Brown Switch first!");
    return;
  }
  if (playerdata.unlocked.research) {
    const n = playerdata.researchPurchases.brownMutation;
    const researchCost = getScaledCost(1000, n);
    const seedCost = getScaledCost(500, n);

    if (playerdata.research >= researchCost && playerdata.seed.btrSeeds >= seedCost) {
      const currentBonus = Math.pow(1.025, n);
      const newBonus = Math.pow(1.025, n + 1);

      const buyIt = await gameConfirm(
        `🔬 Brown Mutation Research (Tier ${n + 1})`,
        `<b>Cost:</b> ${researchCost.toLocaleString()} research + ${seedCost.toLocaleString()} better seeds<br><br>` +
        `Current bonus: <b>${(currentBonus * 100).toFixed(1)}%</b><br>` +
        `New bonus: <b style="color: #88ff88;">${(newBonus * 100).toFixed(1)}%</b>`,
        "Research",
        "Cancel"
      );

      if (buyIt) {
        playerdata.research -= researchCost;
        playerdata.seed.btrSeeds -= seedCost;
        playerdata.researchPurchases.brownMutation++;
        const actualChance = 0.05 * newBonus; // Base 5% * multiplier
        dialog(`Brown mutation upgraded! Now ${(actualChance * 100).toFixed(2)}% chance (Base 5% × ${(newBonus).toFixed(2)}).`);
        updateScienceLabels();
      }
    } else {
      dialog(`Need ${researchCost.toLocaleString()} research and ${seedCost.toLocaleString()} better seeds.`);
    }
  } else {
    dialog("Research not unlocked yet! Reach level 30.");
  }
});

// Research: Increase brown rice success rate (*1.005 per purchase + *1.01 milestone every 5)
// Cost: 1k*1.15^n research and 100*1.15^n brown seeds
science[2].addEventListener("click", async function researchBrownSuccess() {
  if (!playerdata.switches.brnSwitch) {
    dialog("Purchase the Brown Switch first!");
    return;
  }
  if (playerdata.unlocked.research) {
    const n = playerdata.researchPurchases.brownSuccess;
    const researchCost = getScaledCost(1000, n);
    const seedCost = getScaledCost(100, n);

    if (playerdata.research >= researchCost && playerdata.seed.brnSeeds >= seedCost) {
      // Calculate with base + milestone bonus
      const currentRate = 0.9 * Math.pow(1.005, n) * Math.pow(1.01, Math.floor(n / 5));
      const newRate = 0.9 * Math.pow(1.005, n + 1) * Math.pow(1.01, Math.floor((n + 1) / 5));
      const isMilestone = (n + 1) % 5 === 0;

      const buyIt = await gameConfirm(
        `🔬 Brown Success Research (Tier ${n + 1})${isMilestone ? ' ⭐ MILESTONE!' : ''}`,
        `<b>Cost:</b> ${researchCost.toLocaleString()} research + ${seedCost.toLocaleString()} brown seeds<br><br>` +
        `Current rate: <b>${(currentRate * 100).toFixed(2)}%</b><br>` +
        `New rate: <b style="color: #88ff88;">${(newRate * 100).toFixed(2)}%</b>` +
        (isMilestone ? '<br><br><span style="color: gold;">🎉 Milestone bonus: Extra +1% multiplier!</span>' : ''),
        "Research",
        "Cancel"
      );

      if (buyIt) {
        playerdata.research -= researchCost;
        playerdata.seed.brnSeeds -= seedCost;
        playerdata.researchPurchases.brownSuccess++;
        dialog(`Brown success rate upgraded! Now ${(newRate * 100).toFixed(2)}%.${isMilestone ? ' Milestone bonus!' : ''}`);
        updateScienceLabels();
      }
    } else {
      dialog(`Need ${researchCost.toLocaleString()} research and ${seedCost.toLocaleString()} brown seeds.`);
    }
  } else {
    dialog("Research not unlocked yet! Reach level 30.");
  }
});

// Research: Increase gold mutation chance (*1.02 per purchase)
// Cost: 10k*1.2^n research and 1k*1.2^n brown seeds
science[4].addEventListener("click", async function researchGoldMutation() {
  if (!playerdata.switches.goldSwitch) {
    dialog("Purchase the Gold Switch first!");
    return;
  }
  if (playerdata.unlocked.research) {
    const n = playerdata.researchPurchases.goldMutation;
    const researchCost = getScaledCost(10000, n);
    const seedCost = getScaledCost(1000, n);

    if (playerdata.research >= researchCost && playerdata.seed.brnSeeds >= seedCost) {
      const currentBonus = Math.pow(1.02, n);
      const newBonus = Math.pow(1.02, n + 1);

      const buyIt = await gameConfirm(
        `🔬 Gold Mutation Research (Tier ${n + 1})`,
        `<b>Cost:</b> ${researchCost.toLocaleString()} research + ${seedCost.toLocaleString()} brown seeds<br><br>` +
        `Current bonus: <b>${(currentBonus * 100).toFixed(1)}%</b><br>` +
        `New bonus: <b style="color: gold;">${(newBonus * 100).toFixed(1)}%</b>`,
        "Research",
        "Cancel"
      );

      if (buyIt) {
        playerdata.research -= researchCost;
        playerdata.seed.brnSeeds -= seedCost;
        playerdata.researchPurchases.goldMutation++;
        const actualChance = 0.005 * newBonus; // Base 0.5% * multiplier
        dialog(`Gold mutation upgraded! Now ${(actualChance * 100).toFixed(3)}% chance (Base 0.5% × ${(newBonus).toFixed(2)}).`);
        updateScienceLabels();
      }
    } else {
      dialog(`Need ${researchCost.toLocaleString()} research and ${seedCost.toLocaleString()} brown seeds.`);
    }
  } else {
    dialog("Research not unlocked yet! Reach level 30.");
  }
});

// Research: Increase gold rice success rate (*1.02 per purchase + *1.04 milestone every 5)
// Cost: 10k*1.15^n research and (1+n) gold seeds
science[6].addEventListener("click", async function researchGoldSuccess() {
  if (!playerdata.switches.goldSwitch) {
    dialog("Purchase the Gold Switch first!");
    return;
  }
  if (playerdata.unlocked.research) {
    const n = playerdata.researchPurchases.goldSuccess;
    const researchCost = getScaledCost(10000, n);
    const seedCost = 1 + n; // 1+n gold seeds

    if (playerdata.research >= researchCost && playerdata.seed.goldSeeds >= seedCost) {
      // Calculate with base + milestone bonus
      const currentRate = 0.2 * Math.pow(1.02, n) * Math.pow(1.04, Math.floor(n / 5));
      const newRate = 0.2 * Math.pow(1.02, n + 1) * Math.pow(1.04, Math.floor((n + 1) / 5));
      const isMilestone = (n + 1) % 5 === 0;

      const buyIt = await gameConfirm(
        `🔬 Gold Success Research (Tier ${n + 1})${isMilestone ? ' ⭐ MILESTONE!' : ''}`,
        `<b>Cost:</b> ${researchCost.toLocaleString()} research + ${seedCost} gold seeds<br><br>` +
        `Current rate: <b>${(currentRate * 100).toFixed(2)}%</b><br>` +
        `New rate: <b style="color: gold;">${(newRate * 100).toFixed(2)}%</b>` +
        (isMilestone ? '<br><br><span style="color: gold;">🎉 Milestone bonus: Extra +4% multiplier!</span>' : ''),
        "Research",
        "Cancel"
      );

      if (buyIt) {
        playerdata.research -= researchCost;
        playerdata.seed.goldSeeds -= seedCost;
        playerdata.researchPurchases.goldSuccess++;
        dialog(`Gold success rate upgraded! Now ${(newRate * 100).toFixed(2)}%.${isMilestone ? ' Milestone bonus!' : ''}`);
        updateScienceLabels();
      }
    } else {
      dialog(`Need ${researchCost.toLocaleString()} research and ${seedCost} gold seeds.`);
    }
  } else {
    dialog("Research not unlocked yet! Reach level 30.");
  }
});

// Research: Better Fertilizer (3 tiers)
// Tier 1: 2x yield, 7/8s time - 20k research + 20k fertilizer
// Tier 2: 3x yield, 3/4s time - 100k research + 100k fertilizer
// Tier 3: 4x yield, 1/2s time - 500k research + 500k fertilizer
science[8].addEventListener("click", async function researchFertilizer() {
  if (playerdata.unlocked.research) {
    const currentTier = playerdata.researchPurchases.betterFert;

    if (currentTier >= 3) {
      dialog("Maximum fertilizer research achieved!");
      return;
    }

    const costs = [
      { research: 20000, fertilizer: 20000, yield: "2×", time: "7/8" },
      { research: 100000, fertilizer: 100000, yield: "3×", time: "3/4" },
      { research: 500000, fertilizer: 500000, yield: "4×", time: "1/2" }
    ];

    const next = costs[currentTier];

    if (playerdata.research >= next.research && playerdata.fertile >= next.fertilizer) {
      const buyIt = await gameConfirm(
        `🌿 Better Fertilizer (Tier ${currentTier + 1})`,
        `<b>Cost:</b> ${next.research.toLocaleString()} research + ${next.fertilizer.toLocaleString()} fertilizer<br><br>` +
        `<b>Effect:</b> ${next.yield} yield, ${next.time} harvest time`,
        "Research",
        "Cancel"
      );

      if (buyIt) {
        playerdata.research -= next.research;
        playerdata.fertile -= next.fertilizer;
        playerdata.researchPurchases.betterFert++;
        dialog(`Fertilizer upgraded to Tier ${currentTier + 1}! ${next.yield} yield, ${next.time} time.`);
        updateScienceLabels();
      }
    } else {
      dialog(`Need ${next.research.toLocaleString()} research and ${next.fertilizer.toLocaleString()} fertilizer.`);
    }
  } else {
    dialog("Research not unlocked yet! Reach level 30.");
  }
});

// One-Time Purchase: Better → Brown Mutation Switch
// Cost: 25k research + 10k better seeds
science[10].addEventListener("click", async function buyBrownSwitch() {
  if (playerdata.unlocked.research && playerdata.unlocked.brnSwitch) {
    if (playerdata.switches.brnSwitch === undefined || playerdata.switches.brnSwitch === false) {
      const researchCost = 25000;
      const seedCost = 10000;

      if (playerdata.research >= researchCost && playerdata.seed.btrSeeds >= seedCost) {
        const buyIt = await gameConfirm(
          "🔀 Brown Mutation Switch",
          `<b>Cost:</b> ${researchCost.toLocaleString()} research + ${seedCost.toLocaleString()} better seeds<br><br>` +
          `This allows <b>better seeds</b> to mutate into <b style="color: #a0522d;">brown seeds</b>!<br><br>` +
          `<i>Remember to turn it on in Settings!</i>`,
          "Purchase",
          "Cancel"
        );

        if (buyIt) {
          playerdata.research -= researchCost;
          playerdata.seed.btrSeeds -= seedCost;
          playerdata.switches.brnSwitch = true;
          dialog("Brown mutation switch purchased! Turn it on in Settings.");
          updateSwitchToggles();
          updateScienceLabels();
        }
      } else {
        dialog(`Need ${researchCost.toLocaleString()} research and ${seedCost.toLocaleString()} better seeds.`);
      }
    } else {
      dialog("Already purchased!");
    }
  } else if (!playerdata.unlocked.research) {
    dialog("Research not unlocked yet! Reach level 30.");
  } else {
    dialog("Brown mutation switch not unlocked yet! Reach level 30-40.");
  }
});

// One-Time Purchase: Brown → Gold Mutation Switch
// Cost: 50k research + 5k brown seeds
science[12] && science[12].addEventListener("click", async function buyGoldSwitch() {
  if (playerdata.unlocked.research && playerdata.unlocked.goldSwitch) {
    if (playerdata.switches.goldSwitch === undefined || playerdata.switches.goldSwitch === false) {
      const researchCost = 50000;
      const seedCost = 5000;

      if (playerdata.research >= researchCost && playerdata.seed.brnSeeds >= seedCost) {
        const buyIt = await gameConfirm(
          "🔀 Gold Mutation Switch",
          `<b>Cost:</b> ${researchCost.toLocaleString()} research + ${seedCost.toLocaleString()} brown seeds<br><br>` +
          `This allows <b style="color: #a0522d;">brown seeds</b> to mutate into <b style="color: gold;">gold seeds</b>!<br><br>` +
          `<i>Remember to turn it on in Settings!</i>`,
          "Purchase",
          "Cancel"
        );

        if (buyIt) {
          playerdata.research -= researchCost;
          playerdata.seed.brnSeeds -= seedCost;
          playerdata.switches.goldSwitch = true;
          dialog("Gold mutation switch purchased! Turn it on in Settings.");
          updateSwitchToggles();
          updateScienceLabels();
        }
      } else {
        dialog(`Need ${researchCost.toLocaleString()} research and ${seedCost.toLocaleString()} brown seeds.`);
      }
    } else {
      dialog("Already purchased!");
    }
  } else if (!playerdata.unlocked.research) {
    dialog("Research not unlocked yet! Reach level 30.");
  } else {
    dialog("Gold mutation switch not unlocked yet! Reach level 50-60.");
  }
});

// One-Time Purchase: True → Brown Mutation Switch
// Cost: 100k research + 10k brown seeds
science[14] && science[14].addEventListener("click", async function buyTrueBrownSwitch() {
  if (playerdata.unlocked.research && playerdata.unlocked.trueSeed) {
    if (playerdata.switches.trueBrnSwitch === undefined || playerdata.switches.trueBrnSwitch === false) {
      const researchCost = 100000;
      const seedCost = 10000;

      if (playerdata.research >= researchCost && playerdata.seed.brnSeeds >= seedCost) {
        const buyIt = await gameConfirm(
          "🔀 True → Brown Switch",
          `<b>Cost:</b> ${researchCost.toLocaleString()} research + ${seedCost.toLocaleString()} brown seeds<br><br>` +
          `This allows <b style="color: cyan;">true seeds</b> to mutate into <b style="color: #a0522d;">brown seeds</b>!<br><br>` +
          `<i>Remember to turn it on in Settings!</i>`,
          "Purchase",
          "Cancel"
        );

        if (buyIt) {
          playerdata.research -= researchCost;
          playerdata.seed.brnSeeds -= seedCost;
          playerdata.switches.trueBrnSwitch = true;
          dialog("True → Brown switch purchased! Turn it on in Settings.");
          updateSwitchToggles();
          updateScienceLabels();
        }
      } else {
        dialog(`Need ${researchCost.toLocaleString()} research and ${seedCost.toLocaleString()} brown seeds.`);
      }
    } else {
      dialog("Already purchased!");
    }
  } else if (!playerdata.unlocked.research) {
    dialog("Research not unlocked yet! Reach level 30.");
  } else {
    dialog("True rice not unlocked yet! Reach level 100.");
  }
});

// One-Time Purchase: True → Gold Mutation Switch
// Cost: 500k research + 10k brown seeds + 100 gold seeds
science[16] && science[16].addEventListener("click", async function buyTrueGoldSwitch() {
  if (playerdata.unlocked.research && playerdata.unlocked.trueSeed) {
    if (playerdata.switches.trueGoldSwitch === undefined || playerdata.switches.trueGoldSwitch === false) {
      const researchCost = 500000;
      const brownCost = 10000;
      const goldCost = 100;

      if (playerdata.research >= researchCost && playerdata.seed.brnSeeds >= brownCost && playerdata.seed.goldSeeds >= goldCost) {
        const buyIt = await gameConfirm(
          "🔀 True → Gold Switch",
          `<b>Cost:</b> ${researchCost.toLocaleString()} research + ${brownCost.toLocaleString()} brown seeds + ${goldCost} gold seeds<br><br>` +
          `This allows <b style="color: cyan;">true seeds</b> to mutate into <b style="color: gold;">gold seeds</b>!<br><br>` +
          `<i>Remember to turn it on in Settings!</i>`,
          "Purchase",
          "Cancel"
        );

        if (buyIt) {
          playerdata.research -= researchCost;
          playerdata.seed.brnSeeds -= brownCost;
          playerdata.seed.goldSeeds -= goldCost;
          playerdata.switches.trueGoldSwitch = true;
          dialog("True → Gold switch purchased! Turn it on in Settings.");
          updateSwitchToggles();
          updateScienceLabels();
        }
      } else {
        dialog(`Need ${researchCost.toLocaleString()} research, ${brownCost.toLocaleString()} brown seeds, and ${goldCost} gold seeds.`);
      }
    } else {
      dialog("Already purchased!");
    }
  } else if (!playerdata.unlocked.research) {
    dialog("Research not unlocked yet! Reach level 30.");
  } else {
    dialog("True rice not unlocked yet! Reach level 100.");
  }
});

// Research: Better Regular seeds (3 tiers max)
// Tier 1: 5k research + 5k seeds → ×2 yield
// Tier 2: 15k research + 15k seeds → ×4 yield
// Tier 3: 30k research + 30k seeds → ×6 yield
science[18] && science[18].addEventListener("click", async function researchBetterRegular() {
  if (playerdata.unlocked.research) {
    const tier = playerdata.researchPurchases.betterRegular || 0;

    if (tier >= 3) {
      dialog("Already at maximum tier!");
      return;
    }

    // Costs per tier: 5k/15k/30k research, same for seeds
    const costs = [
      { research: 5000, seeds: 5000, mult: 2 },
      { research: 15000, seeds: 15000, mult: 4 },
      { research: 30000, seeds: 30000, mult: 6 }
    ];
    const { research: researchCost, seeds: seedCost, mult } = costs[tier];

    if (playerdata.research >= researchCost && playerdata.seed.seeds >= seedCost) {
      const currentMult = tier === 0 ? 1 : costs[tier - 1].mult;

      const buyIt = await gameConfirm(
        `🌾 Better Regular Seeds (Tier ${tier + 1})`,
        `<b>Cost:</b> ${researchCost.toLocaleString()} research + ${seedCost.toLocaleString()} regular seeds<br><br>` +
        `Current yield: <b>×${currentMult}</b><br>` +
        `New yield: <b style="color: #88ff88;">×${mult}</b>`,
        "Research",
        "Cancel"
      );

      if (buyIt) {
        playerdata.research -= researchCost;
        playerdata.seed.seeds -= seedCost;
        playerdata.researchPurchases.betterRegular++;
        dialog(`Better Regular upgraded to Tier ${tier + 1}! Regular seeds now yield ×${mult}.`);
        updateScienceLabels();
      }
    } else {
      dialog(`Need ${researchCost.toLocaleString()} research and ${seedCost.toLocaleString()} regular seeds.`);
    }
  } else {
    dialog("Research not unlocked yet! Reach level 30.");
  }
});

// Research: Better Better seeds (3 tiers max)
// Tier 1: 10k research + 5k better seeds → ×2 yield
// Tier 2: 25k research + 10k better seeds → ×3 yield
// Tier 3: 50k research + 15k better seeds → ×4 yield
science[20] && science[20].addEventListener("click", async function researchBetterBetter() {
  if (playerdata.unlocked.research) {
    const tier = playerdata.researchPurchases.betterBetter || 0;

    if (tier >= 3) {
      dialog("Already at maximum tier!");
      return;
    }

    // Costs per tier
    const costs = [
      { research: 10000, seeds: 5000, mult: 2 },
      { research: 25000, seeds: 10000, mult: 3 },
      { research: 50000, seeds: 15000, mult: 4 }
    ];
    const { research: researchCost, seeds: seedCost, mult } = costs[tier];

    if (playerdata.research >= researchCost && playerdata.seed.btrSeeds >= seedCost) {
      const currentMult = tier === 0 ? 1 : costs[tier - 1].mult;

      const buyIt = await gameConfirm(
        `✨ Better Better Seeds (Tier ${tier + 1})`,
        `<b>Cost:</b> ${researchCost.toLocaleString()} research + ${seedCost.toLocaleString()} better seeds<br><br>` +
        `Current yield: <b>×${currentMult}</b><br>` +
        `New yield: <b style="color: #88ff88;">×${mult}</b>`,
        "Research",
        "Cancel"
      );

      if (buyIt) {
        playerdata.research -= researchCost;
        playerdata.seed.btrSeeds -= seedCost;
        playerdata.researchPurchases.betterBetter++;
        dialog(`Better Better upgraded to Tier ${tier + 1}! Better seeds now yield ×${mult}.`);
        updateScienceLabels();
      }
    } else {
      dialog(`Need ${researchCost.toLocaleString()} research and ${seedCost.toLocaleString()} better seeds.`);
    }
  } else {
    dialog("Research not unlocked yet! Reach level 30.");
  }
});

// Update science lab button labels and costs
function updateScienceLabels() {
  // Brown Mutation Research
  if (playerdata.unlocked.research && playerdata.switches.brnSwitch) {
    const n = playerdata.researchPurchases.brownMutation;
    const researchCost = getScaledCost(1000, n);
    const seedCost = getScaledCost(500, n);
    science[0].innerHTML = `Brown Mutation (Tier ${n + 1})`;
    science[1].innerHTML = `${researchCost.toLocaleString()} Research + ${seedCost.toLocaleString()} Better Seeds`;
  } else if (playerdata.unlocked.research) {
    science[0].innerHTML = "Brown Mutation";
    science[1].innerHTML = "🔒 Buy Brown Switch";
  } else {
    science[0].innerHTML = "?????";
    science[1].innerHTML = "?????";
  }

  // Brown Success Research
  if (playerdata.unlocked.research && playerdata.switches.brnSwitch) {
    const n = playerdata.researchPurchases.brownSuccess;
    const researchCost = getScaledCost(1000, n);
    const seedCost = getScaledCost(100, n);
    science[2].innerHTML = `Brown Success (Tier ${n + 1})`;
    science[3].innerHTML = `${researchCost.toLocaleString()} Research + ${seedCost.toLocaleString()} Brown Seeds`;
  } else if (playerdata.unlocked.research) {
    science[2].innerHTML = "Brown Success";
    science[3].innerHTML = "🔒 Buy Brown Switch";
  } else {
    science[2].innerHTML = "?????";
    science[3].innerHTML = "?????";
  }

  // Gold Mutation Research
  if (playerdata.unlocked.research && playerdata.switches.goldSwitch) {
    const n = playerdata.researchPurchases.goldMutation;
    const researchCost = getScaledCost(10000, n);
    const seedCost = getScaledCost(1000, n);
    science[4].innerHTML = `Gold Mutation (Tier ${n + 1})`;
    science[5].innerHTML = `${researchCost.toLocaleString()} Research + ${seedCost.toLocaleString()} Brown Seeds`;
  } else if (playerdata.unlocked.research) {
    science[4].innerHTML = "Gold Mutation";
    science[5].innerHTML = "🔒 Buy Gold Switch";
  } else {
    science[4].innerHTML = "?????";
    science[5].innerHTML = "?????";
  }

  // Gold Success Research
  if (playerdata.unlocked.research && playerdata.switches.goldSwitch) {
    const n = playerdata.researchPurchases.goldSuccess;
    const researchCost = getScaledCost(10000, n);
    const seedCost = 1 + n;
    science[6].innerHTML = `Gold Success (Tier ${n + 1})`;
    science[7].innerHTML = `${researchCost.toLocaleString()} Research + ${seedCost} Gold Seeds`;
  } else if (playerdata.unlocked.research) {
    science[6].innerHTML = "Gold Success";
    science[7].innerHTML = "🔒 Buy Gold Switch";
  } else {
    science[6].innerHTML = "?????";
    science[7].innerHTML = "?????";
  }

  // Better Fertilizer Research
  if (playerdata.unlocked.research) {
    const currentTier = playerdata.researchPurchases.betterFert;
    if (currentTier >= 3) {
      science[8].innerHTML = "Fertilizer (MAX)";
      science[9].innerHTML = "Complete!";
    } else {
      const costs = [
        { research: 20000, fertilizer: 20000 },
        { research: 100000, fertilizer: 100000 },
        { research: 500000, fertilizer: 500000 }
      ];
      const next = costs[currentTier];
      science[8].innerHTML = `Better Fertilizer (Tier ${currentTier + 1})`;
      science[9].innerHTML = `${next.research.toLocaleString()} Research + ${next.fertilizer.toLocaleString()} Fertilizer`;
    }
  } else {
    science[8].innerHTML = "?????";
    science[9].innerHTML = "?????";
  }

  // Brown Mutation Switch
  if (playerdata.unlocked.research && playerdata.unlocked.brnSwitch) {
    if (playerdata.switches.brnSwitch) {
      science[10].innerHTML = "Brown Switch";
      science[11].innerHTML = "✓ Purchased";
      science[10].disabled = true;
    } else {
      science[10].innerHTML = "Brown Switch";
      science[11].innerHTML = "25K Research + 10K Better Seeds";
    }
  } else {
    science[10].innerHTML = "?????";
    science[11].innerHTML = "?????";
  }

  // Gold Mutation Switch
  if (science[12] && science[13]) {
    if (playerdata.unlocked.research && playerdata.unlocked.goldSwitch) {
      if (playerdata.switches.goldSwitch) {
        science[12].innerHTML = "Gold Switch";
        science[13].innerHTML = "✓ Purchased";
        science[12].disabled = true;
      } else {
        science[12].innerHTML = "Gold Switch";
        science[13].innerHTML = "50,000 Research + 5,000 Brown Seeds";
      }
    } else {
      science[12].innerHTML = "?????";
      science[13].innerHTML = "?????";
    }
  }

  // True → Brown Switch
  if (science[14] && science[15]) {
    if (playerdata.unlocked.research && playerdata.unlocked.trueSeed) {
      if (playerdata.switches.trueBrnSwitch) {
        science[14].innerHTML = "True→Brown Switch";
        science[15].innerHTML = "✓ Purchased";
        science[14].disabled = true;
      } else {
        science[14].innerHTML = "True→Brown Switch";
        science[15].innerHTML = "100,000 Research + 10,000 Brown Seeds";
      }
    } else {
      science[14].innerHTML = "?????";
      science[15].innerHTML = "?????";
    }
  }

  // True → Gold Switch
  if (science[16] && science[17]) {
    if (playerdata.unlocked.research && playerdata.unlocked.trueSeed) {
      if (playerdata.switches.trueGoldSwitch) {
        science[16].innerHTML = "True→Gold Switch";
        science[17].innerHTML = "✓ Purchased";
        science[16].disabled = true;
      } else {
        science[16].innerHTML = "True→Gold Switch";
        science[17].innerHTML = "500,000 Research + 10,000 Brown Seeds + 100 Gold Seeds";
      }
    } else {
      science[16].innerHTML = "?????";
      science[17].innerHTML = "?????";
    }
  }

  // Better Regular seeds yield research
  if (science[18] && science[19]) {
    if (playerdata.unlocked.research) {
      const tier = playerdata.researchPurchases.betterRegular || 0;
      const costs = [
        { research: 5000, seeds: 5000, mult: 2 },
        { research: 15000, seeds: 15000, mult: 4 },
        { research: 30000, seeds: 30000, mult: 6 }
      ];

      if (tier >= 3) {
        science[18].innerHTML = "Better Regular (MAX)";
        science[19].innerHTML = "✓ Tier 3 - ×6 Yield";
        science[18].disabled = true;
      } else {
        const { research, seeds, mult } = costs[tier];
        science[18].innerHTML = `Better Regular (Tier ${tier + 1})`;
        science[19].innerHTML = `${(research / 1000)},000 Research + ${(seeds / 1000)},000 Seeds → ×${mult}`;
      }
    } else {
      science[18].innerHTML = "?????";
      science[19].innerHTML = "?????";
    }
  }

  // Better Better seeds yield research
  if (science[20] && science[21]) {
    if (playerdata.unlocked.research) {
      const tier = playerdata.researchPurchases.betterBetter || 0;
      const costs = [
        { research: 10000, seeds: 5000, mult: 2 },
        { research: 25000, seeds: 10000, mult: 3 },
        { research: 50000, seeds: 15000, mult: 4 }
      ];

      if (tier >= 3) {
        science[20].innerHTML = "Better Better (MAX)";
        science[21].innerHTML = "✓ Tier 3 - ×4 Yield";
        science[20].disabled = true;
      } else {
        const { research, seeds, mult } = costs[tier];
        science[20].innerHTML = `Better Better (Tier ${tier + 1})`;
        science[21].innerHTML = `${(research / 1000)},000 Research + ${(seeds / 1000)},000 Better Seeds → ×${mult}`;
      }
    } else {
      science[20].innerHTML = "?????";
      science[21].innerHTML = "?????";
    }
  }
}

// Initialize labels on load
updateScienceLabels();

