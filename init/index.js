const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{console.error(err)});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner : '6696c9ad65a6099d5769ecda'})); //set the owner id for testing purposes
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};
initDB();