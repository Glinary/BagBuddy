const dropZone = document.querySelector(".addItem-mid");
const itemPool = document.querySelector(".float-items-wrapper");
const itemBox = document.querySelector(".float-item-box");
const instruct = document.querySelector(".instruct");

let flag = 0;
let repeat = 10;

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");

  // if not fellow item, drop item to the div
  if (!ev.target.closest(".dItem-section")) {
    ev.target.appendChild(document.getElementById(data));
    checkDropZone();
  } else {
    // Prevent the drop on fellow item
    ev.preventDefault();
  }
}

function DClicked(item) {
  let itemParent = item.parentNode;

  instruct.style.display = "none";

  // if not yet in dropzone, add.
  if (itemParent != dropZone) {
    dropZone.appendChild(item);
    checkDropZone();
  } else {
    // else, allow item to go back to item pool
    itemPool.appendChild(item);
    checkDropZone();
  }
}

let DChild = 0;

function checkDropZone() {
  DChild = dropZone.childElementCount;

  // if dropzone is empty
  if (DChild == 0) {
    instruct.innerHTML = `Click or drag item here to add into the bag`;
    instruct.style.display = "block";
  } else {
    showInstruct();
  }
}

function showInstruct() {
  // dropzone is not empty and 10 items in.
  if (DChild > 0 && repeat % 10 == 0) {
    // only show every after 10 added items
    instruct.innerHTML = `Click item to remove`;
    instruct.style.display = "block";

    // hide text after 1.5s
    setTimeout(function () {
      instruct.style.display = "none";
    }, 1500);
  }

  repeat += 1;
}
