const express=require('express');
const{check,body}=require('express-validator');
const auth_check=require('../middle-ware/isAuth');
const auth_router=express.Router();
const auth_controller=require('../Controller/authcontroller')

auth_router.get('/registration',auth_controller.getform)
auth_router.post('/postreg',
[
    body('fname','valid first name here').isLength({min:3,max:12}),
    body('lname','valid first name here').isLength({min:3,max:12}),
    check('email').isEmail().withMessage("input valid email"),
    body('pwd','Enter Valid Password').matches('^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{4,12}$')
],
auth_controller.postform)
auth_router.get('/log',auth_controller.logform)
auth_router.post('/login',
[
    check('email').isEmail().withMessage("input valid email")
    
],
auth_controller.postlogform)
auth_router.get('/logout',auth_controller.logout,);
auth_router.get('/forgotpassword',auth_controller.forgotpassword);
auth_router.post('/postforgot',auth_controller.postforgot);
auth_router.get('/setnewpassword/:id',auth_controller.setpasswordnew)
auth_router.post('/setpassnew',auth_controller.setpassnew)


module.exports = auth_router;