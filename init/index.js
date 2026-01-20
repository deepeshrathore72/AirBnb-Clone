const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// Support both ATLASDB_URL and MONGODB_URL
const DbUrl = process.env.ATLASDB_URL || process.env.MONGODB_URL;

async function main() {
    await mongoose.connect(DbUrl);
};

main().then(()=>{
    console.log("connected to DB");
    initDB();
}).catch((err)=>{console.error(err)});

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner : '696d46dd896b99dd292c30eb'})); //669bfcbfd131a6667508f2d5
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
    mongoose.connection.close();
};