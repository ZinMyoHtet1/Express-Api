const mongoose=require("mongoose");

mongoose.connect(process.env.MONGODB_URL)
.then((conn)=>{
    console.log("Connected to MongoDb.. ")
})
.catch(err=>{
    console.log("MongoDb erroring "+ err.message)
})

mongoose.connection.on("connected",()=>{
    console.log("mongoose connected to database ")
})

mongoose.connection.on("disconnected",()=>{
    console.log("mongoose disconnected to database ")
})

process.on("SIGINT",async ()=>{
   await mongoose.connection.close();
   process.close(0)
})