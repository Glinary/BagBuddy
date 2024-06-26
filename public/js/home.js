const topBar = document.querySelector("#top-sec");
const addItemLink = document.querySelector("#add-item-link");
const lstButton = document.querySelector(".option-lst");
const AddButton = document.querySelector("#add-circle-hide");
const dimPage = document.querySelector(".dim-page");
const addOpHome = document.querySelector("#home-add-op");
const addOpBag = document.querySelector("#bag-add-op");
const addBtnIcon = document.querySelector("#add-main-btn");
const searchBar = document.querySelector(".search-bar-wrapper");
const topBarAct = document.querySelector("#active-header-wrapper");
const searchIcon = document.querySelector("#search-bar-icon");
const searchClose = document.querySelector("#search-close");
const sInput = document.querySelector("#searchBar");

var currentURL = window.location.href;

// Split the pathname into segments using '/' as the delimiter
const parSegments = currentURL.split("/");
// Get the last segment, which should be '12322'
const par = parSegments[parSegments.length - 1];
console.log("PAR: ", par);
console.log("URL: ", currentURL);
let addToggleFlag = 0;

function addButtonToggle() {
  if (addToggleFlag == 0) {
    toggleAddOption();
    addBtnIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>`;
    dimPage.style.display = "block";
    lstButton.style.width = "100%";
    lstButton.style.padding = "0%";
    addToggleFlag = 1;
  } else {
    toggleAddOption();
    addBtnIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>`;
    dimPage.style.display = "none";
    lstButton.style.width = "10%";
    lstButton.style.padding = "0% 17.55% 2% 0%";

    addToggleFlag = 0;
  }
}

function addItemLinkRedirect() {
  window.location.href = `/addItem/${par}`;
}

function addBagRedirect() {
  window.location.href = `/addbag`;
}

searchIcon.addEventListener("click", function () {
  topBarAct.style.display = "none";
  searchBar.style.display = "flex";

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" || event.keyCode === 27) {
      closeSearch();
    }
  });
});

sInput.addEventListener("input", function (e) {
  const bagname = e.target.value;
  console.log(bagname);

  const data = { bagname };

  // Convert the data object to JSON

  const json = JSON.stringify(data);

  console.log(json);

  updateBags(json);

  
});

