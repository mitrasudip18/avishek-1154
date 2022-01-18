const express=require('express');
const appserver = express();
const path=require('path');
const AuthModel=require('../mongooseproject/Model/authModel')
const auth_check=require('../mongooseproject/middle-ware/isAuth');
const session=require('express-session');
// session package used to store info in memory but it has no infinite resources.
const mongodb_session=require('connect-mongodb-session')(session);
// used to store data in mongodb in a session package
const multer=require('multer');
//multer is a node.js middlewarefor handling multipart/formdata
//which is primarily used for uploading files
const cookieParser=require('cookie-parser')
const flash = require('connect-flash');

const csurf=require('csurf')


const mongoose=require('mongoose')
const dbDriver="mongodb+srv://Avishek1213:ritika.9@cluster0.7qaa8.mongodb.net/Shopping?retryWrites=true&w=majority"

const admin_router = require('./Router/adminroute');
const shop_router = require('./Router/shoproute');
const auth_router=require('./Router/authroute');
const csrfProtection=csurf();


// const mongoconnect= require('./Database/db').mongoconnect;
//it only import mongo connect method


appserver.use(express.urlencoded());
appserver.set('view engine', 'ejs');
appserver.set('views','view'); //views is predefine but view is folder name

appserver.use(flash());
appserver.use(cookieParser());

appserver.use(express.static(path.join(__dirname,'public')))

//To store data in mongodb collection session
const storeValue=new mongodb_session({
    uri:"mongodb+srv://Avishek1213:ritika.9@cluster0.7qaa8.mongodb.net/Shopping",
    collection:'my-session'
})  

appserver.use(session({secret:'secret-key',resave:false,saveUninitialized:false,store:storeValue}))
// session in function here to stop resaving, resave value false;
// to stop storing uninitialized value,save uninitialized:false;

appserver.use('/UploadedImage',express.static(path.join(__dirname,'UploadedImage')))
//path setup where to updata and what path name in start

//to use storage to adding to database
const fileStorage=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,'UploadedImage')
    },
    filename:(req,file,callback)=>{
    callback(null,file.originalname)
}
});

//file.mimetype==='image/jpg';
const fileFilter=(req,file,callback)=>{
    if(file.mimetype.includes("png")||file.mimetype.includes("jpg")||file.mimetype.includes("jpeg"))
    {
        callback(null,true)
    }
    else
    {
        callback(null,false)
    }
}

appserver.use(multer({storage:fileStorage,fileFilter:fileFilter,limits:{fieldSize:1024*1024*5}}).single('pimage'));


// appserver.use(flash());
// appserver.use(multer({storage:fileStorage,fileFilter:fileFilter,limits:{fieldSize:1024*1024*5}}).single('pimage'));


appserver.use((req,res,next)=>{
    if(!req.session.user)
    {
        return next();
    }
    AuthModel.findById(req.session.user._id)
    .then(userValue=>{
        req.user=userValue;
        console.log('user details:',req.user)
        next();
    }).catch(err=>console.log("user not found",err));
});

appserver.use(csrfProtection); 
// csurfProtection() always use after cookie and session

appserver.use((req,res,next)=>{
    res.locals.isAuthenticated=req.session.isLoggedIn;
    res.locals.csrf=req.csrfToken();
    next();
})

appserver.use(admin_router);
appserver.use(shop_router);
appserver.use(auth_router);







mongoose.connect(dbDriver,{useNewUrlParser:true,useUnifiedTopology:true}).then(result=>{
    appserver.listen(1233,()=>{
        console.log("Server is running at localhost:1233");
    });
})
.catch(err=>{
    console.log(err);
})



// mongoconnect(()=>{
//     appserver.listen(1121,()=>{
//         console.log("server connected at localhost:1121")
//     })
// })


// appserver.listen(1122, ()=>{
//     console.log("Server is connected at localhost:1122")
// })