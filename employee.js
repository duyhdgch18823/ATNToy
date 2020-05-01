const express = require('express');
var router = express.Router();


var MongoClient = require('mongodb').MongoClient;


// var url = 'mongodb://localhost:27017';
var url = 'mongodb+srv://DuyHD:duy106hn@cluster0-knunn.azure.mongodb.net/test?retryWrites=true&w=majority';

router.get('/', async (req, res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNToy");

    let results = await dbo.collection("Employee").find({}).toArray();
    res.render('allEmployee', { employee: results });
})



// employee/insert->browser
router.get('/insert', (req, res) => {
    res.render('insertEmployee');
})


router.post('/insert', async (req, res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNToy");

    let name = req.body.employeeName;
    let phone = req.body.phone;
    let mail = req.body.mail;

    let newNV = { Name: name, Phone: phone, Email: mail };
    await dbo.collection("Employee").insertOne(newNV);

    let results = await dbo.collection("Employee").find({}).toArray();
    res.render('allEmployee', { employee: results });
})



// employee/edit
router.get('/edit', async (req, res) => {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;

    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNToy");
    let result = await dbo.collection("Employee").findOne({ "_id": ObjectID(id) });
    res.render('editEmployee', { employee: result });
})


// update employee's info
router.post('/edit', async (req, res) => {
    let id = req.body.id;

    let name = req.body.name;
    let phone = req.body.phone;
    let mail = req.body.email;

    let newValues = { $set: { Name: name, Phone: phone, Email: mail } };
    var ObjectID = require('mongodb').ObjectID;
    let condition = { "_id": ObjectID(id) };

    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNToy");
    await dbo.collection("Employee").updateOne(condition, newValues);

    let results = await dbo.collection("Employee").find({}).toArray();
    res.render('allEmployee', { employee: results });
})


// delete an employee
router.get('/delete', async (req, res) => {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let condition = { _id: ObjectID(id) };

    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNToy");
    dbo.collection("Employee").deleteOne(condition);

    let results = await dbo.collection("Employee").find({}).toArray();
    res.redirect('/employee');

})


//sanpham/search ->post
router.post('/search', async (req, res) => {
    let searchEmp = req.body.empName;
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATNToy");
    let results = await dbo.collection("Employee").find({ "Name": searchEmp }).toArray();
    res.render('allEmployee', { employee: results });
})

module.exports = router;