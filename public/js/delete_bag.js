const editBtn = document.querySelector(".edit");
const editBtnOption = document.querySelector(".edit-option-box");
const editIcon = document.querySelector(".inside-bag-edit");
const deleteBtn = document.querySelector("#edit-delete-btn");
const confirmBox = document.querySelector(".confirm-delete");
const confirmDeleteBtn = document.querySelector("#confirm-ok");
const cancelDeleteBtn = document.querySelector("#confirm-cancel");
const bagdate = document.querySelector(".inside-bag-sched1");

var currentURL = window.location.href;

const parBag = currentURL.split("/");

// Get the last segment, which should be 'bdn23232' - bag ID
const parB = parSegments[parBag.length - 1];

let bag = deleteBtn.dataset.bagid;
let editFlag = 0;

// toggle settings option
function editBagBtn() {
  if (editFlag == 0) {
    editBtnOption.style.display = "block";
    editIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m336-280-56-56 144-144-144-143 56-56 144 144 143-144 56 56-144 143 144 144-56 56-143-144-144 144Z"/></svg>`;
    editFlag = 1;
  } else {
    editBtnOption.style.display = "none";
    editIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m387.694-100.001-15.231-121.846q-16.077-5.385-32.962-15.077-16.885-9.693-30.193-20.77l-112.846 47.692L104.156-370l97.615-73.769q-1.385-8.923-1.962-17.923-.577-9-.577-17.923 0-8.539.577-17.347.577-8.808 1.962-19.269L104.156-590l92.306-159.229 112.461 47.308q14.462-11.462 30.885-20.962 16.424-9.501 32.27-15.27l15.616-121.846h184.612l15.231 122.231q18 6.538 32.578 15.269 14.577 8.731 29.423 20.578l114-47.308L855.844-590l-99.153 74.922q2.154 9.693 2.346 18.116.192 8.423.192 16.962 0 8.154-.384 16.577-.385 8.423-2.77 19.27L854.46-370l-92.307 159.998-112.615-48.077q-14.846 11.847-30.308 20.962-15.462 9.116-31.693 14.885l-15.231 122.231H387.694ZM440-160h78.615L533-267.154q30.615-8 55.961-22.731 25.346-14.73 48.885-37.884L737.231-286l39.384-68-86.769-65.385q5-15.538 6.808-30.461 1.807-14.923 1.807-30.154 0-15.615-1.807-30.154-1.808-14.538-6.808-29.692L777.385-606 738-674l-100.539 42.385q-20.076-21.462-48.115-37.923-28.039-16.462-56.731-23.308L520-800h-79.385l-13.23 106.769q-30.616 7.231-56.539 22.154-25.923 14.923-49.461 38.462L222-674l-39.385 68L269-541.615q-5 14.23-7 29.615-2 15.385-2 32.385Q260-464 262-449q2 15 6.615 29.615l-86 65.385L222-286l99-42q22.769 23.385 48.692 38.308 25.923 14.923 57.308 22.923L440-160Zm40.461-200.001q49.923 0 84.961-35.038Q600.46-430.078 600.46-480t-35.038-84.961q-35.038-35.038-84.961-35.038-50.537 0-85.268 35.038-34.73 35.039-34.73 84.961t34.73 84.961q34.731 35.038 85.268 35.038ZM480-480Z"/></svg>`;
    editFlag = 0;
  }
}

/*
 *  -------------------------------------------------------------------- DELETE backend
 */

// click delete
deleteBtn.addEventListener("click", function () {
  confirmBox.style.display = "flex";
});

// cancel delete
cancelDeleteBtn.addEventListener("click", function () {
  confirmBox.style.display = "none";
});

// confirm delete
confirmDeleteBtn.addEventListener("click", async function () {
  console.log("------CONFIRM DELETE------");
  console.log("bag from HTML: ", bag);

  let bagToDelete = {
    bag: bag,
  };

  const userIDClass = document.querySelector("#userid");
  const userID = userIDClass.value;
  console.log("value: ", userID);
  const response = await fetch(`/db/${userID}`, {
    method: "POST",
    body: JSON.stringify(bagToDelete),
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log("response: ", response.status);

  if (response.status == 200) {
    console.log("redirect to home");
    window.location.href = `/home/${userID}`;
  }
});

/*
 *  -------------------------------------------------------------------- SCHED backend
 */

onload();

async function onload() {
  console.log("-----ONLOAD()------");
  const bagSched = await findBagDate();

  console.log("Bag Date: ", bagSched);

  if (bagSched == undefined) {
    bagdate.children[1].innerText = "Not Scheduled";
  } else {
    bagDate = new Date(bagSched);

    const dateOptions = { month: "long", day: "numeric", year: "numeric" };
    const formattedDate = bagDate.toLocaleString("en-US", dateOptions);

    bagdate.children[1].innerText = formattedDate;
  }
}

// Find bag in database
async function findBagDate() {
  let bagToFind = {
    findbag: parB,
  };
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
    return bag;
  }
}
