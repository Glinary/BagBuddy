// import express from "express";
// import bodyParser from "body-parser";
const express = require('express');
const bodyParser = require('body-parser');

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
      showAddBtn: false
    })
  }
};

// export default controller;
module.exports = controller;