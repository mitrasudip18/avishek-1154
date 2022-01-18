const express = require('express');
const auth_check=require('../middle-ware/isAuth');
const shop_router = express.Router();
const shopcontroller = require('../Controller/shopcontroller');

shop_router.get('/shpdetails',shopcontroller.getproductdetails,auth_check);
shop_router.get('/shopproduct/:prodid',shopcontroller.viewproductshop,auth_check);
shop_router.post('/srch',shopcontroller.searchpro);
shop_router.post('/addToCart',shopcontroller.AddToCart);
shop_router.get('/cartpage',shopcontroller.cartpage);
shop_router.get('/deletecart/:prodid',shopcontroller.deletecart,auth_check)
shop_router.get('/payment',shopcontroller.payment,auth_check);
shop_router.get('/congrats',shopcontroller.congrats,auth_check);



module.exports = shop_router;