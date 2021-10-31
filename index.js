const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sjr78.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('birdsEyeTour');
        const planCollection = database.collection('tourPlans');
        const purchaseCollection = database.collection('purchasePlan');

        // POST API to add Plans
        app.post('/tourPlans', async (req, res) => {
            const plan = req.body;
            const result = await planCollection.insertOne(plan);
            res.json(result);
        });

        // GET API (Get all Plans)
        app.get('/tourPlans', async (req, res) => {
            const cursor = planCollection.find({});
            const plans = await cursor.toArray();
            res.send(plans);
        })

        // GET API (Get single Plan)
        app.get('/tourPlans/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const plan = await planCollection.findOne(query);
            res.json(plan);
        })

        // POST API to add Purchase Plans
        app.post('/purchasePlan', async (req, res) => {
            const order = req.body;
            const result = await purchaseCollection.insertOne(order);
            res.json(result);
        });

        // GET API (Get all Purchase Plans)
        app.get('/purchasePlan', async (req, res) => {
            const cursor = purchaseCollection.find({});
            const plans = await cursor.toArray();
            res.send(plans);
        })

        // GET API (Get single Purchase Plan)
        app.get('/purchasePlan/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await purchaseCollection.findOne(query);
            res.json(result);
        })

        // UPDATE API
        app.put('/purchasePlan/:id', async (req, res) => {
            const id = req.params.id;
            const updatedStatus = req.body;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updateDoc ={
                $set:{
                    confirmed: updatedStatus
                },
            };
            const result = await purchaseCollection.updateOne(filter,updateDoc, options)
            res.json(result);
        })

        // DELETE API
        app.delete('/purchasePlan/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await purchaseCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})