async function updateBags(jsonData) {
  try {
    const response = await fetch("/getbags", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonData,
    });

    if (response.ok) {
      console.log("-----BAG-----");
      const data = await response.json();
      const bags = data.bags; // Extract the 'bags' array from the received data

      // Log the received data
      console.log("Data received:", bags);

      // Check if bags is an array or an object
      if (Array.isArray(bags)) {
        const container = document.getElementById('container');
        container.innerHTML = '';
        bags.forEach(bag => {
          // Here you can perform operations with each bag object
          console.log("Bag Name:", bag.bagName);
          console.log("Bag Color:", bag.bagColor);
          const bagBox = document.createElement('div');
          bagBox.classList.add('bag-box');

          // Set the innerHTML of the bag box
          bagBox.innerHTML = `
              <div class="bag-icon"><a href="/bag/${bag.encID}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="${bag.bagColor}"><path d="M313.333-213.333h333.334v-66.666H313.333v66.666ZM266.666-80q-27 0-46.833-19.833T200-146.666v-340.001q0-87 47.5-156.333Q295-712.334 370-744.667v-22q0-46 32-79.666Q434-880 480-880t78 33.667q32 33.666 32 79.666v22Q665-712.334 712.5-643 760-573.667 760-486.667v340.001q0 27-19.833 46.833T693.334-80H266.666Zm170.001-684q6.999-1.334 20.333-2 13.333-.667 23-.667t23 .667q13.334.666 20.333 2v-2.667q0-19-12.166-32.833Q499-813.334 480-813.334T448.833-799.5q-12.166 13.833-12.166 32.833V-764ZM406-386.667l74-56 74 56-28-91 74-53h-91l-29-96-29 96h-91l74 53-28 91Z"/></svg></a></div>
              <div class="bag-info-list">
                  <a href="/bag/${bag.encID}"><div class="bag-name">${bag.bagName}</div></a>
                  <div class="bag-info-list2">
                      <div class="baginfolist-item"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="info-item"><path d="M450.001-290.001h59.998V-520h-59.998v229.999ZM480-588.461q13.731 0 23.019-9.288 9.288-9.288 9.288-23.019 0-13.73-9.288-23.019-9.288-9.288-23.019-9.288-13.731 0-23.019 9.288-9.288 9.289-9.288 23.019 0 13.731 9.288 23.019 9.288 9.288 23.019 9.288Zm.067 488.46q-78.836 0-148.204-29.92-69.369-29.92-120.682-81.21-51.314-51.291-81.247-120.629-29.933-69.337-29.933-148.173t29.92-148.204q29.92-69.369 81.21-120.682 51.291-51.314 120.629-81.247 69.337-29.933 148.173-29.933t148.204 29.92q69.369 29.92 120.682 81.21 51.314 51.291 81.247 120.629 29.933 69.337 29.933 148.173t-29.92 148.204q-29.92 69.369-81.21 120.682-51.291 51.314-120.629 81.247-69.337 29.933-148.173 29.933ZM480-160q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg></div>
                      <div class="baginfolist-item"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="info-item"><path d="m387.694-100.001-15.231-121.846q-16.077-5.385-32.962-15.077-16.885-9.693-30.193-20.77l-112.846 47.692L104.156-370l97.615-73.769q-1.385-8.923-1.962-17.923-.577-9-.577-17.923 0-8.539.577-17.347.577-8.808 1.962-19.269L104.156-590l92.306-159.229 112.461 47.308q14.462-11.462 30.885-20.962 16.424-9.501 32.27-15.27l15.616-121.846h184.612l15.231 122.231q18 6.538 32.578 15.269 14.577 8.731 29.423 20.578l114-47.308L855.844-590l-99.153 74.922q2.154 9.693 2.346 18.116.192 8.423.192 16.962 0 8.154-.384 16.577-.385 8.423-2.77 19.27L854.46-370l-92.307 159.998-112.615-48.077q-14.846 11.847-30.308 20.962-15.462 9.116-31.693 14.885l-15.231 122.231H387.694ZM440-160h78.615L533-267.154q30.615-8 55.961-22.731 25.346-14.73 48.885-37.884L737.231-286l39.384-68-86.769-65.385q5-15.538 6.808-30.461 1.807-14.923 1.807-30.154 0-15.615-1.807-30.154-1.808-14.538-6.808-29.692L777.385-606 738-674l-100.539 42.385q-20.076-21.462-48.115-37.923-28.039-16.462-56.731-23.308L520-800h-79.385l-13.23 106.769q-30.616 7.231-56.539 22.154-25.923 14.923-49.461 38.462L222-674l-39.385 68L269-541.615q-5 14.23-7 29.615-2 15.385-2 32.385Q260-464 262-449q2 15 6.615 29.615l-86 65.385L222-286l99-42q22.769 23.385 48.692 38.308 25.923 14.923 57.308 22.923L440-160Zm40.461-200.001q49.923 0 84.961-35.038Q600.46-430.078 600.46-480t-35.038-84.961q-35.038-35.038-84.961-35.038-50.537 0-85.268 35.038-34.73 35.039-34.73 84.961t34.73 84.961q34.731 35.038 85.268 35.038ZM480-480Z"/></svg></div>
                      <div class="baginfolist-item"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" id="info-item"><path d="M480-492.309q-57.749 0-98.874-41.124-41.125-41.125-41.125-98.874 0-57.75 41.125-98.874 41.125-41.125 98.874-41.125 57.749 0 98.874 41.125 41.125 41.124 41.125 98.874 0 57.749-41.125 98.874-41.125 41.124-98.874 41.124ZM180.001-187.694v-88.922q0-29.384 15.962-54.422 15.961-25.038 42.653-38.5 59.308-29.077 119.654-43.615T480-427.691q61.384 0 121.73 14.538 60.346 14.538 119.654 43.615 26.692 13.462 42.653 38.5 15.962 25.038 15.962 54.422v88.922H180.001ZM240-247.693h480v-28.923q0-12.154-7.039-22.5-7.038-10.346-19.115-16.885-51.692-25.461-105.418-38.577Q534.702-367.693 480-367.693t-108.428 13.115q-53.726 13.116-105.418 38.577-12.077 6.539-19.115 16.885Q240-288.77 240-276.616v28.923Zm240-304.614q33 0 56.5-23.5t23.5-56.5q0-33-23.5-56.5t-56.5-23.5q-33 0-56.5 23.5t-23.5 56.5q0 33 23.5 56.5t56.5 23.5Zm0-80Zm0 384.614Z"/></svg></div>
                  </div>
              </div>
          `;

          // Append the bag box to the container
          container.appendChild(bagBox);

        });
      } else {
        console.error("Data received is not an array");
      }
    } else {
      console.error("Bag List failed to retrieve");
    }
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

searchClose.addEventListener("click", function () {
  closeSearch();
});

function toggleAddOption() {
  if (!currentURL.includes("home")) {
    if (addToggleFlag == 0) {
      addOpBag.style.display = "flex";
    } else {
      addOpBag.style.display = "none";
    }
  } else {
    if (addToggleFlag == 0) {
      addOpHome.style.display = "flex";
    } else {
      addOpHome.style.display = "none";
    }
  }
}

// function toggleAddOption() {
//   if (currentURL.includes("bag")) {
//     // If current URL includes "bag"
//     addOpHome.style.display = "none"; // Hide "Add a bag" option
//     if (addToggleFlag == 0) {
//       addOpBag.style.display = "flex"; // Show "Add items" option
//     } else {
//       addOpBag.style.display = "none"; // Hide "Add items" option
//     }
//   } else {
//     // If current URL does not include "bag"
//     addOpBag.style.display = "none"; // Hide "Add items" option
//     if (addToggleFlag == 0) {
//       addOpHome.style.display = "flex"; // Show "Add a bag" option
//     } else {
//       addOpHome.style.display = "none"; // Hide "Add a bag" option
//     }
//   }
// }


function closeSearch() {
  searchBar.style.display = "none";
  topBarAct.style.display = "flex";
}

function enterShareLink() {
  Swal.fire({
    position: "center",
    title: "Enter join link",
    html: `<span style='font-size: 20px;'>TIP! Ask the owner to share their bag.</span>`,
    input: 'text', // Add a textbox input
    inputAttributes: {
      autocapitalize: 'off',
      placeholder: 'Enter share link...'
    },
    showCancelButton: true,
    confirmButtonText: 'Submit',
    cancelButtonText: 'Cancel',
    showLoaderOnConfirm: true,
    preConfirm: async (link) => {
      console.log("Link: ", link);
      try {
        const response = await fetch('/join', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ link })
        });

        const resData = await response.json();

        if (!response.ok) {
          throw new Error(`${resData.error}`);
        }
  
        // Return an object containing resData and link
        return resData 
      } catch (error) {
        Swal.showValidationMessage(
          `${error}`
        );
      }
    }
  }).then((result) => {

    console.log(result); // Log the result object
    if (result.isConfirmed) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Bag Joined",
        showConfirmButton: false,
        timer: 2000,
      });

      setTimeout(function () {
        window.location.href = result.value.link;
      }, 2000);
    }
  });
}

