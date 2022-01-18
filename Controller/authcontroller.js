const path=require('path')
const AuthModel=require("../Model/authModel")

const bcrypt=require('bcryptjs')
const nodemailer=require('nodemailer')
const sendGridMailer=require('nodemailer-sendgrid-transport');
const {validationResult}=require('express-validator');
const { title } = require('process');

const createTransporter=nodemailer.createTransport(sendGridMailer({
    auth:{
        api_key:'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'
    }
}))

exports.getform=(req,res)=>{
    let message=req.flash('error');
    console.log(message);
    if(message.length>0)
    {
        message=message[0];
    }
    else{
        message=null;
    }
    res.render('Auth/registration', {
        title_page:"My form",
        path:'/registration',
        errorMsg:message,
        error:[]
    })
}


exports.postform=(req,res)=>{
    const ufirstn = req.body.fname;
    const ulastn = req.body.lname;
    const uemail = req.body.email;
    const upwd =req.body.pwd;
    
    let error=validationResult(req);
    if(!error.isEmpty())
    {
        errorResponse=validationResult(req).array();
    console.log("error response",errorResponse);
    res.render("Auth/registration",{
        title_page: "registration form",
        path:'/registration',
        errorMsg:'',
        error:errorResponse
    })
}

else
{
    AuthModel.findOne({prodemail:uemail})
    .then(userValue=>{
        if(userValue)
        {   
            console.log(userValue,"Email already exist");
            req.flash('error','Email already exist, Try new email')
            return res.redirect('/registration');
        }
        return bcrypt.hash(upwd,12)
        .then(hashPassword=>{
            const userData=new AuthModel({prodfname:ufirstn,prodlname:ulastn,prodemail:uemail,prodpwd:hashPassword})
            return userData.save()
        }).then(result=>{
            console.log('registration done')

            createTransporter.sendMail({
                to:uemail,
                from:"mitrasudip18@gmail.com",
                subject:"registration procedure",
                html:"<h1>You have successfully registered. </h1>"
            })
            return res.redirect('/log')
        }).catch(err=>{
            console.log(err)
        })
    }).catch(err=>{
        console.log(err)
    })
}
}

exports.logform=(req,res)=>{
    let message=req.flash('error');
    console.log(message);
    if(message.length>0)
    {
        message=message[0];
    }
    else{
        message=null;
    }
    res.render('Auth/login', {
        title_page:"My form",
        path:'/log',
        erorMsg:message,
        cookie_data:req.cookies,
        error:[]
    })
}
exports.postlogform=(req,res,next)=>{
    const email=req.body.email;
    const password=req.body.pwd;
    const checked=req.body.checked;
    let error=validationResult(req);
    if(!error.isEmpty())
    {
        errorResponse=validationResult(req).array();
    console.log("error response",errorResponse);
    res.render("Auth/login",{
        title_page: "registration form",
        path:'/log',
        errorMsg:'',
        error:errorResponse
    })
}
else{
    AuthModel.findOne({prodemail:email})
    .then(userValue=>{
        if(!userValue)
        {
            console.log('Invalid Email');
            req.flash('error','Invalid Email')
            return res.redirect('/log')
        }
        bcrypt.compare(password,userValue.prodpwd)
        .then(result=>{
            if(!result)
            {
                console.log('invalid password');
                req.flash('error','Invalid Password')
            }
            else{
                console.log('logged in'+result);
                req.session.isLoggedIn=true;
                req.session.user=userValue;

                return req.session.save(err=>{
                    if(err)
                    {
                        console.log(err);
                    }
                    else{
                        if(checked)
                        {
                            const cookiedata={emailCookie:userValue.prodemail,password:password};
                            res.cookie("cookiedata",cookiedata,{
                                expires:new Date(Date.now()+120000),
                                httpOnly: true
                            })
                        }
                    }
                    createTransporter.sendMail({
                        to:email,
                        from:"mitrasudip18@gmail.com",
                        subject:"registration procedure",
                        html:"<h1>You have successfully logged in. </h1>"
                    })
                    console.log('logged in');
                    return res.redirect('/shpdetails');
                })
            }
            res.redirect('/log')
        }).catch(err=>{
            console.log(err);
            res.redirect('/log')
        })
    }).catch(err=>{
        console.log("error find in email",err);
    })

}}

exports.logout = (req, res) => {
    req.session.destroy(err => {

        res.redirect('/home');
    });

}

exports.forgotpassword=(req,res)=>{
    res.render('Auth/forgot',{
        title:"My form",
        path:'/forgotpassword'
    })
    
    
}


    exports.postforgot=(req,res)=>{
        const uemail=req.body.email;
        AuthModel.findOne({prodemail:uemail})
        .then(userValue=>{
            if(!userValue)
            {
                console.log('invalid email');
                return res.redirect('/log')
            }
            else{
                const user_id=userValue._id;
                            console.log('user Id: '.user_id)
                            const url="http://localhost:1233/setnewpassword/"+user_id;
                            console.log(url)
                            const text="Click here --> "
                        createTransporter.sendMail({
                            to:uemail,
                            from:"mitrasudip18@gmail.com",
                            subject:"registration procedure",
                            html:text.concat(url)
                        })
                        return res.redirect('/log');
            }
        })
    }

 
    exports.setpasswordnew =(req,res)=>{
        const user_id=req.params.id;
        console.log(user_id);
        AuthModel.findById(user_id).then(userValue=>{
            console.log(userValue);
            res.render('Auth/setpass',{
                title:"Product details",
                    data: userValue,
                    path:'/setnewpassword/:id'
                    
            })
        }).catch(err=>{
            console.log(err);
        })
    }

exports.setpassnew=(req,res)=>{
    const user_id=req.body.id;
    const fname=req.body.fname;
    const lname=req.body.lname;
    const email=req.body.email;
    const password=req.body.password;
    
    AuthModel.findById(user_id).then(userValue=>{
        return bcrypt.hash(password,12)
        .then(hashPassword=>{ 
        userValue.prodfname=fname;
        userValue.prodlname=lname;
        userValue.prodemail=email;
        userValue.prodpwd=hashPassword;
        return userValue.save()
    })
        .then(results=>{
            console.log('created product',results);
            res.redirect('/log');
        })
        }).catch(err=>{
            console.log(err)
        });
        
    }

    exports.deletepro=(req,res)=>{
        const product_id=req.params.prodid;
        // console.log(product_id);
        CartModel.deleteOne({_id:product_id}).then(result=>{
            console.log(result);
            res.redirect('/details');
            
        }).catch(err=>{
            console.log(err);
        })
    }
      
      
                           

      


     










