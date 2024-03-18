import express, { response } from "express";
import { MongoClient } from 'mongodb'
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import cors from 'cors';

const app=express();
const url="mongodb+srv://arunkumarabde17:oiM1ZINmDcMzIigj@arunkumar.iz0dkdg.mongodb.net/?retryWrites=true&w=majority&appName=Arunkumar";
const client=new MongoClient(url);
await client.connect();
console.log("mongoDB connected Successsfully");
app.use(express.json());
app.use(cors());

const auth=(req,res,next)=>{
    try {
        const token=req.header("backend-token"); //keyname:backend-token
        jwt.verify(token,"college");
        next();
    } catch (error) {
        res.status(401).send({message:error.message});
    }
};


app.get("/",function(req,res){
    res.status(200).send("Hello World!");
});

app.post("/post",async function(req,res){
    const getPostman=req.body;
    const sendMethod=await client.db("CRUD").collection("data").insertOne(getPostman);
    res.status(201).send(sendMethod);
});
app.post("/postmany",async function(req,res){
    const getMany=req.body;
    const sendMethod=await client.db("CRUD").collection("data").insertMany(getMany);
    res.status(201).send(sendMethod);
});

app.get("/get",auth,async function(req,res){
    const getMethod=await client.db("CRUD").collection("data").find({}).toArray();
    res.status(200).send(getMethod);
});

app.get("/getOne/:id",async function(req,res){
    const {id}=req.params;
    const getMethod=await client.db("CRUD").collection("data").findOne({_id:new ObjectId(id)});
    res.status(200).send(getMethod)
    console.log(getMethod);
});

app.put("/update/:id",async function(req,res){
    const {id}=req.params;
    const getPostman=req.body;
    const updateMethod=await client.db("CRUD").collection("data").updateOne({_id:new ObjectId(id)},{$set:getPostman});
    res.status(201).send(updateMethod);
});

app.delete("/delete/:id",async function(req,res){
    const {id}=req.params;
    const deleteMethod=await client.db("CRUD").collection("data").deleteOne({_id:new ObjectId(id)});
    res.status(200).send(deleteMethod);
});

app.post("/register",async function(req,res){
    const {username,email,password}=req.body;
    const userFind=await client.db("CRUD").collection("private").findOne({email:email});
    if(userFind){
        res.status(400).send("This user already exists")
    }
    else{
        const salt = await bcrypt.genSalt(10);
        const hashPassword=await bcrypt.hash(password,salt);
        const registerMethod=await client.db("CRUD").collection("private").insertOne({username:username,email:email,password:hashPassword});
        res.status(201).send(registerMethod);
    }

});

app.post("/login",async function(req,res){
    const {email,password}=req.body;
    //console.log(email,password);
    const userFind=await client.db("CRUD").collection("private").findOne({email:email});
    if(userFind){
        const mongodbpaassword=userFind.password;
        const passwordCheck=await bcrypt.compare(password,mongodbpaassword);
        //console.log(passwordCheck);
        if(passwordCheck){
            const token=jwt.sign({id:userFind._id},"college"); //jwt token:college
            res.status(200).send({token:token});
        }
        else{
            res.status(400).send("Invalid Password");
        }
    }
    else{
        response.status(400).send("Invalid email-id");
    }
});

app.listen(4000,()=>{
  console.log("Server connected Successfully");
});