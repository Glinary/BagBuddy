const bagClass = document.querySelector("#userbag");

var savedItems = [];
var editedItems = [];
var editItems = false;

scrolltoNewlyAdded();

function add_item() {
  const itemGalleryListDiv = document.querySelector(".newNode");
  itemGalleryListDiv.insertAdjacentHTML(
    "afterbegin",
    `
<section id="item-wrapper1" class="gallery-add">
  <div class="item-left center">
      <div id="item-move" class="item-move-item center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M200-380v-40h560v40H200Zm0-160v-40h560v40H200Z"/></svg></div>
      <div id="item-name" class="item-move-item center">
          <textarea autofocus name="itemname" id="item" cols="15" rows="1"  maxlength="20" placeholder="item name"></textarea>
      </div>
  </div>
  <div class="item-right center">
      <div id="item-weight" class="item-move-item"><input type="number" class="itemweight" name="itemweight" id="item" maxlength="5" placeholder="item weight" value="{{this.itemWeight}}" required></div>kg
      <div id="item-setting" class="item-move-item center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m405.384-120-14.461-115.692q-19.154-5.769-41.423-18.154-22.269-12.385-37.885-26.538L204.923-235l-74.616-130 92.231-69.539q-1.769-10.846-2.923-22.346-1.154-11.5-1.154-22.346 0-10.077 1.154-21.192t2.923-25.038L130.307-595l74.616-128.462 105.923 44.616q17.923-14.923 38.769-26.923 20.846-12 40.539-18.539L405.384-840h149.232l14.461 116.461q23 8.077 40.654 18.539 17.654 10.461 36.346 26.154l109-44.616L829.693-595l-95.308 71.846q3.308 12.385 3.692 22.731.385 10.346.385 20.423 0 9.308-.769 19.654-.77 10.346-3.539 25.038L827.923-365l-74.615 130-107.231-46.154q-18.692 15.693-37.615 26.923-18.923 11.231-39.385 17.77L554.616-120H405.384ZM440-160h78.231L533-268.308q30.231-8 54.423-21.961 24.192-13.962 49.269-38.269L736.462-286l39.769-68-87.539-65.769q5-17.077 6.616-31.423 1.615-14.346 1.615-28.808 0-15.231-1.615-28.808-1.616-13.577-6.616-29.884L777.769-606 738-674l-102.077 42.769q-18.154-19.923-47.731-37.346t-55.961-23.115L520-800h-79.769l-12.462 107.538q-30.231 6.462-55.577 20.808-25.346 14.346-50.423 39.423L222-674l-39.769 68L269-541.231q-5 13.462-7 29.231-2 15.769-2 32.769Q260-464 262-449q2 15 6.231 29.231l-86 65.769L222-286l99-42q23.538 23.769 48.885 38.115 25.346 14.347 57.115 22.347L440-160Zm38.923-220q41.846 0 70.923-29.077 29.077-29.077 29.077-70.923 0-41.846-29.077-70.923Q520.769-580 478.923-580q-42.077 0-71.039 29.077-28.961 29.077-28.961 70.923 0 41.846 28.961 70.923Q436.846-380 478.923-380ZM480-480Z"/></svg></div>
  </div>
</section>`
  );

  const confirmBtn = document.querySelector(".confirm-btn");
  confirmBtn.style.display = "block";
}

async function delete_item(item) {
  if (item.dataset.deleteFlag == "1") {
    const mainParent = item.parentNode.parentNode;
    const blockID = mainParent.dataset.objid;

    itemID = { itemID: blockID };

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch(`/di`, {
          method: "POST",
          body: JSON.stringify(itemID),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status == 200) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Item has been deleted",
            showConfirmButton: false,
            timer: 1000,
          });

          setTimeout(function () {
            window.location.href = `/itemgallery/${bagClass.value}`;
          }, 1100);
        }
      }
    });
  }
}

