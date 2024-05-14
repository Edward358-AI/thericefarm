// the technical part of the rice farming game
var startup = document.getElementById("startup")
var stats = document.getElementById("stats")
var game = document.getElementById("game")
var tiles = document.getElementById("tiles")
var fertilizer = document.getElementById("fertilizer")
var moneyAmount = document.getElementById("money")
var changename = document.getElementById("namechange")
var choosing = document.getElementById("choosing")
var shop = document.getElementsByClassName("shop")[0].children
var science = document.getElementsByClassName("science")[0].children
var riceAmount = document.getElementById("riceamount")
var waterAmount = document.getElementById("water")
var sellRice = document.getElementById("sell")
var hasFertile = false
var seeds = true
var deleteData = document.getElementById("delete")
var usefert = document.getElementById("usefert")
var mansave = document.getElementById("manualsave")
var welcome = document.getElementById("welcomename")
var formName = document.getElementById("name")
var intro = document.getElementById("introduction")
var achieves = document.getElementsByClassName("achievestats")[0]
var research = document.getElementById("research")
var farmerNames = ["Liu 刘", "Jiang 蒋", "Wang 王", "Zhang 张", "Li 李", "Chen 陈", "Yang 杨", "Huang 黄", "Zhao 赵"]
var greetings = ["Hope your hands aren't too full today.", "Hope your farm is doing well right now.", "Hope you are busy at work so far."]
function round2(num) {
  return Math.round(num * 100) / 100
}
function elt(type, attrs, inner, children) {
  let node = document.createElement(type);
  if (typeof attrs === "object") {
    for (let key in attrs) {
      node.setAttribute(key, attrs[key])
    }
  }
  if (typeof inner === "string") {
    node.innerHTML = inner
  }
  if (Array.isArray(children)) {
    children.forEach(item => { if (typeof item === "object") node.appendChild(item); else node.appendChild(document.createElement(item)) })
  } else if (typeof children === "object") {
    for (let child in children) {
      let aChild = document.createElement(child)
      aChild.innerHTML = children[child]
      node.appendChild(aChild)
    }
  }
  return node;
}
Object.defineProperties(Array.prototype, {
  count: {
    value: function(value) {
      return this.filter(x => x === value).length;
    }
  }
});
// the array chances has 2048 individual items—a reference to the game '2048', and the max reward is 2048
var chances = [2048]
for (let i = 0; i < 52; i++) {
  chances.push(1)
}
for (let i = 0; i < 1924; i++) {
  chances.push(2)
}
for (let i = 0; i < 64; i++) {
  chances.push(4)
}
for (let i = 0; i < 7; i++) {
  chances.push(69)
}
function chance(successChance) {
  return Math.random() < successChance
}
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}
shuffle(chances)


class Rice {
  constructor(type, seconds, extra, using, mutationChance, success) {
    this.type = type
    this.seconds = seconds
    this.extra = extra
    this.using = using
    this.mutationChance = mutationChance
    this.success = success
  }
  get cropYield() {
    return this.calcYield()
  }
  calcYield() {
    if (chance(success)) {
      let total = chances[Math.floor(Math.random() * chances.length)] + this.extra
      while (total < 0) {
        total = chances[Math.floor(Math.random() * chances.length)] + this.extra
      }
      return total
    } else {
      dialog("Crop failure!")
      return 0
    }
  }
}


var plain = new Rice("plain", 5, 0, false, 1)
var select = new Rice("select", 7, 4, false, 0.15, 1)
var brown = new Rice("brown", 9, 2, false, 0.015, 0.9)
var gold = new Rice("gold", 11, -1, false, 0.2)
var rices = [plain, select, brown, gold]
