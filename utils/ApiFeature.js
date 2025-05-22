const parseQuery = require("./../helpers/parseQuery.js");

class ApiFeature {
    constructor(model, queryStr) {
        this.model=model
        this.query = model;
        this.queryStr = queryStr;
        this.documentCount=0;
    }
    
    async countDocuments(){
        try{
            this.documentCount = await this.model.countDocuments();
        } catch (error) {
            throw new Error("Could not count document")
    }}

    filter() {
        const queryObject = {
            ...parseQuery(this.queryStr)}

        this.query = this.query.find(queryObject);
        return this;
    }

    sort() {
        const sortObject = {createdAt: -1};
        if (this.queryStr.sort) {
            const sortArray = this.queryStr.sort.split(",")

            for (const sorter of sortArray) {
                const [value,
                    mode] = sorter.split(":")
                sortObject[value] = mode
            }
        }
        this.query = this.query.sort(sortObject);
        return this;
    }

    selectFields() {
        let fields = "";
        if (this.queryStr.fields) {
            fields = this.queryStr.fields.split(",").join(" ")
        } else {
            fields = "-__v"
        }
        this.query = this.query.select(fields);
        return this;
    }
    
    paginate(){
        const page=this.queryStr.page*1 || 1;
            const limit=this.queryStr.limit*1 || 10;
            
            const skip=(page -1)*10;
            
            if(skip>this.documentCount){
                throw new Error("There is no document for this page")
            }
            this.query=this.query.skip(skip).limit(limit)
            return this;
    }
}

module.exports = ApiFeature;