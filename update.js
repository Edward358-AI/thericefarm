
function update() {
  localStorage.setItem("playerdata", JSON.stringify(playerdata))
  research.innerHTML =   `Research: ${playerdata.research}`
  riceAmount.innerHTML = `Rice: ${playerdata.rice}<br>Brown rice: ${playerdata.brownRice}<br>Gold rice: ${playerdata.goldRice}`
  moneyAmount.innerHTML = "Money: " + round2(playerdata.money) + "元"
  fertilizer.innerHTML = "Fertilizer: " + playerdata.fertile
  waterAmount.innerHTML = "Water left: " + playerdata.water + " L"
  achieves.children[2].innerHTML = `<span>Buy land unlocked: Unlocked at XP lvl 5</span><br><span>Select seeds unlocked: (${playerdata.stats.sold} rice sold out of 500)</span><br><span>Brown seed mutations unlocked: (Unlocked at XP lvl ${playerdata.brownLock})</span><br><span>Gold seed mutation unlocked: (Unlocked at XP lvl ${playerdata.goldLock})</span><br><span>Research Unlocked: ${playerdata.unlocked.research ? "Yes" : "No"}</span><br><span>More brown mutations: ${playerdata.unlocked.brownPlus ? "Yes" : "No"}</span><br><span>More gold mutations: ${playerdata.unlocked.goldPlus ? "Yes" : "No"}</span><br><span>Advanced fertilizer: ${playerdata.unlocked.betterFert ? "Yes" : "No"}</span>`
  achieves.children[5].innerHTML = `<br>Rice acquired: ${playerdata.stats.rice}<br>Rice sold: ${playerdata.stats.sold}<br>Plain seeds acquired: ${playerdata.stats.seeds}<br>Select seeds acquired: ${playerdata.stats.selectSeeds}<br>Brown seeds acquired: ${playerdata.stats.brownSeeds}<br>Brown rice acquired: ${playerdata.stats.brownRice}<br>Gold seeds acquired: ${playerdata.stats.goldSeeds}<br>Gold rice acquired: ${playerdata.stats.goldRice}<br>Water acquired: ${playerdata.stats.water}<br>Money acquired: ${playerdata.stats.money}元<br>Money spent: ${playerdata.stats.spent}元<br>Fertilizer acquired: ${playerdata.stats.fertile}<br>Research acquired: ${playerdata.stats.research}<br>Farmlands: ${playerdata.stats.tiles}<br>`
  choosing.children[1].innerHTML = `Plain (${playerdata.seeds})`
  choosing.children[2].innerHTML = `Select (${playerdata.selectSeeds})`
  choosing.children[3].innerHTML = `Brown (${playerdata.brownSeeds})`
  choosing.children[4].innerHTML = `Gold (${playerdata.goldSeeds})`
  if (playerdata.seeds == 0 && playerdata.selectSeeds == 0 && playerdata.brownSeeds == 0 && playerdata.goldSeeds == 0) {
    seeds = false
  }
  if (playerdata.fertile <= 0) {
    hasFertile = false
    usefert.disabled = true
    usefert.value = "false"
  } else {
    usefert.disabled = false
  }
  if (playerdata.rice == 0 && playerdata.brownRice == 0 && playerdata.goldRice == 0) {
    sellRice.disabled = true
  } else {
    sellRice.disabled = false
  }
  if (playerdata.seeds > 0) {
    choosing.children[1].disabled = false
  } else {
    choosing.children[1].disabled = true
  }
  if (playerdata.unlocked.select == true && playerdata.selectSeeds > 0) {
    choosing.children[2].disabled = false
  } else {
    choosing.children[2].disabled = true
    if (select.using == true) {
      select.using = false
      choosing.value = "noselect"
    }
  }
  if (playerdata.unlocked.brown[0] == true && playerdata.brownSeeds > 0) {
    choosing.children[3].disabled = false
  } else {
    choosing.children[3].disabled = true
    if (brown.using == true) {
      brown.using = false
      choosing.value = "noselect"
    }
  }
  if (playerdata.unlocked.gold[0] == true && playerdata.goldSeeds > 0) {
    choosing.children[4].disabled = false
  } else {
    choosing.children[4].disabled = true
    if (gold.using == true) {
      gold.using = false
      choosing.value = "noselect"
    }
  }
  if (playerdata.stats.sold >= 500 && playerdata.unlocked.select == false) {
    dialog("Select seeds unlocked!")
    playerdata.unlocked.select = true
  }
  if (playerdata.xpLevel >= playerdata.brownLock && playerdata.unlocked.brown[0] == false && playerdata.unlocked.select == true) {
    dialog("Brown seed mutations unlocked!")
    playerdata.unlocked.brown[0] = true
  }
  if (playerdata.xpLevel >= playerdata.goldLock && playerdata.unlocked.gold[0] == false && playerdata.unlocked.brown[1] == true) {
    playerdata.unlocked.gold[0] = true
  }
  if (shop[2].innerHTML == "???????" && playerdata.unlocked.brown[1] == true) {
    shop[2].innerHTML = "Trade for brown seeds"
}
  if (shop[8].innerHTML == "???????" && playerdata.xpLevel >= 5) {
    shop[8].innerHTML = "Buy land"
}
  if (playerdata.xpLevel >= 20 && playerdata.unlocked.research == false) {
    playerdata.unlocked.research = true
    dialog("Research unlocked!")
  }
  if (playerdata.unlocked.stage1) {
    science[0].style.display = "none"
    science[1].style.display = "none"
  }
  if (playerdata.unlocked.stage2) {
    science[2].style.display = "none"
    science[3].style.display = "none"
  }
  if (playerdata.unlocked.stage3) {
    secret.innerHTML = "show ending"
    secret.onclick = () => {
      document.getElementById('ending').style.display = 'block'
    }
  }
  if (playerdata.unlocked.brownPlus) {
    science[4].style.display = "none"
    science[5].style.display = "none"
  }
  if (playerdata.unlocked.goldPlus) {
    science[6].style.display = "none"
    science[7].style.display = "none"
  }
  if (playerdata.unlocked.betterFert) {
    science[8].style.display = "none"
    science[9].style.display = "none"
  }
  if (playerdata.unlocked.research) {
    science[0].innerHTML = "Buy Stage 1"
    science[2].innerHTML = "Buy Stage 2"
    science[4].innerHTML = "Upgrade Brown Seeds"
    science[6].innerHTML = "Upgrade Gold Seeds"
    science[8].innerHTML = "Upgrade Fertilizer"
  }
  if (playerdata.unlocked.brownPlus) {
    select.mutationChance = 0.2
  }
  if (playerdata.unlocked.goldPlus) {
    brown.mutationChance = 0.02
  }
  if (playerdata.unlocked.stage3) {
    document.getElementById("showend").style.display = "block"
  }
  return;
}
update()

playerdata = observe(playerdata, (target, prop, changes) => {
  target[prop] = changes
  update()
  return true
})