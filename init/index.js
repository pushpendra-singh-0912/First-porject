const mongoose = require("mongoose");
const initData=require("./data.js");   // required sample data to insert
const Listing =require("../models/listing.js")   // required models  


main().then(()=>{
    console.log("connection is done with database");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj)=>({...obj,owner:'6649986e1f33dfb014b72e6e'}));
    await Listing.insertMany(initData.data);
    console.log("data was inserted")
};

initDB();