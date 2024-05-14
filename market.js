sellRice.addEventListener("click", function sell() {
  let total = playerdata.rice + playerdata.brownRice + playerdata.goldRice
  let sold = playerdata.rice + playerdata.brownRice * 10 + playerdata.goldRice * 100
  playerdata.money += sold
  playerdata.stats.money += sold
  playerdata.stats.sold += total
  playerdata.rice -= playerdata.rice
  playerdata.brownRice -= playerdata.brownRice
  playerdata.goldRice -= playerdata.goldRice
  gainXP(2, 3)
  dialog("All rice sold successfully for " + sold + "元!")
  
})

shop[0].addEventListener("click", function buyPlain() {
  if (playerdata.money > 0) {
    let howMuch = prompt("How many RICE SEEDS do you wish to buy? 1元 = 2 seeds.")
    if (Number.isInteger(parseFloat(howMuch))) {
      if (parseInt(howMuch) / 2 > playerdata.money || parseInt(howMuch) < 1) {
        alert("Error! Please try again.")
      } else {
        let spent = round2(parseInt(howMuch) / 2)
        playerdata.money -= spent
        playerdata.stats.spent += spent
        if (playerdata.unlocked.select == true) {
          let seel = 0
          for (let i = 0; i < parseInt(howMuch); i++) {
            if (chance(0.1)) {
              seel++
            } else {
              continue
            }
          }
          let amt = parseInt(howMuch) - seel
          playerdata.seeds += amt
          playerdata.stats.seeds += amt
          playerdata.selectSeeds += seel
          playerdata.stats.selectSeeds += seel
          alert("Bought " + amt + " PLAIN rice seeds and " + seel + " SELECT seeds for " + spent + "元")
        } else {
          playerdata.seeds += parseInt(howMuch)
          playerdata.stats.seeds += parseInt(howMuch)
          alert("Bought " + howMuch + " PLAIN rice seeds for " + spent + "元!")
        }
        
        gainXP(1, 2)
      }
    } else {
      alert("Error! Please try again.")
    }
  } else {
    alert("No money left! Go farm some rice!")
  }
})

shop[2].addEventListener("click", function tradee() {
  if (playerdata.unlocked.brown[1] == true) {
    if (playerdata.selectSeeds >= 5) {let howMuch = prompt("How many BROWN SEEDS would you like to trade for? 5 select = 1 brown")
    if (Number.isInteger(parseFloat(howMuch))) {
      if (parseInt(howMuch) * 5 > playerdata.selectSeeds || parseInt(howMuch) < 1) {
        alert("Error! Please try again.")
      } else {
        let spent = round2(parseInt(howMuch) * 5)
        playerdata.selectSeeds -= spent
          let amt = parseInt(howMuch)
          playerdata.brownSeeds += amt
          playerdata.stats.brownSeeds += amt
          alert("Bartered " + spent + " Select seeds for " + amt + " Brown seeds!")
          
          gainXP(1, 2)
        }
    } else {
      alert("Error! Please try again.")
    }} else {
      alert("Not enough select seeds! Go buy some!")
    }
  } else {
    alert("Not unlocked yet!")
  }
})

shop[8].addEventListener("click", function buyland() {
  if (playerdata.xpLevel >= 5) {
    if (playerdata.money >= 350) {
      if (playerdata.tiles < 9) {
        let yesland = confirm("Are you sure you want to buy a plot of land for 350元? Press ok to proceed...")
    if (yesland) {
      alert("A plot of land purchased for 350元.")
      playerdata.tiles += 1
      playerdata.stats.tiles += 1
      playerdata.money -= 350
      playerdata.stats.spent += 350
      gainXP(5, 7)
      
      updateTiles()
    } else {
      alert("Land purchase cancelled.")
    }
      } else {
        alert("Max amount of land purchased!")
      }
    } else {
      alert("Not enough money! Need 350元.")
    }
  } else {
    alert("Not unlocked yet!")
  }
})

shop[6].addEventListener("click", function buyElBoost() {
  if (playerdata.money >= 1.5) {
    let howMuch = prompt("Please write how much fertilizer you would like to buy (1 fertilizer for 1.5元):")
    if (Number.isInteger(parseFloat(howMuch))) {
      if (parseInt(howMuch) < 1 || parseInt(howMuch) * 1.5 > playerdata.money) {
        alert("Error! Please try again.")
      } else {
        let spent = parseInt(howMuch) * 1.5
        playerdata.money = playerdata.money - spent
        playerdata.stats.spent += spent
        playerdata.fertile += parseInt(howMuch)
        playerdata.stats.fertile += parseInt(howMuch)
        gainXP(2, 3)
        
        alert("Purchased " + howMuch + " fertilizer for " + spent + "元!")
      }
    } else {
      alert("Error! Please try again.")
    }
  } else {
    alert("Not enough money! You need at least 1.5元.")
  }
})

shop[4].addEventListener("click", function buyWater() {
  if (playerdata.money > 0) {
    let howMuch = prompt("How many liters of WATER do you wish to buy? 1元 = 2 liters of water.")
    if (Number.isInteger(parseFloat(howMuch))) {
      if (parseInt(howMuch) / 2 > playerdata.money || parseInt(howMuch) < 1) {
        alert("Error! Please try again.")
      } else {
        let spent = round2(parseInt(howMuch) / 2)
        playerdata.money -= spent
        playerdata.stats.spent += spent
        playerdata.water += parseInt(howMuch)
        playerdata.stats.water += parseInt(howMuch)
        gainXP(1, 2)
        
        alert("Bought " + howMuch + " liters of water for " + spent + "元!")
      }
    } else {
      alert("Error! Please try again.")
    }
  } else {
    alert("No money left! Go farm some rice!")
  }
})

