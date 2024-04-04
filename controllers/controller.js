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

// Reference fro axois
//https://singh-sandeep.medium.com/using-axios-in-node-js-a-guide-to-sending-http-requests-e981d7f73264
//https://developer.vonage.com/en/blog/5-ways-to-make-http-requests-in-node-js
const axios = require("axios");

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
    let isValidCount = false;

    console.log("-------GET HOME VIEW--------");
    let userID = req.session.user.uID; //TODO: uID is undefined with tested
    console.log("USER ID: ", userID);

    const user = await User.findOne({ _id: userID }).lean().exec();
    const userBags = await Bags.find({
      $or: [
        { _id: { $in: user.bags } }, // User is owner
        { bagCollabs: userID }, // User is collaborator
      ],
    })
      .lean()
      .exec();

    console.log("user: ", user);
    console.log("bags in home view: ", userBags);

    const bagsInfo = userBags.map((bag) => ({
      bagName: bag.bagName,
      dateUsage: formatDate(bag.dateUsage),
    }));

    // If dateUsage is within the next 7 days, add to notifs
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const alertBagInfo = bagsInfo.filter((bag) => {
      const bagDate = new Date(bag.dateUsage);
      return bagDate >= today && bagDate <= nextWeek;
    });

    // Count the number of bags that are due within the next 7 days
    const alertBagCount = alertBagInfo.length;
    console.log("Count of bags due within the next 7 days: ", alertBagCount)

    if (alertBagCount > 0) {
      isValidCount = true;
    }


    res.status(200).render("home", {
      maincss: "/static/css/main.css",
      css1: "/static/css/home.css",
      partialcss: "/static/css/bag.css",
      mainscript: "/static/js/home.js",
      showTop: true,
      showBot: true,
      showAddBtn: true,
      bags: userBags,
      showCount: isValidCount,
      notifCount: alertBagCount,
    });
  },

  getBag: async function (req, res) {
    console.log("-------GET BAG VIEW--------");

    try {
      const encryptedBagId = req.params.id;
      const userID = req.session.user.uID;

      const bagID = decrypt(encryptedBagId, process.env.KEY);
      console.log("decrypted bag ID: ", bagID);

      const bagToDisplay = await Bags.findOne({ _id: bagID }).lean().exec();
      const itemsToDisplay = bagToDisplay.bagItems;

      // Check if the current user is the owner of the bag
      // ownerID is the first user in the userItemsPool
      const ownerID = bagToDisplay.userItemsPool[0];
      const isBagOwner = ownerID.equals(userID);
      
      console.log("Is bag owner: ", isBagOwner);

      // itemsToDisplay.forEach(item => {
      //   console.log(`Item ID: ${item._id}, Quantity: ${item.quantity}`);
      // });

      console.log("Bag to be displayed: ", bagToDisplay);
      console.log("items to display: ", itemsToDisplay);

      let itemList = [];

      //code when item pool contains only user item gallery
      try {
        // Use map instead of forEach
        await Promise.all(
          itemsToDisplay.map(async (element) => {
            const items = await Items.find({ _id: element }).lean().exec();
            itemList.push(...items);
          })
        );
      } catch (error) {
        console.log("listing users in bags for items failed due to: ", error);
      }

      itemList.sort((a, b) => a.itemName.localeCompare(b.itemName));

      console.log("bag items: ", itemList);

      res.render("insidebag", {
        maincss: "/static/css/main.css",
        css1: "/static/css/home.css",
        partialcss: "/static/css/dItem.css",
        mainscript: "/static/js/home.js",
        js1: "/static/js/delete_bag.js",
        showBot: true,
        showAddBtn: true,
        bag: bagToDisplay,
        items: itemList,
        user: userID,
        isBagOwner: isBagOwner, // Pass the ownership status to the view
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
    console.log("-------GET NOTIF VIEW--------");

    try {
      let userID = req.session.user.uID;
      console.log("USER ID: ", userID);

      const user = await User.findOne({ _id: userID }).lean().exec();
      const userBags = await Bags.find({
        $or: [
          { _id: { $in: user.bags } }, // User is owner
          { bagCollabs: userID }, // User is collaborator
        ],
      })
        .lean()
        .exec();

      console.log("user: ", user);
      console.log("bags in home view: ", userBags);

      // Extract bagName and dateUsage from userBags
      const bagsInfo = userBags.map((bag) => ({
        bagName: bag.bagName,
        dateUsage: formatDate(bag.dateUsage),
      }));

      // If dateUsage is within the next 7 days, add to notifs
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      const alertBagInfo = bagsInfo.filter((bag) => {
        const bagDate = new Date(bag.dateUsage);
        return bagDate >= today && bagDate <= nextWeek;
      });

      console.log("Bags information: ", bagsInfo);

      res.render("notification", {
        maincss: "/static/css/main.css",
        css1: "/static/css/notificationPage.css",
        partialcss: "/static/css/notif.css",
        mainscript: "/static/js/home.js",
        js1: "/static/js/notification.js",
        showBot: true,
        /*Sample list for testing bag view*/
        // notifs: [
        //   { bagtype: "travel", date: "Feb 20" },
        //   { bagtype: "personal", date: "Feb 21" },
        // ],
        notifs: alertBagInfo,
      });
    } catch (error) {
      console.log(error);
    }
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
      let userID = req.session.user.uID;
      let userObjId = new mongoose.Types.ObjectId(userID);

      const bagToDisplay = await Bags.findOne({ _id: bagID }).lean().exec();
      console.log("Bag to Display", bagToDisplay);

      // populate bag's userItemPools with users itself
      const bagUsers = await Bags.findById(bagID)
        .populate(["userItemsPool", "bagItems"])
        .exec();

      const bagItems = bagUsers.bagItems;

      const totalUsers = bagUsers.userItemsPool.length;
      console.log("user count: ", totalUsers);

      for (i = 0; i < totalUsers; i++) {
        currentUser = bagUsers.userItemsPool[i];
        currentUserId = currentUser._id;

        if (currentUserId.equals(userObjId)) {
          var bagUsersItemGallery = currentUser.itemGallery.sort();
        }
      }

      console.log("User's items ID:", bagUsersItemGallery);

      // user item list
      let itemList = [];

      try {
        await Promise.all(
          bagUsersItemGallery.map(async (element) => {
            const items = await Items.find({ _id: element }).lean().exec();
            itemList.push(...items);
          })
        );
      } catch (error) {
        console.log("adding items to itemList failed due to: ", error);
      }

      // bag item list
      let bagItemList = [];

      try {
        await Promise.all(
          bagItems.map(async (element) => {
            const items = await Items.find({ _id: element._id }).lean().exec();
            bagItemList.push(...items);
          })
        );
      } catch (error) {
        console.log("adding items to bag items list failed due to: ", error);
      }

      // sort items so its sorted in item pool
      itemList.sort((a, b) => a.itemName.localeCompare(b.itemName));
      bagItemList.sort((a, b) => a.itemName.localeCompare(b.itemName));

      res.render("addItem", {
        maincss: "/static/css/main.css",
        css1: "/static/css/addItem.css",
        partialcss: "/static/css/dItem.css",
        mainscript: "/static/js/home.js",
        js1: "/static/js/add_bagitem.js",
        bagDisplay: bagToDisplay,
        bag: bagItemList,
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

  getItemGallery: async function (req, res) {
    console.log("----GET ITEM GALLERY PAGE----");
    const userID = req.session.user.uID;
    const user = await User.findOne({ _id: userID }).lean().exec();
    console.log("user item gallery look: ", user.itemGallery);

    const userItemsPop = await User.findById(userID)
      .populate("itemGallery")
      .exec();

    const userItems = userItemsPop.itemGallery;

    userItemList = [];

    try {
      await Promise.all(
        userItems.map(async (element) => {
          const items = await Items.find({ _id: element._id }).lean().exec();
          userItemList.push(...items);
        })
      );
    } catch (error) {
      console.log("listing users in bags for items failed due to: ", error);
    }

    // Sort items by name
    userItemList.sort((a, b) => a.itemName.localeCompare(b.itemName));

    res.render("itemGallery", {
      maincss: "/static/css/main.css",
      css1: "/static/css/itemGallery.css",
      partialcss: "/static/css/item.css",
      mainscript: "/static/js/home.js",
      js1: "/static/js/add_galleryitem.js",
      items: userItemList,
      bag: req.params.id,
      user: userID,
    });
  },

  getItemGalleryProfile: async function (req, res) {
    console.log("----GET ITEM GALLERY PAGE----");
    const userID = req.session.user.uID;
    const user = await User.findOne({ _id: userID }).lean().exec();
    console.log("user item gallery look: ", user.itemGallery);

    const userItemsPop = await User.findById(userID)
      .populate("itemGallery")
      .exec();

    const userItems = userItemsPop.itemGallery;

    userItemList = [];

    try {
      await Promise.all(
        userItems.map(async (element) => {
          const items = await Items.find({ _id: element._id }).lean().exec();
          userItemList.push(...items);
        })
      );
    } catch (error) {
      console.log("listing users in bags for items failed due to: ", error);
    }

    // Sort items by name
    userItemList.sort((a, b) => a.itemName.localeCompare(b.itemName));

    res.render("itemGalleryProfile", {
      maincss: "/static/css/main.css",
      css1: "/static/css/itemGallery.css",
      partialcss: "/static/css/item.css",
      mainscript: "/static/js/home.js",
      js1: "/static/js/add_galleryitem.js",
      items: userItemList,
      bag: req.params.id,
      user: userID,
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
        image: "/static/images/bag.png",
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

  postBagCollabStatus: async function (req, res) {
    const {bagID} = req.body;
    try {
      const bag = await Bags.findOne({ _id: bagID });

      // Check if bag is found
      if (!bag) {
        return res.status(404).json({ error: 'Bag not found' });
      }

      // Check if bag item pool has more than one id
      const collabsCount = bag.userItemsPool.length;

      const response = {
        bagID: bag._id,
        hasMultipleCollabs: collabsCount > 1
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Failed to get bag collab status:', error);
      res.status(500).json({ error: 'Failed to get bag collab status' });
    }
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
      mainscript: "/static/js/edit_profile.js",
    });
  },

  postEditProfile: async function (req, res) {
    console.log("------EDIT PROFILE------");
    const userID = req.session.user.uID;

    try {
      const updatedName = req.body.name;
      const updatedAvatar = req.body.profileImage;

      // Check request body for updated name and avatar
      console.log("Updated Name: ", updatedName);
      console.log("Updated Avatar: ", updatedAvatar);

      if (updatedName && updatedAvatar) {
        console.log("Name and Avatar updated");

        const updatedUser = await User.findOneAndUpdate(
          { _id: userID },
          {
            name: updatedName,
            avatar: updatedAvatar,
          },
          { new: true }
        );

        if (updatedUser) {
          console.log("Profile updated successfully");
          res.status(200).json({ message: "Profile updated successfully." });
        } else {
          console.log("Unsuccessful updating profile");
          res.status(500).json({ message: "Error updating profile." });
        }
      } else if (updatedName) {
        console.log("Name updated");

        const updatedUser = await User.findOneAndUpdate(
          { _id: userID },
          {
            name: updatedName,
          },
          { new: true }
        );

        if (updatedUser) {
          console.log("Profile updated successfully");
          res.status(200).json({ message: "Profile updated successfully." });
        }
      } else if (updatedAvatar) {
        console.log("Avatar updated");

        const updatedUser = await User.findOneAndUpdate(
          { _id: userID },
          {
            avatar: updatedAvatar,
          },
          { new: true }
        );

        if (updatedUser) {
          console.log("Profile updated successfully");
          res.status(200).json({ message: "Profile updated successfully." });
        }
      } else {
        console.log("No changes made to profile");
        res.status(200).json({ message: "No changes made to profile." });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
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
        avatar: "/static/images/user.png",
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
      console.log("READ ME");
      console.log(logUser);
      console.log("Session ID: ", req.sessionID);

      if (logUser != null) {
        const userID = logUser._id;
        console.log("user ID: ", userID);
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
      })
        .lean()
        .exec();

      console.log("Bag List: ", userBags);
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

  shareBag: async function (req, res) {
    console.log("------SHARE BAG------");

    const encBag = req.body.bag;
    // const bagToShare = decrypt(encBagToDelete, process.env.KEY);
    const link = `${encBag}`;

    // Create a link that gets copied to clipboard "localhost:3000/join/{encBag}"
    try {
      console.log("Link Generated:", link);
      // Optionally, you can send a response indicating success
      res.status(200).json({ sharelink: link, owner: req.session.user.uID });
    } catch (error) {
      console.error("Failed to copy link to clipboard:", error);
      // Optionally, you can send a response indicating failure
      res.status(500).json({ error: "Failed to copy link to clipboard" });
    }
  },

  deleteBag: async function (req, res) {
    console.log("------DELETE BAG------");

    const encBagToDelete = req.body.bag;
    const bagToDelete = decrypt(encBagToDelete, process.env.KEY);
    console.log("bag ID to delete: ", bagToDelete);

    const userID = req.session.user.uID;

    try {
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

  joinBag: async function (req, res) {
    console.log("-------JOIN BAG--------");

    const userID = req.session.user.uID;

    // Extract the bag ID from the link
    const { link } = req.body;

    if (!link) {
      return res.status(403).json({ error: "Link cannot be empty" });
    }

    const encrbagID = link;
    const bagID = decrypt(encrbagID, process.env.KEY);
    console.log("bagId: ", bagID);
  

    try {
      // Find the bag document by its ID
      const bag = await Bags.findById(bagID);
      const user = await User.findById(userID);

      // Check if the bag exists
      if (!bag) {
        return res.status(404).json({ error: "Bag not found" });
      }
      
      // Check if the current user is the owner of the bag
      if (user.bags.includes(bagID)) {
        return res
          .status(400)
          .json({ error: "You are the owner of this bag!" });
      }

      // Check if the user already exists in the bagCollabs array
      if (bag.bagCollabs.includes(userID)) {
        return res
          .status(400)
          .json({ error: "You already joined this bag!" });
      }

      // Add the user ID to the bag's bagCollabs array
      bag.bagCollabs.push(userID);
      bag.userItemsPool.push(userID);

      // Save the updated bag document
      await bag.save();

      // Optionally, you can send a response indicating success
      res.status(200).json({ link: `/bag/${link}`});
    } catch (error) {
      console.error("Failed to add user to bagCollabs:", error);
      // Optionally, you can send a response indicating failure
      res.status(500).json({ error: "Failed to add user to bagCollabs" });
    }
  },

  findBag: async function (req, res) {
    console.log("-------FIND BAG--------");

    try {
      const bagToFindEnc = req.body.findbag;
      const bagToFind = decrypt(bagToFindEnc, process.env.KEY);
      const bagFound = await Bags.findOne({ _id: bagToFind })
        .populate(["userItemsPool"])
        .exec();

      if (bagFound != null) {
        console.log("bag sched: ", bagFound.dateUsage);
        console.log("Schedule and collaborators sent to client");
        schedToSend = bagFound.dateUsage;
        collabToSend = bagFound.userItemsPool;

        const filteredCollab = collabToSend.filter(
          (obj) => obj._id != req.session.user.uID
        );

        const user = collabToSend.filter(
          (obj) => obj._id == req.session.user.uID
        );

        console.log("BAG COLLABS", collabToSend);
        currentUser = user[0]
        console.log("Current User: ", currentUser);

        res.status(200).json({
          bagDate: schedToSend,
          bagCollab: filteredCollab,
          currentUser: currentUser
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
        bagItems: itemsToSend,
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

  deleteItem: async function (req, res) {
    console.log("-------DELETE ITEM--------");
    const itemID = req.body.itemID;
    console.log(itemID);

    try {
      let userID = req.session.user.uID;

      await User.findOneAndUpdate(
        { _id: userID },
        { $pull: { itemGallery: itemID } }
      ).then(async (deletedItem) => {
        console.log("item deleted successfully in User");
        if (deletedItem) {
          await Items.deleteOne({ _id: itemID }).then((deletedItemItem) => {
            if (deletedItemItem) {
              console.log("item deleted successfully in Items");
              res.status(200).send();
            }
          });
        } else {
          console.log("unsuccessful delete item");
        }
      });
    } catch (error) {
      console.log(error);
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
      if (obj.itemweight == "") {
        var itemW = 0;
      }

      const newItem = new Items({
        _id: new mongoose.Types.ObjectId(),
        itemName: obj.itemname,
        itemWeight: itemW,
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
      console.log(element.itemweight);

      if (element.itemweight == "") {
        var editedItemWeight = 0;
      } else {
        var editedItemWeight = parseInt(element.itemweight);
      }

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

  changeBagName: async function (req, res) {
    const {name, bagID} = req.body;
    try {
      //Update the bag name
      const updatedBag = await Bags.findOneAndUpdate(
          { _id: bagID }, // Find the bag by ID
          { $set: { bagName: name } }, // Set the new bag name
          { new: true } // Return the updated document
      );

      if (!updatedBag) {
          return res.status(404).json({ error: 'Bag not found' });
      }
      // Send a success response
      res.status(200).json({ message: 'Bag name updated successfully', updatedBag });
  } catch (error) {
      console.error('Failed to update bag name:', error);
      res.status(500).json({ error: 'Failed to update bag name' });
  }
  }
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

// export default controller;
module.exports = controller;
