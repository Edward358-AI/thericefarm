// Settings and UI Controls

changename.addEventListener("click", async () => {
  const newName = await gamePrompt(
    "👤 Change Name",
    "What would you like your new farmer name to be?",
    "Enter new name...",
    farmerName
  );
  if (newName != "" && newName != null) {
    farmerName = newName;
    localStorage.setItem('name', farmerName);
    welcome.innerHTML = `Welcome to your farm, ${playerdata.rank} ${farmerName}!`;
    dialog(`Name changed to ${farmerName}!`);
  }
});

deleteData.addEventListener("click", async function deleteThingy() {
  const wantToDelete = await gameConfirm(
    "⚠️ Delete All Data",
    "<b style='color: #ff6666;'>WARNING!</b><br><br>You are about to <b>permanently delete</b> all your game progress.<br><br>This action cannot be undone!",
    "Delete Everything",
    "Cancel"
  );
  if (wantToDelete == true) {
    dialog("Your data was successfully cleared.");
    localStorage.clear();
    setTimeout(() => {
      window.location = window.location;
    }, 1000);
  } else {
    dialog("Your data was not cleared.");
  }
});

mansave.addEventListener("click", function manualSave() {
  dialog("Your data has been saved");
  localStorage.setItem("playerdata", JSON.stringify(playerdata));
});

usefert.addEventListener("change", function checkfert() {
  if (playerdata.fertile > 0 && usefert.value == "true") {
    dialog("Fertilizer activated!");
    hasFertile = true;
  } else {
    dialog("Fertilizer deactivated!");
    hasFertile = false;
  }
});

// Initialize hasFertile on page load based on saved select value
if (playerdata.fertile > 0 && usefert.value === "true") {
  hasFertile = true;
}

// Mutation Switch Toggles
const toggleBrnSwitch = document.getElementById("toggleBrnSwitch");
const toggleGoldSwitch = document.getElementById("toggleGoldSwitch");
const toggleTrueBrnSwitch = document.getElementById("toggleTrueBrnSwitch");
const toggleTrueGoldSwitch = document.getElementById("toggleTrueGoldSwitch");

// Initialize switch states
function initSwitchToggles() {
  // Brown switch toggle
  if (toggleBrnSwitch) {
    if (playerdata.switches.brnSwitch) {
      toggleBrnSwitch.disabled = false;
      toggleBrnSwitch.checked = playerdata.switches.brnSwitchActive || false;
    } else {
      toggleBrnSwitch.disabled = true;
      toggleBrnSwitch.checked = false;
    }

    toggleBrnSwitch.addEventListener("change", () => {
      if (playerdata.switches.brnSwitch) {
        playerdata.switches.brnSwitchActive = toggleBrnSwitch.checked;
        dialog(toggleBrnSwitch.checked ? "Better → Brown mutations enabled!" : "Better → Brown mutations disabled!");
        updateSwitchToggles();
      }
    });
  }

  // Gold switch toggle
  if (toggleGoldSwitch) {
    if (playerdata.switches.goldSwitch) {
      toggleGoldSwitch.disabled = false;
      toggleGoldSwitch.checked = playerdata.switches.goldSwitchActive || false;
    } else {
      toggleGoldSwitch.disabled = true;
      toggleGoldSwitch.checked = false;
    }

    toggleGoldSwitch.addEventListener("change", () => {
      if (playerdata.switches.goldSwitch) {
        playerdata.switches.goldSwitchActive = toggleGoldSwitch.checked;
        dialog(toggleGoldSwitch.checked ? "Brown → Gold mutations enabled!" : "Brown → Gold mutations disabled!");
        updateSwitchToggles();
      }
    });
  }

  // True → Brown switch toggle
  if (toggleTrueBrnSwitch) {
    if (playerdata.switches.trueBrnSwitch) {
      toggleTrueBrnSwitch.disabled = false;
      toggleTrueBrnSwitch.checked = playerdata.switches.trueBrnSwitchActive || false;
    } else {
      toggleTrueBrnSwitch.disabled = true;
      toggleTrueBrnSwitch.checked = false;
    }

    toggleTrueBrnSwitch.addEventListener("change", () => {
      if (playerdata.switches.trueBrnSwitch) {
        playerdata.switches.trueBrnSwitchActive = toggleTrueBrnSwitch.checked;
        dialog(toggleTrueBrnSwitch.checked ? "True → Brown mutations enabled!" : "True → Brown mutations disabled!");
        updateSwitchToggles();
      }
    });
  }

  // True → Gold switch toggle
  if (toggleTrueGoldSwitch) {
    if (playerdata.switches.trueGoldSwitch) {
      toggleTrueGoldSwitch.disabled = false;
      toggleTrueGoldSwitch.checked = playerdata.switches.trueGoldSwitchActive || false;
    } else {
      toggleTrueGoldSwitch.disabled = true;
      toggleTrueGoldSwitch.checked = false;
    }

    toggleTrueGoldSwitch.addEventListener("change", () => {
      if (playerdata.switches.trueGoldSwitch) {
        playerdata.switches.trueGoldSwitchActive = toggleTrueGoldSwitch.checked;
        dialog(toggleTrueGoldSwitch.checked ? "True → Gold mutations enabled!" : "True → Gold mutations disabled!");
        updateSwitchToggles();
      }
    });
  }
}

