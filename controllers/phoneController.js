const fs = require("fs");

const phones = JSON.parse(fs.readFileSync("./jsons/phone.json", {
    encoding: "utf8", flag: "r"
}));

module.exports = {
    getAllPhones: (req, res)=> {
        res.status(200).json({
            status: "success",
            requestTime: req.requestTime,
            data: {
                phones
            }})},

    postNewPhone: (req, res)=> {
        const newPhone = {
            ...req.body,
            id: String(phones.length+1)
        }

        phones.push(newPhone);

        fs.writeFile("./jsons/phone.json", JSON.stringify(phones), (err)=> {
            if (err) {
                res.status(400).send(err.message)
                return;
            }
            res.status(200).send("Created");
        })
    },
    getPhoneById: (req,res)=>{
        const {id}=req.params;
        
        const foundPhone=phones.find(ph=>ph.id ===id)
        
        if(!foundPhone){
            res.status(404).json({
                status: "fail",
                message: `Not found any data with Id ${id}`
            })
            return;
        }
        
        res.status(200).json({
            status: "success",
            data:{
                phone: foundPhone
            }
        })
    },
    
    updatePhoneById: (req,res)=>{
        const {id}=req.params;
        const updateData=req.body;
        
        const foundPhone=phones.find(ph=>ph.id ===id);
        
        if(!foundPhone){
            res.status(404).json({
                status: "fail",
                message: `Not found any data with Id ${id}`
            })
            return;
        }
        
        const index=phones.indexOf(foundPhone);
        
        const updatedPhone=Object.assign(foundPhone,updateData);
        
        phones[index]=updatedPhone;
        
        fs.writeFile("./jsons/phone.json", JSON.stringify(phones), (err)=> {
            if (err) {
                res.status(400).send(err.message)
                return;
            }
            res.status(200).json({
                status: "success",
                data:{
                    phone: updatedPhone
                }
            });
        })
    },
    
    deletePhoneById: (req,res)=>{
        const {id}=req.params;
        
        const foundPhone=phones.find(ph=>ph.id ===id);
        
        if(!foundPhone){
            res.status(404).json({
                status: "fail",
                message: `Not found any data with Id ${id}`
            })
            return;
        }
        
        const index=phones.indexOf(foundPhone);
        
        phones.splice(index,1);
        
        fs.writeFile("./jsons/phone.json", JSON.stringify(phones), (err)=> {
            if (err) {
                res.status(400).send(err.message)
                return;
            }
            res.status(200).json({
                status: "success",
                data:{
                    phone: null
                }
            });
        })
    }
}