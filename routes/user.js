const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectURl } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");


const userController = require ("../controllers/users.js");
const user = require("../models/user.js");

router.route("/signup")
   .get(userController.renderSignUpForm)
   .post( wrapAsync(userController.signUp)
);

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectURl,
    passport.authenticate("local",{
        failureRedirect: "/login", 
        failureFlash: true}), userController.login
);
        
         

router.get("/logout", userController.logout);








module.exports = router;