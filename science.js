
if (!playerdata.unlocked.stage1) {
  science[0].addEventListener("click", function stageOne() {
    if (playerdata.unlocked.research) {
      if (playerdata.research >= 1000 && playerdata.money >= 100) {
        let buyStage = confirm("Are you sure you would like to acquire the knowledge for stage 1 in exchange for 1000 research and 100元?")
        if (buyStage) {
          playerdata.research -= 1000
          playerdata.money -= 100
          playerdata.unlocked.stage1 = true
          science[0].removeEventListener("click", stageOne)
          science[0].style.display = "none"
science[1].style.display = "none"
          alert("You have now completed stage 1. Congrats! This is your first step of many towards a better future for you. The stars acknowledge you courage and desire to continue. As a result, we have provided you with 700 more research to keep your spirits high.")
          playerdata.research += 700
        }
      } else {
        alert("Need 1000 research and 100元.")
      }
    } else {
      alert("Not unlocked yet!")
    }
  })
} else {
  science[0].style.display = "none"
science[1].style.display = "none"
}

if (!playerdata.unlocked.stage2) {
  science[2].addEventListener("click", function stageTwo() {
    if (playerdata.unlocked.research && playerdata.unlocked.stage1) {
      if (playerdata.research >= 10000 && playerdata.money >= 1000 && playerdata.selectSeeds >= 200) {
        let buyStage = confirm("Are you sure you would like to acquire the knowledge for stage 2 in exchange for 10000 research, 1000元, and 200 select seeds?")
        if (buyStage) {
          playerdata.research -= 10000
          playerdata.money -= 1000
          playerdata.selectSeeds -= 200
          playerdata.unlocked.stage2 = true
          science[2].removeEventListener("click", stageTwo)
          science[2].style.display = "none"
science[3].style.display = "none"
          alert("You have now completed stage 2. To keep you going, the stars have provided you with 100 brown seeds, which was the (non-toxic) radioactive byproduct as a result the experimentation of the select seeds.")
          playerdata.brownSeeds += 100
        }
      } else {
        alert("Need 10000 research, 1000元, 200 select seeds.")
      }
    } else {
      alert("Not unlocked yet!")
    }
  })
} else {
  science[2].style.display = "none"
science[3].style.display = "none"
}

if (!playerdata.unlocked.stage3) {
  science[4].addEventListener("click", function stageThree() {
    if (playerdata.unlocked.research && playerdata.unlocked.stage2) {
      if (playerdata.research >= 50000 && playerdata.money >= 50000 && playerdata.brownSeeds >= 500 && playerdata.goldSeeds >= 1) {
        let buyStage = confirm("Are you sure you would like to acquire the knowledge for stage 3 in exchange for 50000 research, 50000元, 500 brown seeds, and a gold seed?")
        if (buyStage) {
          playerdata.research -= 50000
          playerdata.money -= 50000
          playerdata.brownSeeds -= 500
          playerdata.goldSeeds--
          playerdata.unlocked.stage3 = true
          science[4].removeEventListener("click", stageThree)
          science[4].style.display = "none"
science[5].style.display = "none"
          alert("You have now completed stage 3. Congratulations, you have completed all the stages! 10 gold seeds have been presented to you by the stars for your dedication and hard work. A message awaits you. Go forth!")
          document.getElementById("ending").style.display = "block"
          playerdata.goldSeeds += 10
        }
      } else {
        alert("Need 50000 research, 50000元, 500 brown seeds, and a gold seed.")
      }
    } else {
      alert("Not unlocked yet!")
    }
  })
} else {
  science[4].style.display = "none"
science[5].style.display = "none"
}

if (!playerdata.unlocked.brownPlus) {
  science[6].addEventListener("click", function scienceBrown() {
    if (playerdata.unlocked.research && playerdata.unlocked.brown[0]) {
      if (playerdata.research >= 2000 && playerdata.selectSeeds >= 100) {
        let yesno = confirm("Are you sure you would like to research brown mutations for 2000 research and 100 select seeds?")
        if (yesno) {
          playerdata.unlocked.brownPlus = true
          playerdata.research -= 2000
          playerdata.selectSeeds -= 100
          science[6].removeEventListener("click", scienceBrown)
          science[6].style.display = "none"
science[7].style.display = "none"
          alert("You now know the ways of brown mutations and have thus improved your chances of one.")
        }
      } else {
        alert("Need 2000 research and 100 select seeds.")
      }
    } else {
      alert("Not unlocked yet!")
    }
  })
} else {
  science[6].style.display = "none"
science[7].style.display = "none"
}

if (!playerdata.unlocked.goldPlus) {
  science[8].addEventListener("click", function scienceGold() {
    if (playerdata.unlocked.research && playerdata.unlocked.gold[0]) {
      if (playerdata.research >= 5000 && playerdata.brownSeeds >= 100) {
        let yesno = confirm("Are you sure you would like to research gold mutations for 5000 research and 100 brown seeds?")
        if (yesno) {
          playerdata.unlocked.goldPlus = true
          playerdata.research -= 5000
          playerdata.brownSeeds -= 100
          science[8].removeEventListener("click", scienceGold)
          science[8].style.display = "none"
science[9].style.display = "none"
          alert("You now know the ways of gold mutations and have thus improved your chances of one.")
        }
      } else {
        alert("Need 5000 research and 100 brown seeds.")
      }
    } else {
      alert("Not unlocked yet!")
    }
  })
} else {
  science[8].style.display = "none"
science[9].style.display = "none"
}

if (!playerdata.unlocked.betterFert) {
  science[10].addEventListener("click", function scienceFert() {
    if (playerdata.unlocked.research) {
      if (playerdata.research >= 1000 && playerdata.fertile >= 200) {
        let yesno = confirm("Are you sure you would like to research fertilizer for 1000 research and 200 fertilizer?")
        if (yesno) {
          playerdata.unlocked.betterFert = true
          playerdata.research -= 1000
          playerdata.fertile -= 100
          science[10].removeEventListener("click", scienceFert)
          science[10].style.display = "none"
          science[11].style.display = "none"
          alert("You have now acquired a more technologically advanced fertilizer.")
        }
      } else {
        alert("Need 1000 research and 200 fertilizer.")
      }
    } else {
      alert("Not unlocked yet!")
    }
  })
} else {
  science[10].style.display = "none"
  science[11].style.display = "none"
}