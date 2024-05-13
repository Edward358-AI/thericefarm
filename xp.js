// below code credit to @Dodge1, excellent developer highly recommend you check out his farming sim

const XP_DIVISIONS = 10;
const XP_TO_LEVEL_UP_MULTIPLIER = 1.25;
const initialXPRequired = 100;




function gainXP(min, max) {
  const xpGained = Math.floor(Math.random() * (parseInt(max) - parseInt(min))) + parseInt(min);
  playerdata.xp += xpGained;
  while (playerdata.xp >= calculateRequiredXP()) {
    playerdata.xp -= calculateRequiredXP();
    levelUp();
  }

  updateXPBar();
}

window.onload = updateXPBar()

function calculateRequiredXP() {
  return Math.ceil(initialXPRequired * Math.pow(XP_TO_LEVEL_UP_MULTIPLIER, playerdata.xpLevel - 1));
}

function levelUp() {
  playerdata.xpLevel = Math.min(playerdata.xpLevel + 1);
  playerdata.xp = 0
  document.getElementById('xpLevel').innerText = `${playerdata.xpLevel}`;
  playerdata.stats.money += 20*playerdata.xpLevel
  playerdata.money += 20*playerdata.xpLevel
  dialog("Level Up! +" + 20*playerdata.xpLevel + "元")
}

function updateXPBar() {
  const xpBar = document.getElementById('xpBar');
  const filledXP = document.getElementById('filledXP');
  const xpPercentage = (playerdata.xp / calculateRequiredXP()) * 100;
  filledXP.style.width = `${xpPercentage}%`;
  const xpLevelEl = document.getElementById('xpLevel').innerText = `${playerdata.xpLevel}`
}

// Function to display XP info on hover
function showXPInfo() {
  const xpLevelEl = document.getElementById('xpLevel');
  const requiredXP = calculateRequiredXP();
  xpLevelEl.innerText = `${playerdata.xpLevel} (Current XP: ${playerdata.xp}/${requiredXP})`;
}

// Function to restore XP level on mouseout
function hideXPInfo() {
  const xpLevelEl = document.getElementById('xpLevel');
  xpLevelEl.innerText = `${playerdata.xpLevel}`;
}

// Attach hover and mouseout events to the XP bar container
const xpBarContainer = document.getElementById('xpBarContainer');
xpBarContainer.addEventListener('mouseover', showXPInfo);
xpBarContainer.addEventListener('mouseout', hideXPInfo);