function comingSoonCalendar() {
  Swal.fire({
    position: "center",
    title: "Calendar is coming soon!",
    showConfirmButton: true,
  });
}

function showInfo(name, date, desc) {
  let formattedDate = 'N/A';
  if (date) {
      formattedDate = new Date(date).toLocaleDateString();
  }
  const description = desc.trim() !== '' ? desc : 'N/A';
  Swal.fire({
      position: "center",
              title: `${name} bag`,
              html: `<p>Packing date: ${formattedDate}</p><p>Description: ${description}</p>`,
              showConfirmButton: true,
  });
}

// Function to format date
function formatDate(date) {
// Convert to Date object
const formattedDate = new Date(date);
// Format the date (e.g., "January 1, 2022")
return formattedDate.toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});
}

function editName(name, bagID) {
  Swal.fire({
      position: "center",
      title: "Change bag name",
      input: 'text', // Add a textbox input
      inputAttributes: {
      autocapitalize: 'off',
      placeholder: `${name}`
      },
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      showLoaderOnConfirm: true,
      preConfirm: async (newName) => {
      console.log("New Bag Name: ", newName);
      try {
          const data = {
            name: newName,
            bagID: bagID,
          }
          const response = await fetch('/changeBagName', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data),
          });
          
          if (!response.ok) {
          throw new Error('Failed to send data');
          }

          if (response.status === 404) {
          throw new Error('Bag not found');
          }

          // Close the SweetAlert2 popup after fetch completion
          //Swal.close();

          if (response.status === 200) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Bag edited",
              showConfirmButton: false,
              timer: 1500,
            });
        
            setTimeout(function () {
              window.location.href = `/home`;
            }, 1500);
          }
          
      } catch (error) {
          Swal.showValidationMessage(
          `Request failed: ${error}`
          );
      }
      }
  })
}

async function showBagCollabStatus(bagID) {
  try {

    const response = await fetch('/postBagCollabStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({bagID}),
    })

    if (response.ok) {
      let statusMsg = "";
      const responseData = await response.json();

      if (responseData.hasMultipleCollabs) {
        statusMsg = "This is a group bag";
      } else {
        statusMsg = "This is a solo bag";
      }
      Swal.fire({
        position: "center",
        title: "Bag collaboration status",
        html: `<span style='font-size: 20px;'>${statusMsg}</span>`,
        showConfirmButton: true,
      });
    } else {
      // Handle non-200 response
      throw new Error('Failed to get bag collab status');
    }
    

  } catch (error) {
    Swal.showValidationMessage(
      `Request failed: ${error}`
      );
  }
}