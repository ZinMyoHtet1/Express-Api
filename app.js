const express = require("express");
const path = require("path");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const sanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const hpp = require("hpp");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const CustomError = require("./utils/CustomError.js");
const globalErrorHandler = require("./utils/globalErrorHandler.js");
require("./helpers/mongoose_init.js");

const phoneRoutes = require("./routes/phoneRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");

const { getPhoneStats } = require("./controllers/phoneController.js");

const app = express();

const port = process.env.PORT || 8000;

process.on("unhandleRejection", function () {
  console.log("UnhandleRejection Occuring...");
  server.close(() => process.exit(1));
});

if (process.env.MODE === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 3,
  windowMS: 60 * 1000 * 5,
  message: "You request too much. Try again after 5 minutes",
});

app.use("/api", limiter); //set limiter for preventing forte attack
app.use(express.json({ limit: "10kb" })); //set limit for preventing denial service attack
app.use(express.static("./public"));
app.use(helmet());
// app.use(sanitize());
app.use(hpp({ whitelist: ["price", "releaseYear", "brand"] }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/Templates /index.html"));
});

app.get("/api/v1", (req, res) => {
  res.status(200).send("Hi! Welcome@back");
});

app.get("/api/v1/phone-stats", getPhoneStats);

app.use("/api/v1/phones", phoneRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);

app.all("/{*any}", (req, res, next) => {
  const error = new CustomError(`Route "${req.originalUrl} is not found`, 404);
  next(error);
});

//GLOBAL ERROR HANDLING
app.use(globalErrorHandler);

const server = app.listen(port, () => {
  console.log(`Your server is running on port ${port}`);
});
