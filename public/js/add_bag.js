// const submitBtn = document.querySelector("#submit-btn");
// let prev = "";

// function selectColor(color, item) {
//   let selectedColor = document.querySelector("#selectedColor");
//   console.log("input color: ", selectedColor.value);
//   selectedColor.value = color;
//   console.log("input color: ", selectedColor.value);

//   if (prev) {
//     console.log("prev", prev);
//     prev.style.border = "none";
//   }

//   prev = item;
//   item.style.border = `1px solid var(--main-blue)`;
// }

// submitBtn.addEventListener("click", async function (e) {
//   // your code here
//   e.preventDefault();

//   const addbagForm = document.forms.addbagForm;
//   const formData = new FormData(addbagForm);

//   for (const entry of formData.entries()) {
//     console.log(entry);
//   }

//   // Translate the FormData object to a JS object
//   const data = {};
//   for (const entry of formData.entries()) {
//     data[entry[0]] = entry[1];
//   }

//   // Serialize the JS object into JSON string
//   const json = JSON.stringify(data);

//   console.log(json);
//   result = await add_bag(json);
//   console.log("result", result);
// });

function add_bag(id, bagtype, weight, color, five, six, seven, eight, nine) {
  // json = JSON.stringify(json1);
  // const response = await fetch("/ab", {
  //   method: "POST",
  //   body: json,
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });

  // if (response.status == 200) {
  //   console.log("HERE");
  //   let redirect = await response.json();
  //   let redirectData = redirect.bag;
  //   console.log("redirect", redirectData);
  //   // window.location.href = `http://localhost:3000/bag/${redirectData}`;
  //   return 200;
  // } else {
  //   console.log("server error occurred");
  // }
  return 200;
}

// async function addTheBag(json) {
//   const response = await fetch("/ab", {
//     method: "POST",
//     body: json,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   if (response.status == 200) {
//     let bagId = response.text;
//     response.redirect;
//     `http://localhost:3000/insidebag/${bagId}`;
//     response.sendStatus;
//     200;
//     return 200;
//   } else {
//     console.log("server error occurred");
//   }
// }

module.exports = { add_bag };
