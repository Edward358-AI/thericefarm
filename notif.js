function dialog(message) {
  let dwrap = document.getElementById("dialogs")
  let extraheight = 0
  if (dwrap.hasChildNodes()) {
    for (let i = 0; i < dwrap.children.length; i++) {
      extraheight -= dwrap.children[i].clientHeight
    }
  }
  let x = elt("span", { style: "color:rgb(0, 100, 255);" }, `${message}`)
  let d = elt("div", { onclick: "this.remove();", style: `background:rgb(0, 240, 255);border:1px solid rgb(0, 175, 255);opacity:0.9;top:${extraheight};width:fit-content;padding:10px;text-align:right;display:block;font-family:JetBrains Mono, monospace;border-radius:3px;bottom:5;right: 5;margin-bottom: 5px;float:right;cursor:pointer;` }, undefined, [x])
  d.style.animationName = "fadeout"
  d.style.animationDelay = "5s"
  d.style.animationDuration = "2s"
  d.addEventListener("animationend", function clearDialog() {
    d.remove()
  })
  dwrap.appendChild(d)
}