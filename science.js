
if (!playerdata.unlocked.stage1) {
  science[0].addEventListener("click", function stageOne() {
    if (playerdata.unlocked.research) {
      if (playerdata.research >= 5000 && playerdata.money >= 5000) {
        let buyStage = confirm("Are you sure you would like to acquire the knowledge for stage 1 in exchange for 5000 research and 5000元?")
        if (buyStage) {
          playerdata.research -= 5000
          playerdata.money -= 5000
          playerdata.unlocked.stage1 = true
          science[0].removeEventListener("click", stageOne)
          science[0].style.display = "none"
science[1].style.display = "none"
          alert("You have now completed stage 1. Congrats! This is your first step of many towards a better future for you. The stars acknowledge you courage and desire to continue. As a result, we have provided you with 1000 more research to keep your spirits high.")
          playerdata.research += 1000
        }
      } else {
        alert("Need 5000 research and 5000元.")
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
      if (playerdata.research >= 50000 && playerdata.money >= 50000 && playerdata.selectSeeds >= 5000) {
        let buyStage = confirm("Are you sure you would like to acquire the knowledge for stage 2 in exchange for 50000 research, 50000元, and 5000 select seeds?")
        if (buyStage) {
          playerdata.research -= 50000
          playerdata.money -= 50000
          playerdata.selectSeeds -= 5000
          playerdata.unlocked.stage2 = true
          science[2].removeEventListener("click", stageTwo)
          science[2].style.display = "none"
science[3].style.display = "none"
          alert("You have now completed stage 2. To keep you going, the stars have provided you with 200 brown seeds, which was the (non-toxic) radioactive byproduct as a result the experimentation of the select seeds.")
          playerdata.brownSeeds += 200
        }
      } else {
        alert("Need 50000 research, 50000元, 5000 select seeds.")
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
      if (playerdata.rice >= 1000000 && playerdata.research >= 500000 && playerdata.money >= 500000 && playerdata.brownSeeds >= 5000 && playerdata.goldSeeds >= 5) {
        let buyStage = confirm("Are you sure you would like to acquire the knowledge for stage 3 in exchange for 1 million rice, 500000 research, 500000元, 5000 brown seeds, and 5 gold seeds?")
        if (buyStage) {
          playerdata.rice -= 1000000
          playerdata.research -= 500000
          playerdata.money -= 500000
          playerdata.brownSeeds -= 5000
          playerdata.goldSeeds -= 5
          playerdata.unlocked.stage3 = true
          science[4].removeEventListener("click", stageThree)
          science[4].style.display = "none"
science[5].style.display = "none"
          alert("You have now completed stage 3. Congratulations, you have completed all the stages! 100 gold seeds have been presented to you by the stars for your dedication and hard work. A message awaits you. Go forth!")
          document.getElementById("ending").style.display = "block"
          playerdata.goldSeeds += 100
        }
      } else {
        alert("Need 1 million rice, 500000 research, 500000元, 5000 brown seeds, and 5 gold seeds.")
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
      if (playerdata.research >= 5000 && playerdata.selectSeeds >= 500) {
        let yesno = confirm("Are you sure you would like to research brown mutations for 5000 research and 500 select seeds?")
        if (yesno) {
          playerdata.unlocked.brownPlus = true
          playerdata.research -= 5000
          playerdata.selectSeeds -= 500
          science[6].removeEventListener("click", scienceBrown)
          science[6].style.display = "none"
science[7].style.display = "none"
          alert("You now know the ways of brown mutations and have thus improved your chances of one.")
        }
      } else {
        alert("Need 5000 research and 500 select seeds.")
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
      if (playerdata.research >= 10000 && playerdata.brownSeeds >= 200) {
        let yesno = confirm("Are you sure you would like to research gold mutations for 10000 research and 200 brown seeds?")
        if (yesno) {
          playerdata.unlocked.goldPlus = true
          playerdata.research -= 10000
          playerdata.brownSeeds -= 200
          science[8].removeEventListener("click", scienceGold)
          science[8].style.display = "none"
science[9].style.display = "none"
          alert("You now know the ways of gold mutations and have thus improved your chances of one.")
        }
      } else {
        alert("Need 10000 research and 200 brown seeds.")
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
      if (playerdata.research >= 2000 && playerdata.fertile >= 200) {
        let yesno = confirm("Are you sure you would like to research fertilizer for 2000 research and 200 fertilizer?")
        if (yesno) {
          playerdata.unlocked.betterFert = true
          playerdata.research -= 2000
          playerdata.fertile -= 200
          science[10].removeEventListener("click", scienceFert)
          science[10].style.display = "none"
          science[11].style.display = "none"
          alert("You have now acquired a more technologically advanced fertilizer.")
        }
      } else {
        alert("Need 2000 research and 200 fertilizer.")
      }
    } else {
      alert("Not unlocked yet!")
    }
  })
} else {
  science[10].style.display = "none"
  science[11].style.display = "none"
}