function edit_items(item) {
  const mainParent = item.parentNode.parentNode;
  const itemblock = mainParent.querySelectorAll("#item");
  const closeButton = mainParent.querySelector("#item-setting");
  const itemDelete = mainParent.querySelector("#item-move");
  mainParent.dataset.edited = 1;

  if (closeButton.dataset.closeFlag == "1") {
    itemblock[0].disabled = true;
    itemblock[1].readonly = true;
    itemblock[1].style.backgroundColor = "transparent";
    itemblock[1].style.width = "25%";

    itemDelete.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M200-380v-40h560v40H200Zm0-160v-40h560v40H200Z"/></svg>`;
    closeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m405.384-120-14.461-115.692q-19.154-5.769-41.423-18.154-22.269-12.385-37.885-26.538L204.923-235l-74.616-130 92.231-69.539q-1.769-10.846-2.923-22.346-1.154-11.5-1.154-22.346 0-10.077 1.154-21.192t2.923-25.038L130.307-595l74.616-128.462 105.923 44.616q17.923-14.923 38.769-26.923 20.846-12 40.539-18.539L405.384-840h149.232l14.461 116.461q23 8.077 40.654 18.539 17.654 10.461 36.346 26.154l109-44.616L829.693-595l-95.308 71.846q3.308 12.385 3.692 22.731.385 10.346.385 20.423 0 9.308-.769 19.654-.77 10.346-3.539 25.038L827.923-365l-74.615 130-107.231-46.154q-18.692 15.693-37.615 26.923-18.923 11.231-39.385 17.77L554.616-120H405.384ZM440-160h78.231L533-268.308q30.231-8 54.423-21.961 24.192-13.962 49.269-38.269L736.462-286l39.769-68-87.539-65.769q5-17.077 6.616-31.423 1.615-14.346 1.615-28.808 0-15.231-1.615-28.808-1.616-13.577-6.616-29.884L777.769-606 738-674l-102.077 42.769q-18.154-19.923-47.731-37.346t-55.961-23.115L520-800h-79.769l-12.462 107.538q-30.231 6.462-55.577 20.808-25.346 14.346-50.423 39.423L222-674l-39.769 68L269-541.231q-5 13.462-7 29.231-2 15.769-2 32.769Q260-464 262-449q2 15 6.231 29.231l-86 65.769L222-286l99-42q23.538 23.769 48.885 38.115 25.346 14.347 57.115 22.347L440-160Zm38.923-220q41.846 0 70.923-29.077 29.077-29.077 29.077-70.923 0-41.846-29.077-70.923Q520.769-580 478.923-580q-42.077 0-71.039 29.077-28.961 29.077-28.961 70.923 0 41.846 28.961 70.923Q436.846-380 478.923-380ZM480-480Z"/></svg>`;
    itemDelete.style.cursor = "none";
    itemDelete.dataset.deleteFlag = "0";

    closeButton.dataset.closeFlag = "0";
    closeButton.style.backgroundColor = "transparent";
    closeButton.style.borderRadius = "none";
    console.log(closeButton);
  } else {
    itemblock[0].removeAttribute("disabled");
    itemblock[0].focus();
    itemblock[1].removeAttribute("readonly");
    itemblock[1].style.backgroundColor = "white";
    itemblock[1].style.width = "25%";

    // show delete button
    itemDelete.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M304.615-160q-26.846 0-45.731-18.884Q240-197.769 240-224.615V-720h-40v-40h160v-30.77h240V-760h160v40h-40v495.385Q720-197 701.5-178.5 683-160 655.385-160h-350.77ZM680-720H280v495.385q0 10.769 6.923 17.692T304.615-200h350.77q9.23 0 16.923-7.692Q680-215.385 680-224.615V-720ZM392.307-280h40.001v-360h-40.001v360Zm135.385 0h40.001v-360h-40.001v360ZM280-720v520-520Z"/></svg>`;
    itemDelete.style.cursor = "pointer";
    itemDelete.dataset.deleteFlag = "1";

    // show close button
    closeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m336-280-56-56 144-144-144-143 56-56 144 144 143-144 56 56-144 143 144 144-56 56-143-144-144 144Z"/></svg>`;
    closeButton.dataset.closeFlag = "1";
    closeButton.style.backgroundColor = "gray";
    closeButton.style.borderRadius = "100px";
    console.log(closeButton);
  }

  const confirmBtn = document.querySelector(".confirm-btn");
  confirmBtn.style.display = "block";
  editItems = true;
  console.dir(mainParent);
}

function iterateArr(allItems) {
  itemsArray = [];

  allItems.forEach((blocks) => {
    var blockItems = {};

    textAreaList = textareaList = blocks.querySelectorAll("#item");
    const blockID = blocks.dataset.objid;

    blockItems["itemID"] = blockID;
    textareaList.forEach((textarea) => {
      var itemval = textarea.value;
      var classname = textarea.name;
      // console.log(itemval, classname);

      blockItems[classname] = itemval;
    });
    itemsArray.push(blockItems);
  });

  return itemsArray;
}
async function save_items() {
  if (editItems) {
    // const allItems = document.querySelectorAll("#item-wrapper");
    const allItems = document.querySelectorAll(`[data-edited="1"]`);
    console.log(allItems);

    let editsArray = iterateArr(allItems);

    await checkUniqueDB(editsArray, "edit");
    console.log("edits array: ", editsArray);
    editItems == false;
  } else {
    var itemsBlocks = document.querySelectorAll(".gallery-add");

    let saveArray = iterateArr(itemsBlocks);
    console.log("Items array: ", saveArray);

    await checkUniqueDB(saveArray, "save");
  }
}

