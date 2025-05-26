const mongoose = require("mongoose")
const Phone = require("./../models/phoneModel.js");
const parseQuery = require("./../helpers/parseQuery.js");

const ApiFeature = require("./../utils/ApiFeature.js");
const CustomError = require("./../utils/CustomError.js")
const asyncErrorHandler = require("./../utils/asyncErrorHandler.js")

module.exports = {
    getAllPhones: asyncErrorHandler(async (req, res, next)=> {
        const model = new ApiFeature(Phone, req.query);

        await model.countDocuments();
        const feature = model.filter()
        .sort()
        .selectFields()
        .paginate()

        const phones = await feature.query;

        res.status(200).json({
            status: "success",
            length: phones.length,
            data: {
                phones
            }
        })
    }),

    getPhoneStats: asyncErrorHandler(async (req, res, next)=> {
        const stats = await Phone.aggregate(
            [{
                $match: {
                    price: {
                        $lte: 700
                    }}
            },
                {
                    $group: {
                        _id: "$releaseYear",
                        avgPrice:
                        {
                            $avg: "$price"
                        },
                        minPrice: {
                            $min: "$price"
                        },
                        maxPrice: {
                            $max: "$price"
                        },
                        totalPrice: {
                            $sum: "$price"
                        },
                        phones: {
                            $push: "$name"
                        }
                    }
                },
                {
                    $sort: {
                        minPrice: -1
                    }
                },
                {
                    $addFields: {
                        releaseYear: "$_id"
                    }
                },
                {
                    $project: {
                        _id: 0
                    }
                }]);

        res.status(200).json({
            status: "success",
            length: stats.length,
            data: {
                stats
            }
        })
    }),

    postNewPhone: asyncErrorHandler(async (req,
        res, next)=> {
        const phone = await Phone.create(req.body);

        res.status(200).json({
            status: "success",
            data: {
                phone
            }
        })
    }),

    getPhoneById: asyncErrorHandler(async (req,
        res, next)=> {
        const id = req.params.id;

        const phone = await Phone.findById(id)

        if (!phone) {
            const error = new CustomError("Phone with id is not found", 404)
            return next(error);
        }

        res.status(200).json({
            status: "success",
            data: {
                phone
            }
        })
    }),

    updatePhoneById: asyncErrorHandler(async (req,
        res, next)=> {
        const id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            const error = new CustomError("Invalid phone Id format", 400)
            return next(error)
        }

        const phone = await Phone.findByIdAndUpdate(id,
            req.body,
            {
                new: true,
                runValidators: true
            })

        if (!phone) {
            const error = new CustomError("Phone with id is not found", 404)
            return next(error);
        }
        res.status(200).json({
            status: "success",
            data: {
                phone
            }
        })
    }),

    deletePhoneById: asyncErrorHandler(async(req,
        res, next)=> {
        const id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            const error = new CustomError("Invalid phone Id format", 400)
            return next(error)
        }

        const phone = await Phone.findByIdAndDelete(id);

        if (!phone) {
            const error = new CustomError("Phone with id is not found", 404)
            return next(error);
        }

        res.status(200).json({
            status: "success",
            data: null
        })

    })

}