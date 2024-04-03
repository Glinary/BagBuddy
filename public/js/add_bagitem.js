const dropZone = document.querySelector(".addItem-mid");
const itemPool = document.querySelector(".float-items-wrapper");
const itemBox = document.querySelector(".float-item-box");
const instruct = document.querySelector(".instruct");
const itemList = document.querySelectorAll(".dItem-section");

var currentURL = window.location.href;

const parBag = currentURL.split("/");

// Get the last segment, which should be 'bdn23232' - bag ID
const parB = parSegments[parBag.length - 1];
console.log("PARB ", parB);

let itemsList = [];

let flag = 0;
let repeat = 10;

itemsList.push(parB);

onload();

async function onload() {
  console.log("DROPZONE: ", dropZone.childElementCount);

  // onload check all items in bag and display it in dropzone
  const bagItems = await findItems();
  console.log("bagItems: ", bagItems);

  itemPoolChildren = itemPool.childNodes;
  console.log(itemPoolChildren);

  bagAllItems = dropZone.childNodes;
  console.log("Dropzone children: ", bagAllItems);

  bagAllItems.forEach((element) => {
    bagItems.forEach((bagItem) => {
      if (element.id == bagItem) {
        itemPoolChildren.forEach((itemInPool) => {
          if (itemInPool.id == bagItem) {
            itemPool.removeChild(itemInPool);
          }
        });
        itemsList.push(element.id);
      }
    });
  });

  console.log("Item List: ", itemsList);

  // itemList.forEach((element) => {
  //   itemID = element.getAttribute("id");

  //   console.log("current item ID: ", itemID);

  //   bagItems.forEach((bagItemID) => {
  //     console.log("current bagItemID: ", bagItemID);
  //     if (bagItemID == itemID) {
  //       //element.remove();
  //       //dropZone.appendChild(element);
  //       itemsList.push(itemID);
  //     }
  //   });
  // });
  checkDropZone();
}

// Find bag in database
async function findItems() {
  let bagToFind = {
    tofindbag: parB,
  };

  console.log("BD", bagToFind);
  const response = await fetch(`/fbi`, {
    method: "POST",
    body: JSON.stringify(bagToFind),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status == 200) {
    let resBag = await response.json();
    let items = resBag.bagItems;
    return items;
  }
}

async function add_items() {
  const response = await fetch("/ai", {
    method: "POST",
    body: JSON.stringify(itemsList),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status == 200) {
    console.log("HERE");
    let redirect = await response.json();
    let redirectData = redirect.redLink;
    console.log("redirect", redirectData);

    window.location.href = `http://localhost:3000/bag/${redirectData}`;
  } else {
    console.log("server error occurred");
  }
}

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
    console.log("THE ITEM: ", data);
    itemsList.push(data);
    console.log(itemsList);

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
    console.log("THE ITEM: ", item.id);
    itemsList.push(item.id);
    console.log(itemsList);
    checkDropZone();
  } else {
    // else, allow item to go back to item pool
    itemPool.appendChild(item);

    let indexOfItem = itemsList.indexOf(item.id);

    if (indexOfItem !== -1) {
      itemsList.splice(indexOfItem, 1);
      console.log("Item removed");
      console.log("THE ITEM: ", item.id);
    } else {
      console.log("Item not found in the array");
    }
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
