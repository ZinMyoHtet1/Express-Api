const Phone = require("./../models/phoneModel.js");
const parseQuery = require("./../helpers/parseQuery.js");

const ApiFeature = require("./../utils/ApiFeature.js")

module.exports = {
    getAllPhones: async (req, res)=> {
        try {
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

        }catch(err) {
            res.status(404).json({
                status: "fail",
                message: err.message
            })
        }

    },

    getPhoneStats: async (req, res)=> {
        try {
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
                    }
                    ]);

            res.status(200).json({
                status: "success",
                length: stats.length,
                data: {
                    stats
                }
            })
        }catch(err) {
            res.status(404).json({
                status: "fail",
                message: err.message
            })
        }
    },

    postNewPhone: async (req,
        res)=> {
        try {
            const phone = await Phone.create(req.body);

            res.status(200).json({
                status: "success",
                data: {
                    phone
                }
            })
        }catch(err) {
            res.status(404).json({
                status: "fail",
                message: err.message
            })
        }
    },

    getPhoneById: async (req,
        res)=> {
        try {
            const phone = await Phone.findById(req.params.id)

            res.status(200).json({
                status: "success",
                data: {
                    phone
                }
            })
        }catch(err) {
            res.status(404).json({
                status: "fail",
                message: err.message
            })
        }
    },

    updatePhoneById: async (req,
        res)=> {
        try {
            const phone = await Phone.findByIdAndUpdate(req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                })

            res.status(200).json({
                status: "success",
                data: {
                    phone
                }
            })
        }catch(err) {
            res.status(404).json({
                status: "fail",
                message: err.message
            })
        }
    },

    deletePhoneById: async(req,
        res)=> {
        try {
            await Phone.findByIdAndDelete(req.params.id)
console.log("Deleted")
            res.status(204).json({
                status: "success",
                data: null
            })
        }catch(err) {
            res.status(404).json({
                status: "fail",
                message: err.message
            })
        }
    }

}