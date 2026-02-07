const mongoose = require("mongoose")
require('dotenv').config()

mongoose.set("strictQuery",false)

const url = process.env.MONGODB_URI

console.log("Connecting to " + url)
mongoose.connect(url,{family:4})
    .then(result =>{
        console.log("Connected to MongoDB")
    })
    .catch(error =>{
        console.log("error connecting to MongoDB" + error.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

personSchema.set("toJSON",{
    transform: (document,returnedObject) => {
        returnedObject._id = returnedObject._id.toString()
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Person",personSchema)

