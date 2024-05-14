if (localStorage.getItem("playerdata") && typeof JSON.parse(localStorage.getItem("playerdata")) === "object" && !Array.isArray(JSON.parse(localStorage.getItem("playerdata"))) && localStorage.getItem("playerdata") !== null) {
  let brownLock = Math.round(Math.random() * (11 - 7) + 7)
  let goldLock = Math.round(Math.random() * (25 - 20) + 20)
  let tempData = { 
    rice: 10, 
    brownRice: 0, 
    goldRice: 0, 
    fertile: 40, 
    seeds: 40, 
    selectSeeds: 0, 
    brownSeeds: 0, 
    goldSeeds: 0, 
    water: 40, 
    money: 20, 
    tiles: 1, 
    xp: 0, 
    xpLevel: 0, 
    brownLock: brownLock, 
    goldLock: goldLock, 
    research: 0, 
    stats: { 
      sold: 0, 
      rice: 10, 
      brownRice: 0, 
      goldRice: 0, 
      fertile: 40, 
      seeds: 40, 
      selectSeeds: 0, 
      brownSeeds: 0, 
      goldSeeds: 0, 
      water: 40, 
      money: 20, 
      spent: 0, 
      tiles: 1, 
      research: 0
    }, 
    unlocked: { 
      brown: [false, false], 
      gold: [false, false], 
      select: false, 
      research: false,  
      stage1: false, 
      stage2: false, 
      stage3: false, 
      brownPlus: false,
      goldPlus: false, 
      betterFert: false
    }
  }
  var playerdata = JSON.parse(localStorage.getItem("playerdata"))
  for (let each of Object.keys(tempData)) {
    if (playerdata[each] === undefined) {
      playerdata[each] = tempData[each]
    }
  }
  for (let each of Object.keys(tempData.unlocked)) {
    if (playerdata.unlocked[each] === undefined) {
      playerdata.unlocked[each] = tempData.unlocked[each]
    }
  }
  for (let each of Object.keys(tempData.stats)) {
    if (playerdata.stats[each] === undefined) {
      playerdata.stats[each] = tempData.stats[each]
    }
  }
  for (let each of Object.keys(playerdata)) {
    if (tempData[each] === undefined) {
      delete playerdata[each]
    }
  }
  for (let each of Object.keys(playerdata.unlocked)) {
    if (tempData.unlocked[each] === undefined) {
      delete playerdata.unlocked[each]
    }
  }
  for (let each of Object.keys(playerdata.stats)) {
    if (tempData.stats[each] === undefined) {
      delete playerdata.stats[each]
    }
  }
} else {
  let brownLock = Math.round(Math.random() * (11 - 7) + 7)
  let goldLock = Math.round(Math.random() * (25 - 20) + 20)
  var playerdata = { 
    rice: 10, 
    brownRice: 0, 
    goldRice: 0, 
    fertile: 40, 
    seeds: 40, 
    selectSeeds: 0, 
    brownSeeds: 0, 
    goldSeeds: 0, 
    water: 40, 
    money: 20, 
    tiles: 1, 
    xp: 0, 
    xpLevel: 0, 
    brownLock: brownLock, 
    goldLock: goldLock, 
    research: 0, 
    stats: { 
      sold: 0, 
      rice: 10, 
      brownRice: 0, 
      goldRice: 0, 
      fertile: 40, 
      seeds: 40, 
      selectSeeds: 0, 
      brownSeeds: 0, 
      goldSeeds: 0, 
      water: 40, 
      money: 20, 
      spent: 0, 
      tiles: 1, 
      research: 0
    }, 
    unlocked: { 
      brown: [false, false], 
      gold: [false, false], 
      select: false, 
      research: false,  
      stage1: false, 
      stage2: false, 
      stage3: false, 
      brownPlus: false,
      goldPlus: false, 
      betterFert: false
    }
  }
}

// the idea of base64 compression was a direct idea taken from Space Company (https://github.com/sparticle999/SpaceCompany)

var imp = document.getElementById("import")
var exp = document.getElementById("export")
var blig = document.getElementById("blig")

exp.onclick = () => {
  localStorage.setItem("playerdata", JSON.stringify(playerdata))
  blig.value = LZString.compressToBase64(JSON.stringify(playerdata))
}

imp.onclick = () => {
  if (blig.value.trim() && blig.value.length % 4 === 0 && LZString.decompressFromBase64(blig.value)) {
    if (confirm("Are you sure you want to import this data?")) {
    localStorage.setItem("playerdata", LZString.decompressFromBase64(blig.value))
    window.location.reload()
    }
  } else {
    alert("An error occured during import. Please make sure there is no whitespace/newlines anywhere and the correct save encoding has been used.")
  }
}
