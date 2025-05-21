const mongoose = require('mongoose');

const specificationsSchema = new mongoose.Schema({
    display: {
        type: String, required: true
    },
    processor: {
        type: String, required: true
    },
    RAM: {
        type: String, required: true
    },
    storage: {
        type: String, required: true
    },
    battery: {
        type: String, required: true
    },
    camera: {
        type: String, required: true
    }
}, {
    _id: false
});

const phoneSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        uppercase: true,
        default: "USD"
        },
        image_url: {
            type: String,
            required: true
        },
        description: String,
        specifications: {
            type: specificationsSchema,
            required: true
        },
        releaseYear: {
            type: Number,
            required: true
        }
    }, {
        timestamps: true, toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        }
    });

phoneSchema.virtual("priceInKyat").get(function() {
        return this.price*4350
    })
    
phoneSchema.pre("save",function (next){
    this.createdBy= "JYS"
    next()
})

module.exports = mongoose.model("Phone", phoneSchema);