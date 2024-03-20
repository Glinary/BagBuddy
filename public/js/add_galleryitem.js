const userIDClass = document.querySelector("#userid");
const bagClass = document.querySelector("#userbag");

var savedItems = [];

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
      <div id="item-weight" class="item-move-item"><input type="number" class="itemweight" name="itemweight" id="item" maxlength="5" placeholder="item weight" value="{{this.itemWeight}}"></div>kg
      <div id="item-setting" class="item-move-item center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m405.384-120-14.461-115.692q-19.154-5.769-41.423-18.154-22.269-12.385-37.885-26.538L204.923-235l-74.616-130 92.231-69.539q-1.769-10.846-2.923-22.346-1.154-11.5-1.154-22.346 0-10.077 1.154-21.192t2.923-25.038L130.307-595l74.616-128.462 105.923 44.616q17.923-14.923 38.769-26.923 20.846-12 40.539-18.539L405.384-840h149.232l14.461 116.461q23 8.077 40.654 18.539 17.654 10.461 36.346 26.154l109-44.616L829.693-595l-95.308 71.846q3.308 12.385 3.692 22.731.385 10.346.385 20.423 0 9.308-.769 19.654-.77 10.346-3.539 25.038L827.923-365l-74.615 130-107.231-46.154q-18.692 15.693-37.615 26.923-18.923 11.231-39.385 17.77L554.616-120H405.384ZM440-160h78.231L533-268.308q30.231-8 54.423-21.961 24.192-13.962 49.269-38.269L736.462-286l39.769-68-87.539-65.769q5-17.077 6.616-31.423 1.615-14.346 1.615-28.808 0-15.231-1.615-28.808-1.616-13.577-6.616-29.884L777.769-606 738-674l-102.077 42.769q-18.154-19.923-47.731-37.346t-55.961-23.115L520-800h-79.769l-12.462 107.538q-30.231 6.462-55.577 20.808-25.346 14.346-50.423 39.423L222-674l-39.769 68L269-541.231q-5 13.462-7 29.231-2 15.769-2 32.769Q260-464 262-449q2 15 6.231 29.231l-86 65.769L222-286l99-42q23.538 23.769 48.885 38.115 25.346 14.347 57.115 22.347L440-160Zm38.923-220q41.846 0 70.923-29.077 29.077-29.077 29.077-70.923 0-41.846-29.077-70.923Q520.769-580 478.923-580q-42.077 0-71.039 29.077-28.961 29.077-28.961 70.923 0 41.846 28.961 70.923Q436.846-380 478.923-380ZM480-480Z"/></svg></div>
  </div>
</section>`
  );

  const confirmBtn = document.querySelector(".confirm-btn");
  confirmBtn.style.display = "block";
}

async function save_items() {
  itemsArray = [];

  var itemsBlocks = document.querySelectorAll(".gallery-add");
  console.log("gall", itemsBlocks);

  itemsBlocks.forEach((blocks) => {
    var blockItems = {};

    textareaList = blocks.querySelectorAll("#item");
    console.log("Textarealist: ", textareaList);

    textareaList.forEach((textarea) => {
      var itemval = textarea.value;
      var classname = textarea.name;
      console.log(itemval, classname);

      blockItems[classname] = itemval;
    });

    itemsArray.push(blockItems);
  });

  console.log("Items array: ", itemsArray);

  await checkUniqueDB(itemsArray);
}

async function checkUniqueDB(itemsArray) {
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
        const confirmed = await showConfirmationSwal(
          itemsArray[index].itemname
        );

        console.log("index: ", index);
        if (index !== -1) {
          itemsArray.splice(index, 1);
        }
      }
    }
  } else {
    console.log("server error occurred");
  }

  // After processing all items, save to database
  savetoDatabase(itemsArray);
}

function showConfirmationSwal(element) {
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

async function savetoDatabase(element) {
  const response = await fetch(`/aig/${userIDClass.value}`, {
    method: "POST",
    body: JSON.stringify(element),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status == 200) {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Item/s has been added",
      showConfirmButton: false,
      timer: 1500,
    });
    setTimeout(function () {
      window.location.href = `/itemgallery/${userIDClass.value}/${bagClass.value}`;
    }, 1500);
  } else {
    console.log("server error occurred");
  }
}
