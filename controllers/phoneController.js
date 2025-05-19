const Phone = require("./../models/phoneModel.js");
const parseQuery = require("./../helpers/parseQuery.js")

module.exports = {
    getAllPhones: async (req, res)=> {
        try {
            //Destructure parseQuery and remove sort property
            
            //Query
            const queryObject = {
                ...parseQuery(req.query)}

            let query = Phone.find(queryObject);

            //Sorting
            const sortObject = {};
            if (req.query.sort) {
                const sortArray = req.query.sort.split(",")
                
                for (const sorter of sortArray) {
                    const [value,
                        mode] = sorter.split(":")
                    sortObject[value] = mode
                }
                
            }
            query = query.sort(sortObject)
            
            //Fielding
            let fields="";
            if(req.query.fields){
            fields=req.query.fields.split(",").join(" ")
            }else{
                fields="-__v"
            }
            
            query=query.select(fields)
            
            //Pagination
            const page=req.query.page*1 || 1;
            const limit=req.query.limit*1 || 10;
            
            const skip=(page -1)*10;
            
            const documentCount= await Phone.countDocuments();
            
            if(skip>documentCount){
                throw new Error("There is no document for this page")
            }
            
            query=query.skip(skip).limit(limit)

            const phones = await query;
            res.status(200).json({
                status: "success",
                count: phones.length,
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
            const phone = await Phone.findByIdAndDelete(req.params.id)

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