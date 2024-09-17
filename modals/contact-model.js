const {Schema , model} = require('mongoose')

const constactSchema = new Schema ({
    fullname : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    subject : {
        type : String,
        required : true
    },
    message : {
        type : String,
        required : true
    },
})

const Contact = new model('Contact', constactSchema);

module.exports = Contact;