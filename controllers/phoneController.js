const fs = require("fs");

const phones = JSON.parse(fs.readFileSync("./jsons/phone.json", {
    encoding: "utf8", flag: "r"
}));

module.exports = {
    getPhones: (req, res)=> {
        res.status(200).json({
            status: "success", data: {
                phones
            }})},

    postPhones: (req, res)=> {
        const newPhone = {
            ...req.body,
            id: phones.length+1
        }

        phones.push(newPhone);

        fs.writeFile("./jsons/phone.json", JSON.stringify(phones), (err)=> {
            if (err) {
                res.status(400).send(err.message)
                return;
            }
            res.status(200).send("Created");
        })
    }
}