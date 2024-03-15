// import express from "express";
// import bodyParser from "body-parser";
const express = require("express");
const bodyParser = require("body-parser");
const User = require("../schema/Users");
const Bags = require("../schema/Bags");
const Items = require("../schema/Items");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());

let loggedInUser = null; // Placement for local session only

const controller = {
  getHome: async function (req, res) {
    console.log("-------GET HOME VIEW--------");
    let userID = req.body.userID;
    console.log("USER ID: ", userID);
    let email = "emailuetest1";

    const user = await User.findOne({ email: email }).lean().exec();
    const userBags = await Bags.find({ _id: { $in: user.bags } })
      .lean()
      .exec();

    console.log("user: ", user);
    console.log("bags in home view: ", userBags);

    res.render("home", {
      maincss: "/static/css/main.css",
      css1: "/static/css/home.css",
      partialcss: "/static/css/bag.css",
      mainscript: "/static/js/home.js",
      showTop: true,
      showBot: true,
      showAddBtn: true,
      bags: userBags,
    });
  },

  getBag: async function (req, res) {
    console.log("-------GET BAG VIEW--------");

    const bagID = req.params.id;
    console.log("bag ID: ", bagID);

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
    });
  },

  getNotif: async function (req, res) {
    res.render("notification", {
      maincss: "/static/css/main.css",
      css1: "/static/css/notificationPage.css",
      partialcss: "/static/css/notif.css",
      mainscript: "/static/js/home.js",
      showBot: true,
      /*Sample list for testing bag view*/
      notifs: [
        { bagtype: "travel", date: "Feb 20" },
        { bagtype: "personal", date: "Feb 21" },
      ],
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
    bagToFind = req.params.id;

    const bagFound = await Bags.findOne({ _id: bagToFind }).lean().exec();

    res.render("editBagForm", {
      maincss: "/static/css/main.css",
      css1: "/static/css/bagform.css",
      mainscript: "/static/js/home.js",
      js1: "/static/js/edit_bag.js",
      bags: bagFound,
    });
  },

  getAddItem: async function (req, res) {
    console.log("-------GET ITEM--------");

    const bagID = req.params.id;

    const bagToDisplay = await Bags.findOne({ _id: bagID }).lean().exec();
    console.log("Bag to Display", bagToDisplay);

    // populate bag's userItemPools with users itself
    const bagUsers = await Bags.findById(bagID)
      .populate("userItemsPool")
      .exec();

    // get the user in userItemsPool
    const bagUsersPool = bagUsers.userItemsPool;
    const bagUsersItemGallery = bagUsersPool.itemGallery;

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

    console.log("user item gallery: ", itemList);

    // code when itemPool must contain the item gallery of all collaborators
    // try {
    //   // Use map instead of forEach
    //   await Promise.all(
    //     bagUsersList.map(async (element) => {
    //       console.log("ELEMENT: ", element.itemGallery);
    //       var itemGalID = element.itemGallery;

    //       const items = await Items.find({ itemGalleryID: itemGalID })
    //         .lean()
    //         .exec();
    //       //console.log(items);
    //       itemList.push(...items);
    //     })
    //   );
    // } catch (error) {
    //   console.log("listing users in bags for items failed due to: ", error);
    // }

    res.render("addItem", {
      maincss: "/static/css/main.css",
      css1: "/static/css/addItem.css",
      partialcss: "/static/css/dItem.css",
      mainscript: "/static/js/home.js",
      js1: "/static/js/additem.js",
      bag: bagToDisplay,
      items: itemList,
    });
  },

  getItemGallery: async function (req, res) {
    res.render("itemGallery", {
      maincss: "/static/css/main.css",
      css1: "/static/css/itemGallery.css",
      partialcss: "/static/css/item.css",
      mainscript: "/static/js/home.js",
      bag: { name: "ETC", weight: "7kg", color: "red" },
      items: [
        { id: "123456", name: "Pencil", weight: "5kg" },
        { id: "123457", name: "Pencil", weight: "5kg" },
        { id: "123458", name: "Pencil", weight: "5kg" },
      ],
    });
  },

  getOnboarding: async function (req, res) {
    res.render("onboarding", {
      maincss: "/static/css/main.css",
      css1: "/static/css/onboarding.css",
      showTop: false,
      showBot: false,
      showAddBtn: false,
      mainjs: "/static/js/onboarding.js",
    });
  },

  getLogin: async function (req, res) {
    res.render("login", {
      maincss: "/static/css/main.css",
      css1: "/static/css/login-register.css",
      partialcss: "",
      mainjs: "/static/js/login.js",
      js2: "",
      showTop: false,
      showBot: false,
      showAddBtn: false,
    });
  },

  getRegister: async function (req, res) {
    res.render("register", {
      maincss: "/static/css/main.css",
      css1: "/static/css/login-register.css",
      showTop: false,
      showBot: false,
      showAddBtn: false,
      mainscript: "/static/js/register.js",
    });
  },

  getProfile: async function (req, res) {
    res.render("profile", {
      maincss: "/static/css/main.css",
      css1: "/static/css/profile.css",
      showTop: false,
      showBot: true,
      showAddBtn: false,
      mainjs: "/static/js/profile.js",
      js1: "/static/js/home.js",
      defaultImg: "/static/images/boy.png",
    });
  },

  getEditProfile: async function (req, res) {
    res.render("editProfile", {
      maincss: "/static/css/main.css",
      css1: "/static/css/editProfile.css",
      showTop: false,
      showBot: true,
      showAddBtn: false,
      mainjs: "/static/js/editProfile.js",
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

  newUserRegistration: async function (req, res) {
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
      });

      // save the user to the database
      const savedUser = await newUser.save();
      console.log("User saved: ", savedUser);

      // after successful registration, redirect to login validation
      res.status(200).json({ message: "User created.", userID: newUser._id });
    } catch (error) {
      console.log("Error registering user: ", error);
      res.status(500).json({ message: "Server error." });
    }
  },

  postLogin: async function (req, res) {
    const { email, password } = req.body;

    try {
      const logUser = await User.findOne({ email: email });

      if (logUser != null) {
        const passStatus = await logUser.comparePW(password);
        if (passStatus) {
          // Update global variable with email
          loggedInUser = email;

          // Redirect to main page
          res.status(200).redirect("/home");
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

  /** DB controls - BAGS AND ITEMS */
  addTheBag: async function (req, res) {
    let email = "emailuetest1";
    const user = await User.findOne({ email: email }).lean().exec();
    console.log(req.body.bagname);

    let dateUsage = req.body.bagdate;
    console.log(dateUsage);
    let dateBag = "";

    if (dateUsage != "") {
      dateBag = new Date(dateUsage);
    }

    dateUsage = dateBag;

    let delete_laterID = new mongoose.Types.ObjectId(
      "65e859dc190b035ad6bc3b2b"
    );

    let delete_laterGID = new mongoose.Types.ObjectId(
      "65f2a0a2a092520f8f480869"
    );
    // create new Bag of Bag Schema format
    const newBag = new Bags({
      _id: new mongoose.Types.ObjectId(),
      bagName: req.body.bagname,
      bagColor: req.body.selectedColor,
      bagWeight: req.body.weight,
      dateUsage: dateUsage,
      userItemsPool: [user._id],
    });

    const newItem = new Items({
      _id: new mongoose.Types.ObjectId(),
      itemName: "Pencil",
      itemWeight: 1,
    });

    const newItem1 = new Items({
      _id: new mongoose.Types.ObjectId(),
      itemName: "Eraser",
      itemWeight: 1,
    });

    const newItem2 = new Items({
      _id: new mongoose.Types.ObjectId(),
      itemName: "Sharpener",
      itemWeight: 1,
    });

    const newItem3 = new Items({
      _id: new mongoose.Types.ObjectId(),
      itemName: "Pentel",
      itemWeight: 1,
    });
    const newItem4 = new Items({
      _id: new mongoose.Types.ObjectId(),
      itemName: "Phone",
      itemWeight: 1,
    });

    const newItem5 = new Items({
      _id: new mongoose.Types.ObjectId(),
      itemName: "Paper",
      itemWeight: 1,
    });

    const newItem6 = new Items({
      _id: new mongoose.Types.ObjectId(),
      itemName: "Sharpener",
      itemWeight: 1,
    });

    const newItem7 = new Items({
      _id: new mongoose.Types.ObjectId(),
      itemName: "Pentel",
      itemWeight: 1,
    });
    const newItem8 = new Items({
      _id: new mongoose.Types.ObjectId(),
      itemName: "Phone",
      itemWeight: 1,
    });

    const newItem9 = new Items({
      _id: new mongoose.Types.ObjectId(),
      itemName: "Paper",
      itemWeight: 1,
    });
    const newItem10 = new Items({
      _id: new mongoose.Types.ObjectId(),
      itemName: "Paper",
      itemWeight: 1,
    });
    const newItem11 = new Items({
      _id: new mongoose.Types.ObjectId(),
      itemName: "Paper",
      itemWeight: 1,
    });
    const newItem12 = new Items({
      _id: new mongoose.Types.ObjectId(),
      itemName: "Paper",
      itemWeight: 1,
    });
    const newItem13 = new Items({
      _id: new mongoose.Types.ObjectId(),
      itemName: "Paper",
      itemWeight: 1,
    });

    const newItem14 = new Items({
      _id: new mongoose.Types.ObjectId(),
      itemName: "Paper",
      itemWeight: 1,
    });
    const newItem15 = new Items({
      _id: new mongoose.Types.ObjectId(),
      itemName: "Paper",
      itemWeight: 1,
    });
    const newItem16 = new Items({
      _id: new mongoose.Types.ObjectId(),
      itemName: "Paper",
      itemWeight: 1,
    });
    const newItem17 = new Items({
      _id: new mongoose.Types.ObjectId(),
      itemName: "Paper",
      itemWeight: 1,
    });
    const newItem18 = new Items({
      _id: new mongoose.Types.ObjectId(),
      itemName: "Paper",
      itemWeight: 1,
    });
    const newItem19 = new Items({
      _id: new mongoose.Types.ObjectId(),
      itemName: "Paper",
      itemWeight: 1,
    });
    const newItem20 = new Items({
      _id: new mongoose.Types.ObjectId(),
      itemName: "Paper",
      itemWeight: 1,
    });
    const newItem21 = new Items({
      _id: new mongoose.Types.ObjectId(),
      itemName: "Paper",
      itemWeight: 1,
    });
    const newItem22 = new Items({
      _id: new mongoose.Types.ObjectId(),
      itemName: "Paper",
      itemWeight: 1,
    });
    const newItem23 = new Items({
      _id: new mongoose.Types.ObjectId(),
      itemName: "Paper",
      itemWeight: 1,
    });
    let items = [
      newItem,
      newItem1,
      newItem2,
      newItem3,
      newItem4,
      newItem5,
      newItem6,
      newItem7,
      newItem8,
      newItem9,
      newItem10,
      newItem11,
      newItem12,
      newItem13,
      newItem14,
      newItem15,
      newItem16,
      newItem17,
      newItem18,
      newItem19,
      newItem20,
      newItem21,
      newItem22,
      newItem23,
    ];
    console.log("Items to be put in bag: ", items);

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

          itemGallery: items,
        },
        { new: true }
      )
        .then((addedBag) => {
          if (addedBag) {
            console.log("Success add bag", addedBag);
            newItem.save();
            newItem1.save();
            newItem2.save();
            newItem3.save();
            newItem4.save();
            newItem5.save();
            newItem6.save();
            newItem7.save();
            newItem8.save();
            newItem9.save();
            newItem10.save();
            newItem11.save();
            newItem12.save();
            newItem13.save();
            newItem14.save();
            newItem15.save();
            newItem16.save();
            newItem17.save();
            newItem18.save();
            newItem19.save();
            newItem20.save();
            newItem21.save();
            newItem22.save();
            newItem23.save();

            res.status(200).json({
              message: "Bag added successfully",
              bag: newBag._id,
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
    console.log("HERE IN THIS");
    const bagToDelete = req.body.bag;
    console.log("STring", bagToDelete);

    try {
      let email = "emailuetest1";
      const user = await User.findOne({ email: email }).lean().exec();
      console.log("HEY");

      await User.findOneAndUpdate(
        { _id: user._id },
        { $pull: { bags: bagToDelete } }
      ).then(async (deletedBag) => {
        console.log("bag deleted successfully in User");
        if (deletedBag) {
          await Bags.deleteOne({ _id: bagToDelete }).then((deletedBagBag) => {
            if (deletedBagBag) {
              console.log("bag deleted successfully in Bags");
              res.redirect(`http://localhost:3000/`);
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
    console.log("EDIT BAG CONTROLLER");
    const bagID = req.body.bagID;
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
            bagid: bagID,
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
    const bagToFind = req.body.findbag;
    const bagFound = await Bags.findOne({ _id: bagToFind }).lean().exec();

    console.log("bag sched: ", bagFound.dateUsage);

    if (bagFound) {
      console.log("Schedule sent to client");
      bagToSend = bagFound.dateUsage;
      res.status(200).json({
        bagDate: bagToSend,
      });
    }
  },

  findItem: async function (req, res) {
    console.log("-------FIND ITEM--------");
    const bagToFind = req.body.tofindbag;
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

  addItem: async function (req, res) {
    console.log("-------ADD ITEM--------");
    let email = "emailuetest1";
    const user = await User.findOne({ email: email }).lean().exec();

    const itemList = req.body;

    const bagID = itemList.shift();

    console.log("Items to add in the bag: ", itemList);

    try {
      const itemIDs = itemList.map(
        (element) => new mongoose.Types.ObjectId(element)
      );
      Bags.updateOne({ _id: bagID }, { $set: { bagItems: itemIDs } }).then(
        (addedItem) => {
          if (addedItem) {
            console.log("adding item successful");
            res.status(200).json({ redLink: bagID });
          } else {
            console.log("adding item unsuccessful");
          }
        }
      );
    } catch (err) {
      console.log("Error in adding items loop: ", err);
    }
  },
};

// export default controller;
module.exports = controller;
