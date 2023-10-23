
const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5001

// midleware
app.use(cors())
app.use(express.json())
// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASS)


app.get('/', (req, res) => {
    res.send('server is ready to go ')
})



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb://brandshop:fCjzIXrOiuDtlgqV@ac-ckje656-shard-00-00.ci1qlvi.mongodb.net:27017,ac-ckje656-shard-00-01.ci1qlvi.mongodb.net:27017,ac-ckje656-shard-00-02.ci1qlvi.mongodb.net:27017/?ssl=true&replicaSet=atlas-d5w1tu-shard-0&authSource=admin&retryWrites=true&w=majority`;
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ci1qlvi.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
        useNewUrlParser:true,useUnifiedTopology: true
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const CartData = client.db('cartDB').collection('cart')

        app.post('/carts', async (req, res) => {
            const newAddCart = req.body
            const result = await CartData.insertOne(newAddCart)
            res.send(result)

        })
        // 
        app.get('/carts', async (req, res) => {
            const cursor = CartData.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        //  cart data delete that i add to My cart 
        app.delete('/delete/:_id', async (req, res) => {
            const _id = req.params.id
            const filter = { id: _id }
            const result = await CartData.deleteOne(filter)
            res.send(result)
        })


        //   from data server 
        const addedProductCollection = client.db('productDB').collection('product');
        app.post('/product', async (req, res) => {
            const newProducet = req.body
            const result = await addedProductCollection.insertOne(newProducet)
            res.send(result)

        })
        app.get('/product', async (req, res) => {
            const cursor = addedProductCollection.find();
            const result = await cursor.toArray()
            res.send(result)


        })
        app.get('/update/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await addedProductCollection.findOne(query);
            res.send(result);
        });


        // update product 
        app.put('/update/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedProduct = req.body;
            const product = {
                $set: {
                    name: updatedProduct.name,
                    image: updatedProduct.image,
                    type: updatedProduct.type,
                    brand: updatedProduct.brand,
                    price: updatedProduct.price,
                    rating: updatedProduct.rating,
                    description: updatedProduct.description
                }
            }
            const result = await addedProductCollection.updateOne(filter, product, options)
            res.send(result)

        })

        // show deatils 
        app.get('/deatils/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await addedProductCollection.findOne(query)
            res.send(result)
        })


        app.get('/product/:id', async (req, res) => {
            const id = req.params.id
            const result = await addedProductCollection.find({ brandName: id }).toArray()
            res.send(result)
        })





        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        
    } catch(err) {
        console.log(err)
      }
     finally {
        
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);







app.listen(port, () => {
    console.log(`server is runnig port:${port}`)
})
