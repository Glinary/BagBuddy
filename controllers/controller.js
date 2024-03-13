// import express from "express";
// import bodyParser from "body-parser";
const express = require('express');
const bodyParser = require('body-parser');
const User = require('../schema/Users');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

const controller = {
  getHome: async function (req, res) {
    res.render("home", {
      maincss: "/static/css/main.css",
      css1: "/static/css/home.css",
      partialcss: "/static/css/bag.css",
      mainscript: "/static/js/home.js",
      showTop: true,
      showBot: true,
      showAddBtn: true,
      /*Sample list for testing bag view*/
      bags: [
        { name: "Travel", weight: "5kg", color: "#F2F2F2" },
        { name: "School", weight: "5kg" },
      ],
    });
  },

  getBag: async function (req, res) {
    res.render("insidebag", {
      maincss: "/static/css/main.css",
      css1: "/static/css/home.css",
      mainscript: "/static/js/home.js",
      showBot: true,
      showAddBtn: true,
      /*Sample list for testing inside bag view*/
      bags: [
        { name: "Travel", weight: "5kg", color: "#F2F2F2" },
        { name: "School", weight: "5kg" },
      ],
    });
  },

  getNotif: async function (req, res) {
    res.render("notification", {
      maincss: "/static/css/main.css",
      css1: "/static/css/notificationPage.css",
      partialcss: "/static/css/notif.css",
      mainscript: "/static/js/home.js",
      showBot: true,
      /*Sample list for testing notif view*/
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
      partialcss: "/static/css/item.css",
      mainscript: "/static/js/home.js",
    });
  },

  getAddItem: async function (req, res) {
    res.render("addItem", {
      maincss: "/static/css/main.css",
      css1: "/static/css/addItem.css",
      partialcss: "/static/css/dItem.css",
      mainscript: "/static/js/home.js",
      js1: "/static/js/additem.js",
      /*Sample list for testing add item view*/
      bag: { name: "ETC", weight: "7kg", color: "red" },
      items: [
        { id: "123456", name: "Pencil", weight: "5kg" },
        { id: "123457", name: "Pencil", weight: "5kg" },
        //make sure ID is unique
      ],
    });
  },

  getItemGallery: async function (req, res) {
    res.render("itemGallery", {
      maincss: "/static/css/main.css",
      css1: "/static/css/itemGallery.css",
      partialcss: "/static/css/item.css",
      mainscript: "/static/js/home.js",
      /*Sample list for testing item gallery view*/
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
      mainjs: "/static/js/onboarding.js"
    });
  },

  getLogin: async function (req, res) {
    res.render("login", {
      maincss: "/static/css/main.css",
      css1: "/static/css/login-register.css",
      showTop: false,
      showBot: false,
      showAddBtn: false
    })
  },

  getRegister: async function (req, res) {
    res.render("register", {
      maincss: "/static/css/main.css",
      css1: "/static/css/login-register.css",
      showTop: false,
      showBot: false,
      showAddBtn: false,
      mainjs: "/static/js/register.js"
    })
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
      defaultImg: "/static/images/boy.png"
    })
  },

  getEditProfile: async function (req, res) {
    res.render("editProfile", {
      maincss: "/static/css/main.css",
      css1: "/static/css/editProfile.css",
      showTop: false,
      showBot: true,
      showAddBtn: false,
      mainjs: "/static/js/editProfile.js"
    })
  },

  isNameValid: async function (req, res) {
    try {
      const registerName = req.body.registerName;

      console.log('isValid - Received name: ', registerName);

      // check the database for existing name
      const nameExists = await User.findOne({ name: registerName });
      console.log('isValid - Name exists: ', nameExists);

      if (nameExists) {
        return res.status(400).json({ message: 'Name already in use.' });
      } else {
        res.status(200).json({ message: 'Name is valid.' });
      }
    } catch (error) {
      console.log('Error checking if name exists: ', error);
      res.status(500).json({ message: 'Server error.' });
    }
  },

  isEmailValid: async function (req, res) {
    try {
      const registerEmail = req.body.registerEmail;

      console.log('isValid Email - Received email: ', registerEmail);

      // check the database for existing email
      const emailExists = await User.findOne({ email: registerEmail });
      console.log('isValid - Email exists: ', emailExists);

      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use.' });
      } else {
        res.status(200).json({ message: 'Email is valid.' });
      }
    } catch (error) {
      console.log('Error checking if email exists: ', error);
      res.status(500).json({ message: 'Server error.' });
    }
  },

  newUserRegistration: async function (req, res) {
    try {
      const registerName = req.body.registerName;
      const registerEmail = req.body.registerEmail;
      const registerPassword = req.body.registerPassword;

      console.log('Post-Reg Received name: ', registerName);
      console.log('Post-Reg Received email: ', registerEmail);
      console.log('Post-Reg Received password: ', registerPassword);

      // Register the user in user schema format
      const newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        email: registerEmail,
        name: registerName,
        password: registerPassword
      });

      // save the user to the database
      const savedUser = await newUser.save();
      console.log('User saved: ', savedUser);

      // after successful registration, redirect to login validation
      res.status(200).json({ message: 'User created.' });
    } catch (error) {
      console.log('Error registering user: ', error);
      res.status(500).json({ message: 'Server error.' });
    }
  },
};

// export default controller;
module.exports = controller;