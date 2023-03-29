// Importing required modules in Node.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const keys = require("./keys"); // importing API keys stored in a separate file
const User = require("../models/User"); // importing User model from '/models/User' directory

// Serializing user id to a session/cookie
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserializing user id from a session/cookie
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});


// Adding Google OAuth 2.0 Strategy to Passport middleware
passport.use(
  new GoogleStrategy( // Creating new Google OAuth 2.0 strategy
    {
      //options for the google strategy
      callbackURL: "/auth/google/redirect", // redirect URI after successful authentication 
      clientID: keys.google.clientID, // Client ID of the registered Google OAuth App 
      clientSecret: keys.google.clientSecret, // Client Secret of the registered Google OAuth App
    },
    async (accessToken, refreshToken, profile, done) => {
      //passport callback function
      //Check if user already exists
      // This is a passport callback function that will be invoked after a user authenticates through Google OAuth2. It takes four parameters: accessToken, refreshToken, profile, and done.

      try {

        //Check if user already exists or not
        const currentUser = await User.findOne({ googleId: profile.id });

        if (currentUser) {
          console.log("User is already present: ", currentUser);
          done(null, currentUser);
        } else {
          //create a new user in the databse
          const newUser = new User({
            username: profile.displayName,
            googleId: profile.id,
          });
          //save the user in the databse
          const savedUser = await newUser.save();
          console.log("User added successfully- ", savedUser);
          done(null, savedUser);
        }
      } catch (error) {
        console.log("Error has occured: ", error);
        done(error);
      }
    }
  )
);
