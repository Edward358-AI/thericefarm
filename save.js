// Player data structure following the new spec
// Data migration not supported - fresh start required for new system

function getDefaultPlayerData() {
  return {
    seed: {
      seeds: 10,
      btrSeeds: 0,
      brnSeeds: 0,
      goldSeeds: 0,
      trueSeeds: 0,
    },
    rice: {
      rice: 0,
      brnRice: 0,
      goldRice: 0,
    },
    water: 10,
    yuan: 10,
    level: 0,
    xp: 0,
    rank: "Amateur",
    research: 0,
    land: 1,
    baseCrop: 2,
    fertile: 10,
    unlocked: {
      land: false,
      btrSeeds: false,
      brnSwitch: false,
      goldSwitch: false,
      trueSwitch: false,
      trueBrnSwitch: false,
      trueGoldSwitch: false,
      research: false,
      brnSeed: false,
      goldSeed: false,
      trueSeed: false,
      brnLock: Math.floor(Math.random() * 11) + 30, // 30-40
      goldLock: Math.floor(Math.random() * 11) + 50, // 50-60
    },
    achievements: {
      rice: [false, false, false, false],
      btrSeeds: [false, false, false, false],
      brnSeeds: [false, false, false, false],
      goldSeeds: [false, false, false, false],
      trueSeeds: [false, false, false, false],
      spend: [false, false, false, false],
      land: [false, false, false, false],
    },
    researchPurchases: {
      brownMutation: 0,
      brownSuccess: 0,
      goldMutation: 0,
      goldSuccess: 0,
      betterFert: 0,
      betterRegular: 0,  // Yield scaling for regular seeds (3 tiers max)
      betterBetter: 0,   // Yield scaling for better seeds (3 tiers max)
    },
    switches: {
      brnSwitch: false,
      brnSwitchActive: false,
      goldSwitch: false,
      goldSwitchActive: false,
      trueBrnSwitch: false,
      trueBrnSwitchActive: false,
      trueGoldSwitch: false,
      trueGoldSwitchActive: false,
    },
    stats: {
      seed: {
        seeds: 10,
        btrSeeds: 0,
        brnSeeds: 0,
        goldSeeds: 0,
        trueSeeds: 0,
      },
      rice: {
        rice: 0,
        brnRice: 0,
        goldRice: 0,
      },
      water: 10,
      yuan: 10,
      research: 0,
      spent: 0,
      sold: 0,
    },
    // Market state - tracks current hour purchases for price fluctuation
    market: {
      lastResetHour: new Date().getHours(),
      lastResetDate: new Date().toDateString(),
      regularSold: 0,
      brownSold: 0,
      goldSold: 0,
      seedsBought: 0,
      btrSeedsBought: 0,
      waterBought: 0,
      brownTraded: 0,
      goldTraded: 0,
      fertilizerBought: 0,
    },
  };
}

// Check if saved data exists and is valid
if (localStorage.getItem("playerdata")) {
  try {
    let savedData = JSON.parse(localStorage.getItem("playerdata"));
    // Check if it's the new format (has 'seed' object)
    if (savedData && typeof savedData === "object" && savedData.seed && savedData.seed.seeds !== undefined) {
      var playerdata = savedData;
      // Merge any missing fields from default
      let defaultData = getDefaultPlayerData();
      for (let key of Object.keys(defaultData)) {
        if (playerdata[key] === undefined) {
          playerdata[key] = defaultData[key];
        }
      }
      // Nested object merge for unlocked
      for (let key of Object.keys(defaultData.unlocked)) {
        if (playerdata.unlocked[key] === undefined) {
          playerdata.unlocked[key] = defaultData.unlocked[key];
        }
      }
      // Nested object merge for achievements
      for (let key of Object.keys(defaultData.achievements)) {
        if (playerdata.achievements[key] === undefined) {
          playerdata.achievements[key] = defaultData.achievements[key];
        }
      }
      // Nested object merge for researchPurchases
      for (let key of Object.keys(defaultData.researchPurchases)) {
        if (playerdata.researchPurchases[key] === undefined) {
          playerdata.researchPurchases[key] = defaultData.researchPurchases[key];
        }
      }
      // Nested object merge for switches
      if (!playerdata.switches) playerdata.switches = {};
      for (let key of Object.keys(defaultData.switches)) {
        if (playerdata.switches[key] === undefined) {
          playerdata.switches[key] = defaultData.switches[key];
        }
      }
      // Nested object merge for market
      if (!playerdata.market) playerdata.market = {};
      for (let key of Object.keys(defaultData.market)) {
        if (playerdata.market[key] === undefined) {
          playerdata.market[key] = defaultData.market[key];
        }
      }
    } else {
      // Old format detected - start fresh
      console.log("Old save format detected. Starting fresh with new system.");
      var playerdata = getDefaultPlayerData();
    }
  } catch (e) {
    console.log("Error parsing save data. Starting fresh.");
    var playerdata = getDefaultPlayerData();
  }
} else {
  var playerdata = getDefaultPlayerData();
}

// the idea of base64 compression was a direct idea taken from Space Company (https://github.com/sparticle999/SpaceCompany)

var imp = document.getElementById("import");
var exp = document.getElementById("export");
var blig = document.getElementById("blig");

exp.onclick = () => {
  localStorage.setItem("playerdata", JSON.stringify(playerdata));
  blig.value = LZString.compressToBase64(JSON.stringify(playerdata));
};

imp.onclick = () => {
  if (blig.value.trim() && blig.value.length % 4 === 0 && LZString.decompressFromBase64(blig.value)) {
    if (confirm("Are you sure you want to import this data?")) {
      localStorage.setItem("playerdata", LZString.decompressFromBase64(blig.value));
      window.location.reload();
    }
  } else {
    alert("An error occured during import. Please make sure there is no whitespace/newlines anywhere and the correct save encoding has been used.");
  }
};
