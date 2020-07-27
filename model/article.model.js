const mongoose = require("mongoose")
const marked = require('marked')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const window = new JSDOM('').window
const DomPurify = createDomPurify(window)


const articleSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true
    }, 
    title2:{
        type: String, 
        required: true
    },
    description: {
        type: String, 
        required: true
    }, 
    createdAt: {
        type: String,
        default: (new Date()).toLocaleString()
    }, 
    sanitizedHTML: {
        type: String, 
        required: true
    }
})


articleSchema.pre('validate', function(next){   
    if(this.description){
        this.sanitizedHTML = DomPurify.sanitize(marked(this.description))
    }
    next()

})
const articleModel = mongoose.model('article', articleSchema)

module.exports = articleModel