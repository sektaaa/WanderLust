const Listing = require("../models/listing");

module.exports.index = async (req, res) =>{
    const allListings= await Listing.find({});
    res.render("listings/index", { allListings });

};


module.exports.renderNewForm = (req, res) =>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate("owner")
    .populate({
        path: "reviews", 
        populate: {
            path: "author",
        },
});
    if(!listing) {
        req.flash("error", "Listing you are looking for does not exist!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show", {listing});

};


module.exports.createNewListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created!");
    return res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you are looking for does not exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload/", "/upload/c_fill,h_300,w_250/");

    res.render("listings/edit" , {listing, originalImageUrl});

};

module.exports.updateRoute =  async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}, { new: true });

    if( typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success", " Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) =>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id, {...req.body});
    req.flash("success", " Listing Deleted!");
    res.redirect("/listings");
};