async function checkUniqueDB(itemsArray, type) {
  const response = await fetch(`/fi`, {
    method: "POST",
    body: JSON.stringify(itemsArray),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status == 200) {
    const resultList = await response.json();
    console.log(resultList);

    for (const element of resultList) {
      if (element == 200) {
        let index = resultList.indexOf(element);
        await showExistingSwal(itemsArray[index].itemname);

        if (index !== -1) {
          itemsArray.splice(index, 1);
        }
      }
    }
  } else {
    console.log("server error occurred");
  }

  // After processing all items, save to/update database
  if (type == "save") {
    savetoDatabase(itemsArray);
  } else if (type == "edit") {
    await updateDatabase(itemsArray);
  }
}

function showExistingSwal(element) {
  return new Promise((resolve) => {
    Swal.fire({
      title: "Oops",
      text: `${element} is already existing in your gallery`,
      icon: "warning",
      confirmButtonText: "OK",
    }).then((result) => {
      resolve(result.isConfirmed);
    });
  });
}

async function updateDatabase(element) {
  let flag = 0;
  element.forEach(async (item) => {
    if (item.itemname == "") {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Item Name is required!",
        showConfirmButton: false,
        timer: 1500,
      });
      flag = 1;
      return;
    }
  });

  if (flag == 0) {
    element = element.filter(
      (item) => !(item.itemname === "" && item.itemweight === "")
    );

    console.log("to save: ", element);
    const response = await fetch("/udb", {
      method: "POST",
      body: JSON.stringify(element),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status == 200) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Item/s have been updated",
        showConfirmButton: false,
        timer: 1500,
      });

      setTimeout(function () {
        window.location.href = `/itemgallery/${bagClass.value}`;
      }, 1500);
    }
  }
}

async function savetoDatabase(element) {
  let flag = 0;
  element.forEach(async (item) => {
    if (item.itemname == "") {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Item Name is required!",
        showConfirmButton: false,
        timer: 1500,
      });
      flag = 1;
      return;
    }
  });

  if (flag == 0) {
    element = element.filter(
      (item) => !(item.itemname === "" && item.itemweight === "")
    );

    const response = await fetch(`/aig`, {
      method: "POST",
      body: JSON.stringify(element),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status == 200) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Item/s has been added",
        showConfirmButton: false,
        timer: 1500,
      });

      responseData = await response.json();
      resItems = responseData.addedItems;
      console.log("addedItems: ", resItems);

      // Store resItems in local storage
      localStorage.setItem("resItems", JSON.stringify(resItems));

      setTimeout(function () {
        window.location.href = `/itemgallery/${bagClass.value}`;
      }, 1500);
    } else {
      console.log("server error occurred");
    }
  }
}

function scrolltoNewlyAdded() {
  const storedResItems = localStorage.getItem("resItems");
  const resItems = storedResItems ? JSON.parse(storedResItems) : [];
  resItems.forEach((newID) => {
    // Find the corresponding div in the gallery based on its ID
    const divToHighlight = document.querySelector(`[data-objID="${newID}"]`);
    console.log("to highlight: ", divToHighlight);

    // Check if the div exists
    if (divToHighlight) {
      // Get the scrollable container
      const scrollableContainer = divToHighlight.closest(
        ".gallery-itemlist-wrapper"
      );
      if (scrollableContainer) {
        // Get the dimensions and scroll position of the container
        const containerRect = scrollableContainer.getBoundingClientRect();
        const containerTop = containerRect.top;
        const containerBottom = containerRect.bottom;

        // Get the dimensions and position of the element
        const elementRect = divToHighlight.getBoundingClientRect();
        const elementTop = elementRect.top;
        const elementBottom = elementRect.bottom;

        // Check if the element is fully visible within the container
        const isFullyVisible =
          elementTop >= containerTop && elementBottom <= containerBottom;

        // If the element is not fully visible, scroll to it
        if (!isFullyVisible) {
          // Apply highlighting or focus style to the div
          divToHighlight.style.border = "1px solid var(--main-blue)"; // Example highlighting
          divToHighlight.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest",
          }); // Example focusing

          setTimeout(function () {
            divToHighlight.style.border = "none";
          }, 2500);
        }
      }
    }
  });
  localStorage.clear();
}
