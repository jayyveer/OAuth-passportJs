const express = require("express");
const router = express.Router();

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.redirect("auth/login");
  } else {
    next();
  }
};

router.get("/", authCheck, (req, res) => {
  const userName = req.user.username;
  res.render("profile", { user: req.user });
  //   res.status(200).send(`Your are logged in as: ${userName}`);
});

module.exports = router;
