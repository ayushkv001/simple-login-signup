const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

app.set('view engine','ejs')

mongoose.connect("mongodb://localhost:27017/simpleLogin",{
    useNewUrlParser: true
},()=>{
    console.log("database connected")
})
mongoose.Promise = global.Promise;
mongoose.connection.on('error',(err)=>{
    console.log(err)
})


const userSchema = new mongoose.Schema({
    name : String,
    username :String,
    password : String,
    email : String,
    gender : String,
})

const User = new mongoose.model("users",userSchema)

let p1,p2;

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname+'/webpages/index.html'))
})
app.get('/signup',(req,res)=>{
    res.sendFile(path.join(__dirname+'/webpages/signup.html'))
})

app.post("/login",(req,res)=>{
    const {username,password} = req.body
    console.log(req.body)
    User.findOne({username:username},(err,user)=>{
        if(user){
            if(password===user.password){
                console.log(user)
                res.render('user',{data:user})
            }
            else{
                res.send({message:"Password didn't match"})
            }
        }
        else{
            res.send({message:"User not registered"})
        }
    }) 
})


app.post("/register", (req, res)=> {
    const { name, username, password,email,gender} = req.body
    console.log(req.body)
    User.findOne({username: username}, (err, user) => {
        if(user){
            res.send({message: "User already registerd"})
        } else {
            const user1 = new User({
                name : name,
                username : username,
                password : password,
                email : email,
                gender:gender,
            })
            user1.save(err => {
                if(err) {
                    res.send(err)
                    console.log(err)
                } else {
                    res.render('gotologin',{data :{ message: "Successfully Registered, Go to login page now." }})
                }
            })
        }
    })
    
}) 

app.listen(5000,()=>{
    console.log("server is listening")
})