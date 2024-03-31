// import express from "express";
// import bodyParser from "body-parser";
const express = require("express");
const bodyParser = require("body-parser");
const User = require("../schema/Users");
const Bags = require("../schema/Bags");
const Items = require("../schema/Items");
const mongoose = require("mongoose");
require("dotenv").config();
const crypto = require("crypto");

const session = require("express-session");

const app = express();
app.use(bodyParser.json());

const sessionChecker = (req, res, next) => {
  // Assuming you're using express-session for managing sessions
  if (req.session.user) {
    // User is already logged in, redirect to home page
    res.redirect(`/home`);
  } else {
    next();
  }
};

const controller = {
  getHome: async function (req, res) {
    console.log("-------GET HOME VIEW--------");
    let userID = req.session.user.uID; //TODO: uID is undefined with tested
    // console.log("USER ID: ", userID);

    // const user = await User.findOne({ _id: userID }).lean().exec();
    // const userBags = await Bags.find({ _id: { $in: user.bags } })
    //   .lean()
    //   .exec();

    // console.log("user: ", user);
    // console.log("bags in home view: ", userBags);

    // res.status(200).render("home", {
    //   maincss: "/static/css/main.css",
    //   css1: "/static/css/home.css",
    //   partialcss: "/static/css/bag.css",
    //   mainscript: "/static/js/home.js",
    //   showTop: true,
    //   showBot: true,
    //   showAddBtn: true,
    //   bags: userBags,
    // });
  },

  getBag: async function (req, res) {
    console.log("-------GET BAG VIEW--------");

    try {
      const encryptedBagId = req.params.id;
      console.log("encrypted bag ID: ", encryptedBagId);

      const userID = req.session.user.uID;
      console.log("user ID:", userID);

      const bagID = decrypt(encryptedBagId, process.env.KEY);
      console.log("decrypted bag ID: ", bagID);

      const bagToDisplay = await Bags.findOne({ _id: bagID }).lean().exec();

      const itemsToDisplay = bagToDisplay.bagItems;

      console.log("Bag to be displayed: ", bagToDisplay);
      console.log("items to display: ", itemsToDisplay);

      let itemList = [];

      //code when item pool contains only user item gallery
      try {
        // Use map instead of forEach
        await Promise.all(
          itemsToDisplay.map(async (element) => {
            const items = await Items.find({ _id: element }).lean().exec();
            // console.log(items);
            itemList.push(...items);
          })
        );
      } catch (error) {
        console.log("listing users in bags for items failed due to: ", error);
      }

      console.log("bag items: ", itemList);

      res.render("insidebag", {
        maincss: "/static/css/main.css",
        css1: "/static/css/home.css",
        partialcss: "/static/css/dItem.css",
        mainscript: "/static/js/home.js",
        js1: "/static/js/delete_bag.js",
        showBot: true,
        showAddBtn: true,
        /*Sample list for testing bag view*/
        bag: bagToDisplay,
        items: itemList,
        user: userID,
      });
    } catch (error) {
      res.render("errorpage", {
        maincss: "/static/css/main.css",
        css1: "/static/css/errorpage.css",
        mainscript: "/static/js/errorpage.js",
      });
    }
  },

  getNotif: async function (req, res) {
    console.log("-------GET HOME VIEW--------");
    let userID = req.session.user.uID;
    console.log("USER ID: ", userID);

    const user = await User.findOne({ _id: userID }).lean().exec();
        const userBags = await Bags.find({ _id: { $in: user.bags } }).lean().exec();

        console.log("user: ", user);
        console.log("bags in home view: ", userBags);

        // Extract bagName and dateUsage from userBags
        const bagsInfo = userBags.map(bag => ({
            bagName: bag.bagName,
            dateUsage: formatDate(bag.dateUsage)
        }));

        console.log("Bags information: ", bagsInfo);

    res.render("notification", {
      maincss: "/static/css/main.css",
      css1: "/static/css/notificationPage.css",
      partialcss: "/static/css/notif.css",
      mainscript: "/static/js/home.js",
      showBot: true,
      /*Sample list for testing bag view*/
      // notifs: [
      //   { bagtype: "travel", date: "Feb 20" },
      //   { bagtype: "personal", date: "Feb 21" },
      // ],
      notifs: bagsInfo,
    });
  },

  getAddBag: async function (req, res) {
    res.render("bagform", {
      maincss: "/static/css/main.css",
      css1: "/static/css/bagform.css",
      mainscript: "/static/js/home.js",
      js1: "/static/js/add_bag.js",
    });
  },

  getBagFormEdit: async function (req, res) {
    try {
      const encbagToFind = req.params.id;
      const bagToFind = decrypt(encbagToFind, process.env.KEY);

      const bagFound = await Bags.findOne({ _id: bagToFind }).lean().exec();

      res.render("editBagForm", {
        maincss: "/static/css/main.css",
        css1: "/static/css/bagform.css",
        mainscript: "/static/js/home.js",
        js1: "/static/js/edit_bag.js",
        bags: bagFound,
      });
    } catch (error) {
      res.render("errorpage", {
        maincss: "/static/css/main.css",
        css1: "/static/css/errorpage.css",
        mainscript: "/static/js/errorpage.js",
      });
    }
  },

  getAddItem: async function (req, res) {
    console.log("-------GET ITEM--------");

    try {
      const encBagID = req.params.id;
      const bagID = decrypt(encBagID, process.env.KEY);

      const bagToDisplay = await Bags.findOne({ _id: bagID }).lean().exec();
      console.log("Bag to Display", bagToDisplay);

      // populate bag's userItemPools with users itself
      const bagUsers = await Bags.findById(bagID)
        .populate("userItemsPool")
        .exec();

      // get the user in userItemsPool
      const bagUsersPool = bagUsers.userItemsPool;
      const bagUsersItemGallery = bagUsersPool.itemGallery.sort();

      console.log("User item ID:", bagUsersItemGallery);

      let itemList = [];

      //code when item pool contains only user item gallery
      try {
        // Use map instead of forEach
        await Promise.all(
          bagUsersItemGallery.map(async (element) => {
            const items = await Items.find({ _id: element }).lean().exec();
            // console.log(items);
            itemList.push(...items);
          })
        );
      } catch (error) {
        console.log("listing users in bags for items failed due to: ", error);
      }

      // sort items so its sorted in item pool
      itemList.sort((a, b) => {
        const itemNameA = a.itemName.toUpperCase();
        const itemNameB = b.itemName.toUpperCase();

        if (itemNameA < itemNameB) {
          return -1; // Item A comes before Item B
        }
        if (itemNameA > itemNameB) {
          return 1; // Item A comes after Item B
        }
        return 0; // Item Names are equal
      });

      console.log("user item gallery: ", itemList);

      res.render("addItem", {
        maincss: "/static/css/main.css",
        css1: "/static/css/addItem.css",
        partialcss: "/static/css/dItem.css",
        mainscript: "/static/js/home.js",
        js1: "/static/js/add_bagitem.js",
        bag: bagToDisplay,
        items: itemList,
        user: bagUsersPool._id,
      });
    } catch (error) {
      res.render("errorpage", {
        maincss: "/static/css/main.css",
        css1: "/static/css/errorpage.css",
        mainscript: "/static/js/errorpage.js",
      });
    }
  },

  getItemGallery: async function (req, res) {
    console.log("----GET ITEM GALLERY PAGE----");
    const userID = req.session.user.uID;
    const user = await User.findOne({ _id: userID }).lean().exec();
    console.log("user item gallery look: ", user.itemGallery);

    const userItemsPop = await User.findById(userID)
      .populate("itemGallery")
      .exec();

    const userItems = userItemsPop.itemGallery;
    console.log("populated: ", userItems);

    userItemList = [];

    //code when item pool contains only user item gallery
    try {
      // Use map instead of forEach
      await Promise.all(
        userItems.map(async (element) => {
          const items = await Items.find({ _id: element._id }).lean().exec();
          // console.log(items);
          userItemList.push(...items);
        })
      );
    } catch (error) {
      console.log("listing users in bags for items failed due to: ", error);
    }

    // sort items so its sorted in item pool
    userItemList.sort((a, b) => {
      const itemNameA = a.itemName.toUpperCase();
      const itemNameB = b.itemName.toUpperCase();

      if (itemNameA < itemNameB) {
        return -1; // Item A comes before Item B
      }
      if (itemNameA > itemNameB) {
        return 1; // Item A comes after Item B
      }
      return 0; // Item Names are equal
    });

    console.log("user item gallery: ", userItemList);

    res.render("itemGallery", {
      maincss: "/static/css/main.css",
      css1: "/static/css/itemGallery.css",
      partialcss: "/static/css/item.css",
      mainscript: "/static/js/home.js",
      js1: "/static/js/add_galleryitem.js",
      items: userItemList,
      bag: req.params.id,
      user: req.params.user,
    });
  },

  getOnboarding: async function (req, res) {
    sessionChecker(req, res, () => {
      res.status(200).render("onboarding", {
        maincss: "/static/css/main.css",
        css1: "/static/css/onboarding.css",
        showTop: false,
        showBot: false,
        showAddBtn: false,
        mainscript: "/static/js/onboarding.js",
      });
    });
  },

  getLogin: async function (req, res) {
    res.status(200).render("login", {
      maincss: "/static/css/main.css",
      css1: "/static/css/login-register.css",
      partialcss: "",
      mainscript: "/static/js/login.js",
      js1: "",
      showTop: false,
      showBot: false,
      showAddBtn: false,
    });
  },

  getRegister: async function (req, res) {
    res.status(200).render("register", {
      maincss: "/static/css/main.css",
      css1: "/static/css/login-register.css",
      showTop: false,
      showBot: false,
      showAddBtn: false,
      mainscript: "/static/js/register.js",
    });
  },

  getProfile: async function (req, res) {
    // get the user's profile using the session ID
    const userID = req.session.user.uID;
    const user = await User.findOne({ _id: userID }).lean().exec();
    console.log("User: ", user);

    res.status(200).render("profile", {
      maincss: "/static/css/main.css",
      css1: "/static/css/profile.css",
      showTop: false,
      showBot: true,
      showAddBtn: false,
      mainscript: "/static/js/profile.js",
      js1: "/static/js/home.js",
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  },

  postSignout: async function (req, res) {
    console.log("------SIGN OUT------");
    req.session.destroy((err) => {
      if (err) {
        return console.log(err);
      } else {
        res.redirect("/login");
      }
    });
  },

  getEditProfile: async function (req, res) {
    res.status(200).render("editProfile", {
      maincss: "/static/css/main.css",
      css1: "/static/css/editProfile.css",
      showTop: false,
      showBot: true,
      showAddBtn: false,
      mainscript: "/static/js/editProfile.js",
    });
  },

  isNameValid: async function (req, res) {
    try {
      const registerName = req.body.registerName;

      console.log("isValid - Received name: ", registerName);

      // check the database for existing name
      const nameExists = await User.findOne({ name: registerName });
      console.log("isValid - Name exists: ", nameExists);

      if (nameExists) {
        return res.status(400).json({ message: "Name already in use." });
      } else {
        res.status(200).json({ message: "Name is valid." });
      }
    } catch (error) {
      console.log("Error checking if name exists: ", error);
      res.status(500).json({ message: "Server error." });
    }
  },

  isEmailValid: async function (req, res) {
    try {
      const registerEmail = req.body.registerEmail;

      console.log("isValid Email - Received email: ", registerEmail);

      // check the database for existing email
      const emailExists = await User.findOne({ email: registerEmail });
      console.log("isValid - Email exists: ", emailExists);

      if (emailExists) {
        return res.status(400).json({ message: "Email already in use." });
      } else {
        res.status(200).json({ message: "Email is valid." });
      }
    } catch (error) {
      console.log("Error checking if email exists: ", error);
      res.status(500).json({ message: "Server error." });
    }
  },

  postRegister: async function (req, res) {
    try {
      const registerName = req.body.registerName;
      const registerEmail = req.body.registerEmail;
      const registerPassword = req.body.registerPassword;

      console.log("Post-Reg Received name: ", registerName);
      console.log("Post-Reg Received email: ", registerEmail);
      console.log("Post-Reg Received password: ", registerPassword);

      // Register the user in user schema format
      const newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        email: registerEmail,
        name: registerName,
        password: registerPassword,
        avatar: "/static/images/boy.png",
      });

      // save the user to the database
      const savedUser = await newUser.save();
      console.log("User saved: ", savedUser);
      req.session.authenticated = true;
      req.session.user = { uID: newUser._id };

      // after successful registration, send the email and password
      // to login the client
      res.status(200).json({ userID: newUser._id });
    } catch (error) {
      console.log("Error registering user: ", error);
      res.status(500).json({ message: "Server error." });
    }
  },

  postLogin: async function (req, res) {
    console.log("------LOGIN------");
    const { email, password } = req.body;

    try {
      const logUser = await User.findOne({ email: email });
      console.log("READ ME")
      console.log(logUser)
      const userID = logUser._id;
      console.log("user ID: ", userID);
      console.log("Session ID: ", req.sessionID);

      if (logUser != null) {
        const passStatus = await logUser.comparePW(password);
        if (passStatus) {
          console.log("user exists in database...");
          req.session.authenticated = true;
          req.session.user = { uID: userID };
          // Redirect to main page
          res.status(200).json({ uID: req.session.user.uID });
        } else {
          console.log("Incorrect Password"); // Remove before deployment. For testing only
          res
            .status(401)
            .send("Incorrect email or password. Please try again.");
        }
      } else {
        console.log("Email does not exist"); // Remove before deployment. For testing only
        res.status(404).send("Incorrect email or password. Please try again.");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("An error occurred");
    }
  },

  // gets the session userID
  getBagList: async function (req, res) {
    console.log("-------GET BAG LIST--------");
    let userID = req.session.user.uID;
    console.log("USER ID: ", userID);
    const { bagname } = req.body;
    console.log("Current Bag Name: ", bagname);

    try {
      const user = await User.findOne({ _id: userID }).lean().exec();
      userBags = await Bags.find({
        _id: { $in: user.bags },
        bagName: { $regex: bagname, $options: "i" }, // Case-insensitive search
      }).lean().exec();
      
      console.log("Bag List: ", userBags );
      res.status(200).json({ bags: userBags });
    } catch (error) {
      console.error("Error retrieving session uID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }

  },

  /** DB controls - BAGS AND ITEMS */
  addTheBag: async function (req, res) {
    let userID = req.session.user.uID;
    const user = await User.findOne({ _id: userID }).lean().exec();
    console.log(req.body.bagname);

    let dateUsage = req.body.bagdate;
    console.log(dateUsage);
    let dateBag = "";

    if (dateUsage != "") {
      dateBag = new Date(dateUsage);
    }

    dateUsage = dateBag;
    console.log("bagdesc: ", req.body.bagdesc);

    const newid = new mongoose.Types.ObjectId();
    const encryptBag = encrypt(newid, process.env.KEY);

    // create new Bag of Bag Schema format
    const newBag = new Bags({
      _id: newid,
      encID: encryptBag,
      bagDesc: req.body.bagdesc,
      bagName: req.body.bagname,
      bagColor: req.body.selectedColor,
      bagWeight: req.body.weight,
      dateUsage: dateUsage,
      userItemsPool: [user._id],
    });

    newBag.save().then(async () => {
      User.findOneAndUpdate(
        { _id: user._id }, // find the matching user from all Users
        {
          $push: {
            // add bag to that user's bag list
            bags: {
              _id: newBag._id,
            },
          },
        },
        { new: true }
      )
        .then((addedBag) => {
          if (addedBag) {
            console.log("Success add bag", addedBag.bags);
            res.status(200).json({
              message: "Bag added successfully",
              bag: encryptBag,
            });
          } else {
            console.log("unsuccessful add bag");
          }
        })
        .catch((error) => {
          console.log("ERROR: ", error);
        });
    });
  },

  deleteBag: async function (req, res) {
    console.log("------DELETE BAG------");

    const encBagToDelete = req.body.bag;
    const bagToDelete = decrypt(encBagToDelete, process.env.KEY);
    console.log("bag ID to delete: ", bagToDelete);

    const userID = req.session.user.uID;

    try {
      // const user = await User.findOne({ _id: userID }).lean().exec();
      console.log("HEY");

      await User.findOneAndUpdate(
        { _id: userID },
        { $pull: { bags: bagToDelete } }
      ).then(async (deletedBag) => {
        console.log("bag deleted successfully in User");
        if (deletedBag) {
          await Bags.deleteOne({ _id: bagToDelete }).then((deletedBagBag) => {
            if (deletedBagBag) {
              console.log("bag deleted successfully in Bags");
              res.status(200).send();
            }
          });
        } else {
          console.log("unsuccessful delete bag");
        }
      });
    } catch (error) {
      console.error(error);
      return { success: false, message: "Error removing bag from user" };
    }
  },

  editBag: async function (req, res) {
    console.log("------EDIT BAG CONTROLLER-------");
    const encBagID = req.body.bagID;
    const bagID = decrypt(encBagID, process.env.KEY);
    const bagDesc = req.body.bagdesc;
    const bagName = req.body.bagname;
    const bagWeight = req.body.weight;
    const bagColor = req.body.selectedColor;

    let dateUsage = req.body.bagdate;
    console.log(dateUsage);
    let dateBag = "";

    if (dateUsage != "") {
      dateBag = new Date(dateUsage);
    }

    dateUsage = dateBag;

    try {
      await Bags.findOneAndUpdate(
        { _id: bagID },
        {
          $set: {
            bagDesc: bagDesc,
            bagName: bagName,
            bagWeight: bagWeight,
            bagColor: bagColor,
            dateUsage: dateUsage,
          },
        }
      ).then((updatedBag) => {
        if (updatedBag) {
          console.log("Successfull editing of bag");
          res.status(200).json({
            bagid: encBagID,
          });
        } else {
          console.log("unsuccessful edit bag");
        }
      });
    } catch (error) {
      console.error("Error editing bag:", error);
      // Handle the error appropriately
      res.status(500).send("Internal Server Error");
    }
  },

  findBag: async function (req, res) {
    console.log("-------FIND BAG--------");

    try {
      const bagToFindEnc = req.body.findbag;
      console.log(bagToFindEnc);
      const bagToFind = decrypt(bagToFindEnc, process.env.KEY);
      console.log(bagToFind);
      const bagFound = await Bags.findOne({ _id: bagToFind }).lean().exec();

      if (bagFound != null) {
        console.log("bag sched: ", bagFound.dateUsage);
        console.log("Schedule sent to client");
        bagToSend = bagFound.dateUsage;
        res.status(200).json({
          bagDate: bagToSend,
        });
      } else {
        res.status(404).send();
      }
    } catch (error) {
      res.status(404).send();
    }
  },

  findBagItem: async function (req, res) {
    console.log("-------FIND BAG ITEM--------");
    const encBagToFind = req.body.tofindbag;
    const bagToFind = decrypt(encBagToFind, process.env.KEY);
    const bagFound = await Bags.findOne({ _id: bagToFind }).lean().exec();

    console.log("Bag Found:", bagFound);

    if (bagFound) {
      console.log("Items in the bag: ");
      itemsToSend = bagFound.bagItems;
      console.log(itemsToSend);
      res.status(200).json({
        itemGallery: itemsToSend,
      });
    }
  },

  findItem: async function (req, res) {
    console.log("-------FIND ITEM--------");
    const itemToFind = req.body;

    console.log("item to find:", itemToFind);
    userID = req.session.user.uID;

    const userPop = await User.findById(userID).populate("itemGallery").exec();
    const itemGallery = userPop.itemGallery;

    console.log("the item gallery: ", itemGallery);

    try {
      const result = [];

      for (const item of itemToFind) {
        var existingItem = false;

        if (item.itemname == "" && item.itemweight == "") {
          existingItem = false;
        } else {
          itemweightInt = parseInt(item.itemweight);
          for (const itemGal of itemGallery) {
            if (
              itemGal.itemName === item.itemname &&
              itemGal.itemWeight === itemweightInt
            ) {
              existingItem = true;
              break;
            }
          }

          console.log(existingItem);

          if (existingItem) {
            console.log("item exists in the database already");
            result.push(200);
          } else {
            console.log("item does not exist in the database yet");
            result.push(500);
          }
        }
      }

      res.status(200).json(result); // Send the result back to the client
    } catch (error) {
      console.error("Error finding items:", error);
      res.status(500).json({ error: "An error occurred" }); // Handle error
    }
  },

  addItem: async function (req, res) {
    console.log("-------ADD ITEM--------");
    const itemList = req.body;

    const encBagID = itemList.shift();
    const bagID = decrypt(encBagID, process.env.KEY);

    console.log("Items to add in the bag: ", itemList);

    try {
      const itemIDs = itemList.map(
        (element) => new mongoose.Types.ObjectId(element)
      );
      Bags.updateOne({ _id: bagID }, { $set: { bagItems: itemIDs } }).then(
        (addedItem) => {
          if (addedItem) {
            console.log("adding item successful");
            res.status(200).json({ redLink: encBagID });
          } else {
            console.log("adding item unsuccessful");
          }
        }
      );
    } catch (err) {
      console.log("Error in adding items loop: ", err);
    }
  },

  addItemGallery: async function (req, res) {
    console.log("----ADD ITEM TO GALLERY----");
    const newItems = req.body;
    const userID = req.session.user.uID;
    const totalItems = newItems.length;
    let savedItems = 0;

    console.log("user: ", userID);
    console.log("items to add in the gallery: ", newItems);

    newIDs = [];

    newItems.forEach(async (obj) => {
      const newItem = new Items({
        _id: new mongoose.Types.ObjectId(),
        itemName: obj.itemname,
        itemWeight: obj.itemweight,
      });

      try {
        await newItem.save();

        const addedItem = await User.findOneAndUpdate(
          { _id: userID },
          {
            $push: {
              itemGallery: {
                _id: newItem._id,
              },
            },
          },
          { new: true }
        );

        if (addedItem) {
          newIDs.push(newItem._id);
        } else {
          console.log("Unsuccessful adding of items in user");
        }
      } catch (error) {
        console.log("Error: ", error);
        // Handle error, optionally send an error response
        res.status(500).send("Error occurred while adding items");
        return; // Exit the function early in case of an error
      }

      // Increment the savedItems counter
      savedItems++;

      // Check if all items have been processed
      if (savedItems === totalItems) {
        // If all items have been processed, send a 200 status code
        res.status(200).json({ addedItems: newIDs });
      }
    });
  },

  updateItemGallery: async function (req, res) {
    console.log("----UPDATE ITEM IN GALLERY----");
    const allItems = req.body;
    const userID = req.session.user.uID;
    var savedItems = 0;
    itemLen = allItems.length;

    console.log("allitems: ", allItems);

    for (const element of allItems) {
      const editedItemId = new mongoose.Types.ObjectId(element.itemID);
      const editedItemName = element.itemname;
      const editedItemWeight = parseInt(element.itemweight);

      try {
        const updatedItem = await Items.findOneAndUpdate(
          { _id: editedItemId },
          { itemName: editedItemName, itemWeight: editedItemWeight },
          { new: true }
        );

        if (updatedItem) {
          console.log(updatedItem);
          savedItems++;
        } else {
          console.log("Updating item unsuccessful");
        }
      } catch (error) {
        console.log("Error: ", error);
        // Handle error, optionally send an error response
        res.status(500).send("Error occurred while updating items");
        return; // Exit the function early in case of an error
      }
    }

    if (savedItems === itemLen) {
      res.status(200).send();
    }
  },
};


function encrypt(objectId, key) {
  const text = objectId.toString(); // Convert ObjectID to string

  // Ensure the key is 32 bytes (256 bits) long
  const keyBuffer = Buffer.alloc(32); // Create a buffer of 32 bytes filled with zeros
  Buffer.from(key, "utf-8").copy(keyBuffer); // Copy the key string bytes into the buffer

  const iv = crypto.randomBytes(16); // Generate a random IV (Initialization Vector)
  const cipher = crypto.createCipheriv("aes-256-cbc", keyBuffer, iv);
  let encrypted = cipher.update(text, "utf8", "base64"); // Use base64 encoding for the encrypted data
  encrypted += cipher.final("base64"); // Finalize encryption with base64 encoding

  // Replace '/' with '_' and '+' with '-'
  encrypted = encrypted.replace(/\//g, "_").replace(/\+/g, "-");

  const ivBase64 = iv.toString("base64"); // Encode IV to base64
  // Replace '/' with '_' in IV (no need to replace '+', IV doesn't contain it)
  const ivEncoded = ivBase64.replace(/\//g, "_");

  return ivEncoded + ":" + encrypted; // Concatenate IV and encrypted data with ':'
}

// Decryption function
function decrypt(encryptedData, key) {
  // Revert '_' back to '/' and '-' back to '+'
  encryptedData = encryptedData.replace(/_/g, "/").replace(/-/g, "+");

  // Split IV and encrypted data using ':'
  const [ivEncoded, encryptedBase64] = encryptedData.split(":");

  // Replace '_' back to '/' in IV
  const ivBase64 = ivEncoded.replace(/_/g, "/");

  // Decode IV and encrypted data from base64
  const iv = Buffer.from(ivBase64, "base64");
  const encrypted = Buffer.from(encryptedBase64, "base64").toString("base64"); // Decode from base64 and convert to string

  // Ensure the key is 32 bytes (256 bits) long
  const keyBuffer = Buffer.alloc(32); // Create a buffer of 32 bytes filled with zeros
  Buffer.from(key, "utf-8").copy(keyBuffer); // Copy the key string bytes into the buffer

  const decipher = crypto.createDecipheriv("aes-256-cbc", keyBuffer, iv);
  let decrypted = decipher.update(encrypted, "base64", "utf8"); // Decrypt using base64 encoding
  decrypted += decipher.final("utf8"); // Finalize decryption
  return decrypted;
}

// export default controller;
module.exports = controller;
