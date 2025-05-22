const mongoose = require("mongoose");

// Check if MONGODB_URL is defined
if (!process.env.MONGODB_URL) {
    console.error("MONGODB_URL environment variable is not defined.");
    process.exit(1);
}

// Function to connect to MongoDB
const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            serverSelectionTimeoutMS: 100000 // Adjust as needed
        });
        console.log("Connected to MongoDB...");
    } catch (err) {
        console.error("MongoDB connection error: " + err.message);
        process.exit(1); // Exit the process if connection fails
    }
};

// Connection event listeners
mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to database");
});

mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected from database");
});

// Handle application termination
process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("Mongoose connection closed due to application termination");
    process.exit(0);
});

// Connect to the database
connectToDatabase();
