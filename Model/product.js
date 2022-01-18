const mongoose = require('mongoose');
const SchemaVariable=mongoose.Schema;

const ProductSchema=new SchemaVariable({
    prodTitle:{
        type:String,
        required:true
    },
    prodPrice:{
        type:Number,
        required:true
    },
    
    prodDesc:{
        type:String,
        required:true
    },
    prodImage:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model('Products',ProductSchema);