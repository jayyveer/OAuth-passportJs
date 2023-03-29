const express = require("express");
const router = express.Router();
const passport = require("passport");

//auth login
router.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

router.get("/logout", (req, res) => {
  //handle wiht passport
  req.logout();
  res.redirect("/");
});

//auth google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

//callback route for google to rediercect to
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  // res.send(req.user)
  res.redirect("/profile");
});

module.exports = router;
