const editOptBtn = document.querySelector("#edit-edit-btn");
let selectedColor = document.querySelector("#selectedColor");
const saveBtn = document.querySelector("#save-btn");

const nextBtn = document.querySelector("#next-btn");
const firstPage = document.querySelector(".first-page");
const secondPage = document.querySelector(".second-page");
const cancelBtn = document.querySelector("#form-cancel");

let savedColor = selectedColor.value;
let prev = "";
let cancel = 0;

switch (savedColor) {
  case "#000000":
    let blackColor = document.querySelector("#form-bag-bg-black");
    blackColor.style.border = `1px solid var(--main-blue)`;
    prev = blackColor;
    break;
  case "#A43627":
    let redColor = document.querySelector("#form-bag-bg-red");
    redColor.style.border = `1px solid var(--main-blue)`;
    prev = redColor;
    break;
  case "#1F4F24":
    let greenColor = document.querySelector("#form-bag-bg-green");
    greenColor.style.border = `1px solid var(--main-blue)`;
    prev = greenColor;
    break;

  default:
    let customColor = document.querySelector("#form-choose-color");
    customColor.value = savedColor;
    prev = customColor;
    break;
}

function selectColor(color, item) {
  let selectedColor = document.querySelector("#selectedColor");
  console.log("input color: ", selectedColor.value);
  selectedColor.value = color;
  console.log("input color: ", selectedColor.value);

  if (prev) {
    console.log("prev", prev);
    prev.style.border = "none";
  }

  prev = item;
  item.style.border = `1px solid var(--main-blue)`;
  console.log("item", item);
}

function selectCustomColor(item) {
  let selectedColor = document.querySelector("#selectedColor");
  selectedColor.value = item.value;
  console.log("input custom color: ", item.value);

  if (prev) {
    console.log("prev", prev);
    prev.style.border = "none";
  }

  prev = item;
}

function form_next() {
  firstPage.style.display = "none";
  secondPage.style.display = "block";
  nextBtn.style.display = "none";

  console.dir(cancelBtn);
  if (cancel == 0) {
    cancelBtn.textContent = "back";
    cancel = 1;
  }
}

function form_cancel() {
  firstPage.style.display = "block";
  secondPage.style.display = "none";
  nextBtn.style.display = "block";

  if (cancel == 1) {
    cancelBtn.textContent = "cancel";
    cancel = 0;
  }
}

onload();

async function onload() {
  const bagSched = await findBag();

  const dateClass = document.querySelector("#date");
  console.log("Bag Date: ", bagSched);

  if (bagSched != undefined) {
    const dateFormat = new Date(bagSched).toISOString().split("T")[0];
    dateClass.value = dateFormat;
  }
}

saveBtn.addEventListener("click", async function (e) {
  // your code here
  e.preventDefault();

  const addbagForm = document.forms.addbagForm;
  const formData = new FormData(addbagForm);

  for (const entry of formData.entries()) {
    console.log(entry);
  }

  // Translate the FormData object to a JS object
  const data = {};
  for (const entry of formData.entries()) {
    data[entry[0]] = entry[1];
  }

  // Serialize the JS object into JSON string
  const json = JSON.stringify(data);
  await edit_bag(json);
});

async function edit_bag(json) {
  const userIDClass = document.querySelector("#userid");
  const userID = userIDClass.value;
  const response = await fetch(`/eb`, {
    method: "POST",
    body: json,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 200) {
    let redirectedData = await response.json();
    let redirectLink = redirectedData.bagid;
    window.location.href = `http://localhost:3000/bag/${userID}/${redirectLink}`;
  }
}

// Find bag in database
async function findBag() {
  const bagidClass = document.querySelector("#bagID");
  const bagID = bagidClass.value;

  let bagToFind = {
    findbag: bagID,
  };

  console.log("BD", bagToFind);
  const response = await fetch(`/fb`, {
    method: "POST",
    body: JSON.stringify(bagToFind),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status == 200) {
    let resBag = await response.json();
    let bag = resBag.bagDate;
    console.log("FoundBag: ", bag);
    return bag;
  }
}