// Update switch toggles when switches are purchased
function updateSwitchToggles() {
  // Brown switch
  const brnStatus = document.getElementById('brnSwitchStatus');
  if (toggleBrnSwitch && brnStatus) {
    if (playerdata.switches.brnSwitch) {
      toggleBrnSwitch.disabled = false;
      if (toggleBrnSwitch.checked) {
        brnStatus.textContent = '✓ Active';
        brnStatus.className = 'switch-status active';
      } else {
        brnStatus.textContent = '○ Inactive';
        brnStatus.className = 'switch-status inactive';
      }
    } else if (playerdata.unlocked.brnSwitch) {
      brnStatus.textContent = '◇ Available';
      brnStatus.className = 'switch-status available';
    } else {
      brnStatus.textContent = '🔒 Locked';
      brnStatus.className = 'switch-status locked';
    }
  }

  // Gold switch
  const goldStatus = document.getElementById('goldSwitchStatus');
  if (toggleGoldSwitch && goldStatus) {
    if (playerdata.switches.goldSwitch) {
      toggleGoldSwitch.disabled = false;
      if (toggleGoldSwitch.checked) {
        goldStatus.textContent = '✓ Active';
        goldStatus.className = 'switch-status active';
      } else {
        goldStatus.textContent = '○ Inactive';
        goldStatus.className = 'switch-status inactive';
      }
    } else if (playerdata.unlocked.goldSwitch) {
      goldStatus.textContent = '◇ Available';
      goldStatus.className = 'switch-status available';
    } else {
      goldStatus.textContent = '🔒 Locked';
      goldStatus.className = 'switch-status locked';
    }
  }

  // True → Brown switch
  const trueBrnStatus = document.getElementById('trueBrnSwitchStatus');
  if (toggleTrueBrnSwitch && trueBrnStatus) {
    if (playerdata.switches.trueBrnSwitch) {
      toggleTrueBrnSwitch.disabled = false;
      if (toggleTrueBrnSwitch.checked) {
        trueBrnStatus.textContent = '✓ Active';
        trueBrnStatus.className = 'switch-status active';
      } else {
        trueBrnStatus.textContent = '○ Inactive';
        trueBrnStatus.className = 'switch-status inactive';
      }
    } else if (playerdata.unlocked.trueSeed) {
      trueBrnStatus.textContent = '◇ Available';
      trueBrnStatus.className = 'switch-status available';
    } else {
      trueBrnStatus.textContent = '🔒 Locked';
      trueBrnStatus.className = 'switch-status locked';
    }
  }

  // True → Gold switch
  const trueGoldStatus = document.getElementById('trueGoldSwitchStatus');
  if (toggleTrueGoldSwitch && trueGoldStatus) {
    if (playerdata.switches.trueGoldSwitch) {
      toggleTrueGoldSwitch.disabled = false;
      if (toggleTrueGoldSwitch.checked) {
        trueGoldStatus.textContent = '✓ Active';
        trueGoldStatus.className = 'switch-status active';
      } else {
        trueGoldStatus.textContent = '○ Inactive';
        trueGoldStatus.className = 'switch-status inactive';
      }
    } else if (playerdata.unlocked.trueSeed) {
      trueGoldStatus.textContent = '◇ Available';
      trueGoldStatus.className = 'switch-status available';
    } else {
      trueGoldStatus.textContent = '🔒 Locked';
      trueGoldStatus.className = 'switch-status locked';
    }
  }
}

// Initialize on load
initSwitchToggles();
updateSwitchToggles();