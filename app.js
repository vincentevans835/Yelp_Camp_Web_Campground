if(process.env.NODE_ENV!== 'production'){
    require('dotenv').config()
}

const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const ExpressError = require('./utils/ExpressError')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize');

const user_Routes = require('./routes/user_route')
const campground_Routes = require('./routes/campground_route')
const reviews_Routes = require('./routes/reviews_route')

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection
db.on("error",console.error.bind(console,"connection error"))
db.once("open",()=>{
    console.log("Database Connected")
})

const app = express()

app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))
app.use(mongoSanitize())

const sessionConfig = {
    secret:'12345',
    resave:false,
    saveUninitialized: true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.currentUser = req.user
    res.locals.success =  req.flash('success')
    res.locals.error =  req.flash('error')
    next()
})
app.use('/',user_Routes)
app.use('/campgrounds',campground_Routes)
app.use('/campgrounds/:id/reviews',reviews_Routes)

app.get('/',(req,res)=>{
    res.render('home')
})
app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404))
})
app.use((err,req,res,next)=>{
    const { statusCode = 500,message='Something went wrong'} = err
    if(!err.message) err.message = 'Oh No, Something Went Wrong'
    res.status(statusCode).render('error',{err})
})
app.listen(3000,()=>{
    console.log('Serving on port 3000')
})