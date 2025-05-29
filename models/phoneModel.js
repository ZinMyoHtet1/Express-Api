const mongoose = require("mongoose");
//const fs = require("fs");

//const filePath = "./texts/mongodbHistory.txt";

const {
  phonePreSave,
  phonePostSave,
  phonePreFind,
  phonePostFind,
  phonePreAggregate,
} = require("./../middlewares/phoneMiddlewares.js");

const specificationsSchema = new mongoose.Schema(
  {
    display: {
      type: String,
      required: true,
    },
    processor: {
      type: String,
      required: true,
    },
    RAM: {
      type: String,
      required: true,
    },
    storage: {
      type: String,
      required: true,
    },
    battery: {
      type: String,
      required: true,
    },
    camera: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const phoneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return value.length > 3 && value.length < 100;
        },
        message: "The name must have more than 3 and less than 100 letter",
      },
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          return value > 0;
        },
        message: "Invalid amount of money",
      },
    },
    currency: {
      type: String,
      uppercase: true,
      default: "USD",
    },
    image_url: {
      type: String,
      required: true,
    },

    description: String,
    specifications: {
      type: specificationsSchema,
      required: true,
    },
    releaseYear: {
      type: Number,
      required: true,
    },
    createdBy: String,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

phoneSchema.virtual("priceInKyat").get(function () {
  return this.price * 4350;
});

phoneSchema.pre("save", phonePreSave);

phoneSchema.post("save", phonePostSave);

phoneSchema.pre("find", phonePreFind);

//Aggregate

phoneSchema.pre("aggregate", phonePreAggregate);

module.exports = mongoose.model("Phone", phoneSchema);
