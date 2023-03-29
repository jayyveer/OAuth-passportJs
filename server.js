const express = require("express");
const authRoutes = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-routes");
const passport = require("passport");
const passportSetup = require("./config/passport-setup");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const cookieSession = require("cookie-session");

const app = express();

//set view engine
app.set("view engine", "ejs");

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.cookie.cookieKey],
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(keys.mongo.dbURL, {
  // connect to MongoDB using the URL and options
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection; // get a reference to the database connection object

db.on("error", (err) => {
  // log any errors that occur when connecting to the database
  console.log(err);
});

db.once("open", () => {
  // log a message when the connection is established successfully
  console.log("DB Connection Established");
});

//set routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

//create home route
app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

app.listen(3007, () => {
  console.log("Server has started on port 3007");
});
