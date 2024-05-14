changename.addEventListener("click", () => {
  let newName = prompt('What is your new name?')
  if (newName != "") {
    farmerName = newName
    localStorage.setItem('name',farmerName)
    welcome.innerHTML = `Welcome to your farm, Peasant ${farmerName}!`
  } else {
    alert("Please input something.")
  }
})

deleteData.addEventListener("click", function deleteThingy() {
  let wantToDelete = confirm("WARNING! You are now about to delete all your data associated with this game. Click OK to continue, and if you didn't mean to do this, click Cancel.")
  if (wantToDelete == true) {
    alert("Your data was successfully cleared.")
    localStorage.clear()
    window.location = window.location
  } else {
    alert("Your data was not cleared.")
  }
})

mansave.addEventListener("click", function manualSave() {
  dialog("Your data has been saved")
  localStorage.setItem("playerdata", JSON.stringify(playerdata))
})


usefert.addEventListener("change", function checkfert() {
  if (playerdata.fertile > 0 && usefert.value == "true") {
    dialog("Fertilizer activated!")
    hasFertile = true
  } else {
    dialog("Fertilizer deactivated!")
    hasFertile = false
  }
})

choosing.addEventListener("change", () => {
  for (let each of rices) {
    if (each.type != choosing.value) {
      each.using = false
    } else {
      each.using = true
    }
  }
})