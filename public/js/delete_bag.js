const editBtn = document.querySelector(".edit");
const editBtnOption = document.querySelector(".edit-option-box");
const editIcon = document.querySelector(".inside-bag-edit");
const deleteBtn = document.querySelector("#edit-delete-btn");
const shareBtn = document.querySelector("#edit-share-btn");
const confirmBox = document.querySelector(".confirm-delete");
const confirmDeleteBtn = document.querySelector("#confirm-ok");
const cancelDeleteBtn = document.querySelector("#confirm-cancel");
const bagdate = document.querySelector(".inside-bag-sched1");
const collabDiv = document.querySelector(".inside-bag-shared");

var currentURL = window.location.href;
var resCode = 0;

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

  const response = await fetch(`/db`, {
    method: "POST",
    body: JSON.stringify(bagToDelete),
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log("response: ", response.status);

  if (response.status == 200 && resCode == 200) {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Bag deleted",
      showConfirmButton: false,
      timer: 1500,
    });

    setTimeout(function () {
      window.location.href = `/home`;
    }, 1500);
  } else {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Page does not exist",
      text: "go back to main page?",
      showConfirmButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("User confirmed!");
        window.location.href = "/home";
      }
    });
  }
});

// share bag
shareBtn.addEventListener("click", async function () {
  console.log("------SHARE BAG JS------");
  console.log("bag from HTML: ", bag);

  let bagToShare = {
    bag: bag,
  };

  const response = await fetch(`/sb`, {
    method: "POST",
    body: JSON.stringify(bagToShare),
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log("response: ", response.status);

  if (response.status == 200 && resCode == 200) {
    const responseData = await response.json();
    const link = responseData.sharelink; // Assuming your backend sends the link in the response


    var textarea = document.createElement("textarea");
    textarea.value = link;
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, 99999);

    try {
      document.execCommand("copy");
      Swal.fire({ 
        position: "center",
        icon: "success",
        title: "Join Code Generated",
        html: `<span style='font-size: 20px;'>Congratulations! Share this ID to start packing with your friends.<br>${link}</span>`,
        showConfirmButton: true
      });
    } catch(err) {
      console.error("Unable to copy to clipboard", err);
    } finally {
      document.body.removeChild(textarea);
    }
  } else {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Page does not exist",
      text: "go back to main page?",
      showConfirmButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("User confirmed!");
        window.location.href = "/home";
      }
    });
  }
});

/*
 *  -------------------------------------------------------------------- SCHED backend
 */

onload();

async function onload() {
  console.log("-----ONLOAD()------");

  try {
    const { sched, collab, user } = await findBagDateCollab();

    console.log("Bag Date: ", sched);

    if (sched == null) {
      bagdate.children[1].innerText = "Not Scheduled";
    } else {
      bagDate = new Date(sched);

      const dateOptions = { month: "long", day: "numeric", year: "numeric" };
      const formattedDate = bagDate.toLocaleString("en-US", dateOptions);
      bagdate.children[1].innerText = formattedDate;
    }

    console.log("collab", collab);

    if (collab.length >= 1) {
      if (collab.length < 3) {
        collabDiv.innerHTML += `<div class="inside-bag-round center hoverText"><span class="tooltip-text" id="top">${"you"}</span><img src="${user.avatar}" alt=""></div>`;
        for (i = 0; i < collab.length; i++) {
          collabDiv.innerHTML += `<div class="inside-bag-round center hoverText"><span class="tooltip-text" id="top">${collab[i].name}</span><img src="${collab[i].avatar}" alt="/static/images/boy.png"></div>`;
        }
      } else {
        let j = 0;
        collabDiv.innerHTML += `<div class="inside-bag-round center hoverText"><span class="tooltip-text" id="top">${"you"}</span><img src="${user.avatar}" alt=""></div>`;
        
        let collabNames = "";
        for (k = 1; k < collab.length; k++) {
          collabNames += collab[k].name + "\n";
        }

        while (j < 1) {
          collabDiv.innerHTML += `<div class="inside-bag-round center hoverText"><span class="tooltip-text" id="top">${collab[j].name}</span><img src="${collab[j].avatar}" alt=""></div>`;
          j++;
        }
        collabDiv.innerHTML += ` <div id="shared-more" class="inside-bag-round center hoverText"><span class="tooltip-text" id="top">${collabNames}</span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M71.925-187.694v-88.922q0-30.923 15.962-55.191 15.961-24.269 42.632-37.764 57.021-27.89 114.674-43.005 57.654-15.115 126.731-15.115t126.73 15.115q57.654 15.115 114.675 43.005 26.671 13.495 42.632 37.764 15.961 24.268 15.961 55.191v88.922H71.925Zm679.997 0v-93.845q0-39.384-19.286-75.069-19.287-35.685-54.712-61.237 40.23 6 76.383 18.577 36.153 12.577 68.999 29.73 31 16.538 47.884 38.984 16.885 22.447 16.885 49.015v93.845H751.922ZM371.924-492.309q-57.749 0-98.874-41.124-41.125-41.125-41.125-98.874 0-57.75 41.125-98.874 41.125-41.125 98.874-41.125 57.749 0 98.874 41.125 41.124 41.124 41.124 98.874 0 57.749-41.124 98.874-41.125 41.124-98.874 41.124Zm345.381-139.998q0 57.749-41.125 98.874-41.125 41.124-98.874 41.124-6.769 0-17.23-1.538t-17.23-3.384q23.662-28.447 36.369-63.117t12.707-72.007q0-37.336-12.961-71.721Q566-738.46 542.846-767.383q8.615-3.077 17.23-4t17.23-.923q57.749 0 98.874 41.125 41.125 41.124 41.125 98.874ZM131.924-247.693h480v-28.923q0-12.538-6.269-22.308-6.27-9.769-19.885-17.077-49.385-25.461-101.692-38.577-52.308-13.115-112.154-13.115T259.77-354.578q-52.307 13.116-101.692 38.577-13.615 7.308-19.885 17.077-6.269 9.77-6.269 22.308v28.923Zm240-304.614q33 0 56.5-23.5t23.5-56.5q0-33-23.5-56.5t-56.5-23.5q-33 0-56.5 23.5t-23.5 56.5q0 33 23.5 56.5t56.5 23.5Zm0 304.614Zm0-384.614Z"/></svg></div>`;
      }
    } else {
      collabDiv.innerHTML += `<div class="inside-bag-round center hoverText"><span class="tooltip-text" id="top">${"you"}</span><img src="${user.avatar}" alt=""></div>`;
    }
  } catch (error) {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Page does not exist",
      text: "go back to main page?",
      showConfirmButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("User confirmed!");
        window.location.href = "/home";
      }
    });
  }
}

// Find bag in database
async function findBagDateCollab() {
  let bagToFind = {
    findbag: parB,
  };

  console.log(bagToFind);

  const response = await fetch(`/fb`, {
    method: "POST",
    body: JSON.stringify(bagToFind),
    headers: {
      "Content-Type": "application/json",
    },
  });

  resCode = response.status;

  if (resCode == 200) {
    let resBag = await response.json();
    let sched = resBag.bagDate;
    let collab = resBag.bagCollab;
    let user = resBag.currentUser;
    return { sched: sched, collab: collab, user: user };
  } else {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Page does not exist",
      text: "go back to main page?",
      showConfirmButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("User confirmed!");
        window.location.href = "/home";
      }
    });
  }
}
