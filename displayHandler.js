let typeCheck = document.getElementById("types-window");
let distributorCheck = document.getElementById("manufacturerEl-window");
let itemCheck = document.getElementById("item-window");

let typeDiv = document.getElementsByClassName("types-window")[0];
let distributorDiv = document.getElementsByClassName("manufacturerEl-window")[0];
let itemDiv = document.getElementsByClassName("item-window")[0];

typeCheck.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
      typeDiv.style.display = "block";
  } else {
      typeDiv.style.display = "none";
  }
})

distributorCheck.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
      distributorDiv.style.display = "block";
  } else {
      distributorDiv.style.display = "none";
  }
})

itemCheck.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
      itemDiv.style.display = "block";
  } else {
      itemDiv.style.display = "none";
  }
})