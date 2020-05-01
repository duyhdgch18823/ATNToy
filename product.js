const express = require('express');
var router = express.Router();


const app = express();
const multer = require('multer');
fs = require('fs-extra');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


var MongoClient = require('mongodb').MongoClient;
ObjectId = require('mongodb').ObjectId;

// var url = 'mongodb://localhost:27017';
var url = 'mongodb+srv://DuyHD:duy106hn@cluster0-knunn.azure.mongodb.net/test?retryWrites=true&w=majority';


// có 'async' thì phải có 'await' 
router.get('/', async (req, res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNToy");

    let results = await dbo.collection("Product").find({}).toArray();
    res.render('allProduct', { product: results });
});



// product/insert->browser
router.get('/insert', (req, res) => {
    res.render('insertProduct');
});


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/products')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });

MongoClient.connect(url, (err, client) => {
    if (err) return console.log(err);
    db = client.db("ATNToy");
});



// router.post('/insert', async (req, res) => {
//     let client = await MongoClient.connect(url);
//     let dbo = client.db("ATNToy");

//     let name = req.body.productName;
//     let cate = req.body.cate;
//     let color = req.body.color;
//     let price = req.body.price;

//     var finalImg = {
//         contentType: req.file.mimetype,
//         image: new Buffer(encode_image, 'base64')
//     };

//     let newSP = { Name: name, Category: cate, Color: color, Price: price, Image: finalImg };
//     await dbo.collection("Product").insertOne(newSP);

//     let results = await dbo.collection("Product").find({}).toArray();
//     res.render('allProduct', { product: results });
// })


router.post('/insert', upload.single('picture'), async (req, res) => {
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');

    var newSP = {
        // _id: req.body._id,
        Name: req.body.productName,
        Category: req.body.cate,
        Color: req.body.color,
        Price: req.body.price,
        // contentType: req.file.mimetype,
        Image: new Buffer(encode_image, 'base64')
    };

    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNToy");
    await dbo.collection("Product").insertOne(newSP);
    // await dbo.collection("Product").insertOne(insertProduct, (err, result) => {
    //     console.log(result)
    //     if (err) return console.log(err)
    //     console.log('saved to database')
    // });
    let result = await dbo.collection("Product").find({}).toArray();
    res.render('allProduct', { product: result });
});


router.get('/photos', async (req, res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNToy");
    dbo.collection('Product').find().toArray((err, result) => {
        const imgArray = result.map(element => element._id);
        console.log(imgArray);
        if (err) return console.log(err)
        res.send(imgArray)
    })
});

router.get('/photo/:id', async (req, res) => {
    var filename = req.params.id;

    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNToy");

    dbo.collection('Product').findOne({ '_id': ObjectId(filename) }, (err, result) => {
        if (err) return console.log(err)
        res.contentType('image/jpeg');
        // res.send(result.Image.image.buffer);
        res.send(result.Image.buffer);
    })
});

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