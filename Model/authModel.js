const mongoose = require('mongoose');
const SchemaVariable=mongoose.Schema;

const ProductSchema=new SchemaVariable({
    prodfname:{
        type:String,
        required:true
    },
    prodlname:{
        type:String,
        required:true
    },
    
    prodemail:{
        type:String,
        required:true
    },
    prodpwd:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model('Authentic',ProductSchema);