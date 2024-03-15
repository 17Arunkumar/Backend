import express from "express";
import { MongoClient } from 'mongodb'
import { ObjectId } from "mongodb";

const app=express();
const url="mongodb+srv://arunkumarabde17:oiM1ZINmDcMzIigj@arunkumar.iz0dkdg.mongodb.net/?retryWrites=true&w=majority&appName=Arunkumar";
const client=new MongoClient(url);
await client.connect();
console.log("mongoDB connected Successsfully");
app.use(express.json());


app.get("/",function(req,res){
    res.send("Hello World!");
})

app.post("/post",async function(req,res){
    const getPostman=req.body;
    const sendMethod=await client.db("CRUD").collection("data").insertOne(getPostman);
    res.send(sendMethod);
});
app.post("/postmany",async function(req,res){
    const getMany=req.body;
    const sendMethod=await client.db("CRUD").collection("data").insertMany(getMany);
    res.send(sendMethod);
});

app.get("/get",async function(req,res){
    const getMethod=await client.db("CRUD").collection("data").find({}).toArray();
    res.send(getMethod);
});

app.get("/getOne/:id",async function(req,res){
    const {id}=req.params;
    const getMethod=await client.db("CRUD").collection("data").findOne({_id:new ObjectId(id)});
    res.send(getMethod)
    console.log(getMethod);
});

app.put("/update/:id",async function(req,res){
    const {id}=req.params;
    const getPostman=req.body;
    const updateMethod=await client.db("CRUD").collection("data").updateOne({_id:new ObjectId(id)},{$set:getPostman});
    res.send(updateMethod);
});

app.delete("/delete/:id",async function(req,res){
    const {id}=req.params;
    const deleteMethod=await client.db("CRUD").collection("data").deleteOne({_id:new ObjectId(id)});
    res.send(deleteMethod);
})

app.listen(4000,()=>{
  console.log("Server connected Successfully");
})