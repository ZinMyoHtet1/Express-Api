const mongoose = require("mongoose");

// Check if MONGODB_URL is defined
if (!process.env.MONGODB_URL) {
    console.error("MONGODB_URL environment variable is not defined.");
    process.exit(1);
}

mongoose.connect(process.env.MONGODB_URL, {
    serverSelectionTimeoutMS: 100000 // Adjust as needed
});

// Connection event listeners
mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to database");
});

mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected from database");
    process.exit(1)
});

// Handle application termination
process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("Mongoose connection closed due to application termination");
    process.exit(0);
})