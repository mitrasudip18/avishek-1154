const ProductModel=require("../Model/product");
const CartModel=require("../Model/cart");
const path=require('path');
const {validationResult}=require('express-validator')


exports.home=(req,res)=>{
    res.render('Admin/Home', {
        title_home:"My form",
        path:'/home',
        error:[]
    })
}
// exports.about=(req,res)=>{
//     res.render('Admin/Home', {
//         title_home:"My form",
//         path:'/home',
//         error:[]
//     })
// }
exports.getformdisplay=(req,res)=>{
    res.render('Admin/addproduct', {
        title_page:"My form",
        path:'/home_form',
        error:[]
    })
}


exports.postformvalue=(req,res)=>{
    console.log("collected value form form: ", req.body);
    const productTitle = req.body.ptitle;
    const productprice = req.body.pprice;
    const productdescription = req.body.pdescription;
    const product_img=req.file;
    console.log(product_img);
    const pimageurl=product_img.path;
    const Product=new ProductModel({prodTitle:productTitle,prodPrice:productprice,prodDesc:productdescription,prodImage:pimageurl});
    
    let error=validationResult(req);
    if(!error.isEmpty())
    {
        errorResponse=validationResult(req).array();
    console.log("error response",errorResponse);
    res.render("Admin/addproduct",{
        title_page: "registration form",
        path:'/home_form',
        // errorMsg:'',
        error:errorResponse,
        
    })
}
else{
    Product.save().then(results=>{
        console.log('created product',results);
    }).catch(err=>{
        console.log(err)
    });
    res.redirect('/details');
}
}
exports.getdetails=(req,res)=>{
    ProductModel.find().then(products=> {
        console.log("products: ",products);
        res.render('Admin/table-details' ,{
            title:"details page", 
            data : products,
            path:'/details'

    });
}).catch(err=>{
    console.log("data fetching error",err);
})  
}

exports.editpro =(req,res)=>{
    const product_id=req.params.prodid;
    console.log(product_id);
    ProductModel.findById(product_id).then(products=>{
        console.log(products);
        res.render('Admin/editdtls',{
            title:"Product details",
                data: products,
                path:'/editform/:prodid'
                
        })
    }).catch(err=>{
        console.log(err);
    })
}

exports.posteditformdata=(req,res)=>{
    const product_id=req.body.mdbid;
    const updateTitle = req.body.ptitle;
    const updatePrice = req.body.pprice;
    const updateDesc = req.body.pdescription;
    // const productdescription = req.body.pdescription;
    const product_img=req.file;
    console.log(product_img);
    const pimageurl=product_img.path;
    ProductModel.findById(product_id).then(productsData=>{
        console.log('products',productsData);
        productsData.prodTitle=updateTitle;
        productsData.prodPrice=updatePrice;
        productsData.prodDesc=updateDesc;
        productsData.prodImage=pimageurl;

    return productsData.save().then(results=>{
        console.log('created product',results);
        res.redirect('/details');
    })
    }).catch(err=>{
        console.log(err)
    });
    
}



exports.deletepro=(req,res)=>{
    const product_id=req.params.prodid;
    // console.log(product_id);
    ProductModel.deleteOne({_id:product_id}).then(result=>{
        console.log(result);
        res.redirect('/details');
        
    }).catch(err=>{
        console.log(err);
    })
}


exports.deletepost=(req,res)=>{
    const product_id=req.body.product_id;
    // console.log(product_id);
    ProductModel.deleteOne({_id:product_id}).then(result=>{
        console.log(result);
        res.redirect('/details');
    }).catch(err=>{
        console.log(err);
    })
}

exports.postAddToCart=(req,res)=>{
    const productId=req.body.productId;
    const quantity=req.body.quantity;
    const userId=req.user._id;
    const cartValue=[];
    console.log("After Add to Cart: productId:",productId,"quantity",quantity,"userId",userId);
    CartModel.find({userId:userId,productId:productId})
    .then(cartData=>{
        console.log("cart data:",cartData)
        if(cartData=='')
        {
            ProductModel.findById(productId)
            .then(productForCart=>{
                cartValue.push(productForCart);
                const cartProduct =new CartModel({productId:productId,quantity:quantity,userId:userId,cart:cartValue});
                cartProduct.save()
                .then(result=>{
                    console.log('product added to cart successfully');
                    res.redirect('/cartpage');
                }).catch(err=>{
                    console.log(err);
                })
            }).catch(err=>{
                console.log(err);
            })
        }
    })
}



exports.cartpage=(req,res)=>{
    const user_Id=req.session.user._id;
    console.log('user_Id',user_Id);
    CartModel.find({userId:user_Id}).then(products=>{
        console.log('cart product',products);
        res.render('Shop/cartpage',{
            title:"Product details",
                data: products,
                path:'/cartpage'
        })
    }).catch(err=>{
        console.log(err);
    })
}
    

exports.deletecart=(req,res)=>{
    const product_id=req.params.prodid;
    // console.log(product_id);
    CartModel.deleteOne({_id:product_id}).then(result=>{
        console.log(result);
        res.redirect('/cartpage');
        
    }).catch(err=>{
        console.log(err);
    })
}


exports.payment=(req,res)=>{
    res.render('Shop/payment', {
        title_page:"My form",
        path:'/payment',
        
    })
}
exports.congrats=(req,res)=>{
    res.render('Shop/congrats', {
        title_page:"My form",
        path:'/congrats',
        
    })
}
