const mongoose = require("mongoose")
const fs = require("fs")
const dotenv = require("dotenv")
dotenv.config({
    path: "./../config.env"
});

const Phone = require("./../models/phoneModel.js")

console.log(Phone)

mongoose.connect(process.env.MONGODB_URL)

mongoose.connection.on("connected", ()=> {
    console.log("mongoose connected to database ")
})

mongoose.connection.on("disconnected", ()=> {
    console.log("mongoose disconnected to database ")
})

const phones = JSON.parse(fs.readFileSync("./phones.json", {
    encoding: "utf-8", flag: "r"
}))

const importFile = async()=> {
    try {
        await Phone.create(phones)
        console.log("Import Phone File Successful..")
    } catch (err) {
        console.log(`Importing File went wrong..\b Message: ${err.message}`)
    }finally{
        mongoose.connection.close();
        process.exit(0)
    }
}

const deleteFile = async()=> {
    try{
        await Phone.deleteMany({})
        console.log("Delete Phone File Successful..")
    }catch(err){
        console.log(`Deleting File went wrong..\b Message: ${err.message}`)
    }finally{
        mongoose.connection.close();
        process.exit(0)
    }
    
}

if(process.argv[2]=== "-import"){
    importFile()
}else if(process.argv[2]=== "-delete"){
    deleteFile()
}else{
    console.log("Nothing...");
}