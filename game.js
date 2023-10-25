"use strict";

if (localStorage.getItem("name")) {
  var farmerName = localStorage.getItem("name")
  formName.style.opacity = 0
  startup.children[1].innerHTML = `Welcome back, Peasant ${farmerName}. Glad to see you here.`
  document.documentElement.addEventListener("click", function clicktocontinue() {
    startup.style.display = "none"
    game.style.display = "inline"
    welcome.innerHTML = `Welcome back, Peasant ${farmerName}. ${greetings[Math.floor(Math.random() * greetings.length)]}`
    document.documentElement.removeEventListener("click", clicktocontinue)
  })
} else {
  formName.onsubmit = () => {
    if (formName[0].value == null || formName[0].value == "") {
      var farmerName = farmerNames[Math.floor(Math.random() * greetings.length)]
      localStorage.setItem("name", farmerName)
      startup.style.display = "none"
      game.style.display = "inline"
      welcome.innerHTML = `Welcome back, Peasant ${farmerName}. ${greetings[Math.floor(Math.random() * greetings.length)]}`
    } else {
      var farmerName = formName[0].value
      localStorage.setItem("name", farmerName)
      startup.style.display = "none"
      game.style.display = "block"
      welcome.innerHTML = `Welcome back, Peasant ${farmerName}. ${greetings[Math.floor(Math.random() * greetings.length)]}`
    }
    return false;
  }
}

function updateTiles() {for (let i = 0; i < playerdata.tiles; i++) {
    tiles.children[i].style.display = 'inline-block'
}}

updateTiles()

tiles.addEventListener("click", (e) => {
  if (e.target.innerHTML === "Empty soil" && playerdata.seeds > 0 && playerdata.water > 0) {
    for (let each of rices) {
      if (each.using) {
        e.target.style.backgroundColor = "#0040ff"
        if (each.type == "select") {
          playerdata.selectSeeds--
          if (playerdata.selectSeeds == 0) {
            choosing.children[2].disabled = true
            select.using = false
            choosing.value = "noselect"
          }
        } else if (each.type == "brown") {
          playerdata.brownSeeds--
          if (playerdata.brownSeeds == 0) {
            choosing.children[3].disabled = true
            brown.using = false
            choosing.value = "noselect"
          }
        } else if (each.type == "gold") {
          playerdata.goldSeeds--
          if (playerdata.goldSeeds == 0) {
            choosing.children[4].disabled = true
            gold.using = false
            choosing.value = "noselect"
          }
        } else {
          playerdata.seeds--
          if (playerdata.seeds == 0) {
            choosing.children[1].disabled = true
            plain.using = false
            choosing.value = "noselect"
          }
        }
        let usedFert = false
        playerdata.water--
        if (hasFertile) {
          if (playerdata.unlocked.betterFert) {
            var harvestSeconds = each.seconds - 5
          } else {
            var harvestSeconds = each.seconds - 3
          }
          playerdata.fertile--
          usedFert = true
        } else {
          var harvestSeconds = each.seconds
        }
        
        e.target.innerHTML = each.type.toUpperCase() + " rice is growing!<br>Ready in " + harvestSeconds
        var harvesting = setInterval(() => {
          if (harvestSeconds > 1) {
            harvestSeconds--
            e.target.innerHTML = each.type.toUpperCase() + " rice is growing!<br>Ready in " + harvestSeconds
          } else {
            e.target.style.animation = "flash 1s"
            e.target.innerHTML = each.type.toUpperCase() + " rice is ready!"
            e.target.addEventListener("click", function addrice() {
              if (playerdata.unlocked.brown[0] == true && each.type == "select" && chance(select.mutationChance)) {
                dialog("Mutation! +1 brown seed")
                playerdata.unlocked.brown[1] = true
                playerdata.brownSeeds++
                playerdata.stats.brownSeeds++
                if (playerdata.unlocked.research) {
                  playerdata.research++
                }
                gainXP(7, 9)
              } else if (playerdata.unlocked.gold[0] == true && each.type == "brown" && chance(brown.mutationChance)) {
                dialog("Mutation! +1 gold seed")
                playerdata.unlocked.gold[1] = true
                playerdata.goldSeeds++
                playerdata.stats.goldSeeds++
                if (playerdata.unlocked.research) {
                  playerdata.research += 2
                }
              } else {
                if (usedFert) {
                  if (each.type == "brown") {
                    if (playerdata.unlocked.betterFert) {
                      let temp = Math.ceil(each.cropYield * 2)
                      playerdata.brownRice += temp
                      playerdata.stats.brownRice += temp
                    } else {
                      let temp = Math.ceil(each.cropYield * 1.5)
                      playerdata.brownRice += temp
                      playerdata.stats.brownRice += temp
                    }
                    gainXP(5, 7)
                  } else if (each.type == "gold") {
                    if (playerdata.unlocked.betterFert) {
                      let temp = Math.ceil(each.cropYield * 2)
                      playerdata.goldRice += temp
                      playerdata.stats.goldRice += temp
                    } else {
                      let temp = Math.ceil(each.cropYield * 1.5)
                      playerdata.goldRice += temp
                      playerdata.stats.goldRice += temp
                    }
                    gainXP(7, 9)
                  } else {
                    if (playerdata.unlocked.betterFert) {
                      let temp = Math.ceil(each.cropYield * 2)
                      playerdata.rice += temp
                      playerdata.stats.rice += temp
                    } else {
                      let temp = Math.ceil(each.cropYield * 1.5)
                      playerdata.rice += temp
                      playerdata.stats.rice += temp
                    }

                    gainXP(3, 5)
                  }
                } else {
                  if (each.type == "brown") {
                    let temp = each.cropYield
                    playerdata.brownRice += temp
                    playerdata.stats.brownRice += temp
                    gainXP(5, 7)
                  } else if (each.type == "gold") {
                    let temp = each.cropYield
                    playerdata.goldRice += temp
                    playerdata.stats.goldRice += temp
                    gainXP(7, 9)
                  } else {
                    let temp = each.cropYield
                    playerdata.rice += temp
                    playerdata.stats.rice += temp
                    gainXP(3, 5)
                  }
                }
              }
              if (playerdata.unlocked.research) {
                playerdata.research++
              }
              e.target.removeEventListener("click", addrice)
              e.target.innerHTML = "Preparing soil for next crop! Please wait..."
              e.target.style.backgroundColor = "#1438a3"
              e.target.style.animation = "none"
              setTimeout(() => { e.target.innerHTML = "Empty soil" }, 1000)
            })
            clearInterval(harvesting)
          }
        }, 1000)
      }
    }

  } else if (e.target.innerHTML === "Empty soil" && seeds == false) {
    dialog("No seeds left.")
  } else if (e.target.innerHTML === "Empty soil" && playerdata.water <= 0) {
    dialog("No water left.")
  }
  return
})




