const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

let mongo_URL = "mongodb://127.0.0.1:27017/wanderlust"

async function main() {
    await mongoose.connect(mongo_URL);
};

main().then (() =>{
    console.log("connected to db ");
}).catch ((err) =>{
    console.log(err);
});
    
const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) =>({...obj, owner: "67fa9df8735e958101a90c9c"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();