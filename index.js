const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()

app.use(cors())
app.use(express.json())

const port = process.env.PORT || 3000;

const uri = "mongodb+srv://smartDBUser:rfGEkZTQkpDkmuRy@maincluster0.m4dyknx.mongodb.net/?appName=MainCluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', (req, res)=>{
    res.send('hello icy')
})



// to connect server to database
async function run() {
    try{
        await client.connect();

        // users collection
        const db = client.db('smart_db')
        const productsCollection = db.collection('products')

        app.get('/products', async(req, res)=>{
            const cursor = productsCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        

        app.post('/products', async(req, res)=>{
            const newProduct = req.body
            const result = await productsCollection.insertOne(newProduct)
            res.send(result)
        })

        app.patch('/products/:id', async(req, res)=>{
            const id = req.params.id
            const filter = {_id : new ObjectId(id)}
            const updatedProducts = req.body;
            const update = {
                $set: updatedProducts
            }
            const result = await productsCollection.updateOne(filter, update)
            res.send(result)

        })

        app.delete('/products/:id', async(req, res)=>{
            const id = req.params.id
            const query = {_id : new ObjectId(id)}
            const result = await productsCollection.deleteOne(query)
            res.send(result)
        })



        await client.db('admin').command({ping : 1});
        console.log('ping you deployment');
    }finally{

    }
}
run().catch(console.dir)

app.listen(port, ()=>{
    console.log(`the server is running from port ${port}`);
})