const submitBtn = document.querySelector("#submit-btn");
const nextBtn = document.querySelector("#next-btn");
const firstPage = document.querySelector(".first-page");
const secondPage = document.querySelector(".second-page");
const cancelBtn = document.querySelector("#form-cancel");
let prev = "";
let cancel = 0;

var currentURL = window.location.href;

const parBag = currentURL.split("/");

// Get the last segment, which should be 'bdn23232' - bag ID
const parB = parSegments[parBag.length - 1];

function selectColor(color, item) {
  let selectedColor = document.querySelector("#selectedColor");
  console.log("prev color: ", selectedColor.value);
  selectedColor.value = color;
  console.log("input color: ", selectedColor.value);

  if (prev) {
    console.log("prev", prev);
    prev.style.border = "none";
  }

  prev = item;
  item.style.border = `1px solid var(--main-blue)`;
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
  } else {
    window.location.href = `/home`;
  }
}

submitBtn.addEventListener("click", async function (e) {
  // your code here
  e.preventDefault();

  const addbagForm = document.forms.addbagForm;
  const formData = new FormData(addbagForm);

  const bagname = addbagForm.elements.bagname.value.trim();
  const bagweight = addbagForm.elements.weight.value.trim();
  console.log("bagname: ", bagname);

  if (!bagname) {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Bag name is required!",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }

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

  console.log(json);
  result = await add_bag(json);
  console.log("result", result);
});

async function add_bag(json) {
  const response = await fetch(/ab/, {
    method: "POST",
    body: json,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status == 200) {
    let redirect = await response.json();
    let redirectData = redirect.bag;

    Swal.fire({
      position: "center",
      icon: "success",
      title: "Bag created",
      showConfirmButton: false,
      timer: 1500,
    });

    console.log("redirect", redirectData);

    setTimeout(function () {
      window.location.href = `/bag/${redirectData}`;
    }, 1500);
  } else {
    console.log("server error occurred");
  }
}

// To PASS TEST
// function add_bag(id, bagtype, weight, color, five, six, seven, eight, nine) {
//   return 200;
// }
