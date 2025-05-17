const Phone = require("./../models/phoneModel.js")

module.exports = {
    getAllPhones:async (req, res)=> {
        try{
            const phones=await Phone.find();
        res.status(200).json({
                status: "success",
                data:{
                    phones
                }
            })
        
        }catch(err){
            res.status(404).json({
                status: "fail",
                message: err.message
            })
        }
        
    },

    postNewPhone:async (req, res)=> {
        try{
            const phone=await Phone.create(req.body);
            
            res.status(200).json({
                status: "success",
                data:{
                    phone
                }
            })
        }catch(err){
            res.status(404).json({
                status: "fail",
                message: err.message
            })
        }
    },
    
    getPhoneById:async (req, res)=> {
        try{
            const phone=await Phone.findById(req.params.id)
            
            res.status(200).json({
                status: "success",
                data:{
                    phone
                }
            })
        }catch(err){
            res.status(404).json({
                status: "fail",
                message: err.message
            })
        }
    },

    updatePhoneById:async (req, res)=> {
        try{
            const phone=await Phone.findByIdAndUpdate(req.params.id,req.body,{new: true,runValidators: true})
            
            res.status(200).json({
                status: "success",
                data:{
                    phone
                }
            })
        }catch(err){
            res.status(404).json({
                status: "fail",
                message: err.message
            })
        }
    },

    deletePhoneById: async(req, res)=> {
        try{
            const phone=await Phone.findByIdAndDelete(req.params.id)
            
            res.status(204).json({
                status: "success",
                data:null
            })
        }catch(err){
            res.status(404).json({
                status: "fail",
                message: err.message
            })
        }
    }
    
}