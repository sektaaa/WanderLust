const User = require("../models/user");

module.exports.renderSignUpForm = (req, res) =>{
    res.render("users/signup");
};

module.exports.signUp = async (req, res) =>{
    let {username, email, password} = req.body;
    const newUser = new User ({email, username});
    
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) =>{
        if(err){
            return next(err);
        }
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");

    });
};

module.exports.renderLoginForm =  (req, res) =>{
    res.render("users/login");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectURL = res.locals.redirectURL || "/listings";
    res.redirect(redirectURL);

};

module.exports.logout = (req, res, next) =>{
    req.logout((err) =>{
        if(err){
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
};