const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const objectId = require('mongodb').ObjectId;
require('dotenv').config();


const app = express();
//middleware
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_MECHANIC}:${process.env.DB_PASSWORD}@cluster0.lt029.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('carMechanic');
        const servicesCollection = database.collection('services ');

        //get all services from api 
        app.get('/services', async (req, res) => {
            const services = await servicesCollection.find({}).toArray();
            res.json(services);
        })
        //GET Single service 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: objectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        });
        //POST API
        app.post('/services', async (req, res) => {
            const service = req.body;

            const result = await servicesCollection.insertOne(service);
            console.log('your inserseted id is ', result.insertedId);
            res.json(result)
        });

        //Delete api
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const service = { _id: objectId(id) };

            const result = await servicesCollection.deleteOne(service);
            res.send(result);
        })

    } finally {
        //await client.close();
    }
}
run().catch(console.dir)
const port = 5000;
app.get('/', (req, res) => {
    res.send('site is deploying ');
});

app.listen(port, () => {
    console.log('listening to the port ', port)
})