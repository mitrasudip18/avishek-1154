const express=require('express');
const auth_check=require('../middle-ware/isAuth');
const{check,body}=require('express-validator');
const admin_router=express.Router();
const admin_controller=require('../Controller/admincontroller')

admin_router.get('/home',admin_controller.home,auth_check);
admin_router.get('/home_form',admin_controller.getformdisplay,auth_check);

admin_router.get('/editform/:prodid',admin_controller.editpro,auth_check); 

admin_router.post('/postNewValue',admin_controller.posteditformdata)


admin_router.post('/postValue',
[
    body('ptitle','valid product title here').isLength({min:4,max:100}),
    body('pdescription','valid product description here').isLength({min:4,max:500}),
],  
admin_controller.postformvalue)

admin_router.get('/details',admin_controller.getdetails,auth_check)

admin_router.post('/deleteproduct',admin_controller.deletepost)
admin_router.get('/deletepro/:prodid',admin_controller.deletepro,auth_check)
admin_router.post('/addToCart',admin_controller.postAddToCart);
admin_router.get('/cartpage',admin_controller.cartpage);
admin_router.get('/deletecart/:prodid',admin_controller.deletecart,auth_check)
admin_router.get('/payment',admin_controller.payment,auth_check);
admin_router.get('/congrats',admin_controller.congrats,auth_check);
// admin_router.post('/postnewValue',admin_controller.posteditcartdata)
module.exports = admin_router;