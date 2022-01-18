const path = require('path');
const ProductModel=require("../Model/product");
const CartModel=require("../Model/cart");

exports.getproductdetails = (req,res) =>{
    ProductModel.find().then(products=> {
        console.log("products: ",products);
        res.render('Shop/shopDetails',{
            title:"shop details",
            data: products,
            path:'/shpdetails'
        });
    }).catch(err=>{
        console.log("data fetching error",err);
    })  
    }
    
exports.viewproductshop =(req,res)=>{
    const product_id=req.params.prodid;
    console.log(product_id);
    ProductModel.findById(product_id).then(products=>{
        console.log(products);
        res.render('Shop/ProductDetails',{
            title:"Product details",
                data: products,
                path:'/shopproduct/:prodid'
        })
    }).catch(err=>{
        console.log(err);
    })
}


exports.searchpro=(req,res)=>{
    const productName=req.body.search;
    console.log("searching text: ",productName)
    ProductModel.find({prodTitle:productName}).then(result=>{
        console.log(result);
        res.render('Shop/shopDetails',{
            title: "ProductList",
            data: result,
            path:'/srch'
        });
    }).catch(err=>{
        console.log(err);
    })
}


exports.AddToCart=(req,res)=>{
    const productId=req.body.productId;
    const quantity=req.body.quantity;
    const userId=req.user._id;
    const totalprice=totalprice+req.body.price;
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


