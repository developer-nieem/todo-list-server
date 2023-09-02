const express = require('express')
const app = express()
const cors = require('cors');
require("dotenv").config();
const port =  process.env.PORT || 3000

app.use(cors());
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xifd9dy.mongodb.net/?retryWrites=true&w=majority`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
     client.connect();

const todoListCollectionDB = client.db('todoDB').collection("todoList");

app.get("/todo-list" , async(req, res) =>{
    const result = await todoListCollectionDB.find().toArray();
    res.send(result);
})

app.post("/todo-list", async(req, res) =>{
    const body =  req.body;
    const result =  await todoListCollectionDB.insertOne(body);
    res.send(result)
})

app.put("/todo-list/:id" , async(req, res) => {
    const id =  req.params.id;
    const body = req.body
    const filter = {_id: new ObjectId(id)};
    const updateDoc = {
        $set: {
            title: body.title,
            details: body.details,
            status: body.status
        }
    }
    const result =  await todoListCollectionDB.updateOne(filter, updateDoc);
    res.send(result)
})

app.delete('/todo-list/:id' , async(req , res) =>{
    const id =  req.params.id;
    const filter =  {_id: new ObjectId(id)}
    const result =  await todoListCollectionDB.deleteOne(filter);
    res.send(result)
})

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello todo')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})