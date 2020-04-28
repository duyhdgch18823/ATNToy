const express = require('express');
var router = express.Router();


var MongoClient = require('mongodb').MongoClient;


// var url = 'mongodb://localhost:27017';
var url = 'mongodb+srv://DuyHD:duy106hn@cluster0-knunn.azure.mongodb.net/test?retryWrites=true&w=majority';



router.get('/', async (req, res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNToy");

    let results = await dbo.collection("Product").find({}).toArray();
    res.render('allProduct', { product: results });
})



// product/insert->browser
router.get('/insert', (req, res) => {
    res.render('insertProduct');
})


router.post('/insert', async (req, res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNToy");

    let name = req.body.productName;
    let cate = req.body.cate;
    let color = req.body.color;
    let price = req.body.price;


    let newSP = { Name: name, Category: cate, Color: color, Price: price };
    await dbo.collection("Product").insertOne(newSP);

    let results = await dbo.collection("Product").find({}).toArray();
    res.render('allProduct', { product: results });
})



// product/edit
router.get('/edit', async (req, res) => {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;

    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNToy");
    let result = await dbo.collection("Product").findOne({ "_id": ObjectID(id) });
    res.render('editProduct', { product: result });
})



// update product's info
// router.get('/edit', async (req, res) => {
//     let id = req.query.id;
//     var ObjectID = require('mongodb').ObjectID;

//     let client = await MongoClient.connect(url);
//     let dbo = client.db("ATNToy");
//     let result = await dbo.collection("Product").findOne({ "_id": ObjectID(id) });
//     res.render('editProduct', { product: result });
// })

router.post('/edit', async (req, res) => {
    let id = req.body.id;

    let name = req.body.name;
    let cate = req.body.cate;
    let color = req.body.color;
    let price = req.body.price;

    let newValues = { $set: { Name: name, Category: cate, Color: color, Price: price } };
    var ObjectID = require('mongodb').ObjectID;
    let condition = { "_id": ObjectID(id) };

    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNToy");
    await dbo.collection("Product").updateOne(condition, newValues);

    let results = await dbo.collection("Product").find({}).toArray();
    res.render('allProduct', { product: results });
})


// delete a product
router.get('/delete', async (req, res) => {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let condition = { _id: ObjectID(id) };

    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNToy");
    dbo.collection("Product").deleteOne(condition);

    let results = await dbo.collection("Product").find({}).toArray();
    res.redirect('/product');

})


//sanpham/search ->post
router.post('/search', async (req, res) => {
    let searchPrd = req.body.prdName;
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNToy");
    let results = await dbo.collection("Product").find({ "Name": searchPrd }).toArray();
    res.render('allProduct', { product: results });
})

module.exports = router;