// https://github.com/tutsplus/file-upload-with-multer-in-node

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const multer = require('multer');
fs = require('fs-extra');
app.use(bodyParser.urlencoded({ extended: true }));
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
ObjectId = require('mongodb').ObjectId;

const myurl = 'mongodb+srv://DuyHD:duy106hn@cluster0-knunn.azure.mongodb.net/test?retryWrites=true&w=majority';
// Muon upload len atlas thi thay doi url


var storage = multer.diskStorage({
    // Upload file vao thu muc 'upload'
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    // Dat ten file
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });


// Di den database test
MongoClient.connect(myurl, (err, client) => {
    if (err) return console.log(err)
    db = client.db('Test')
})

// Khi nguoi dung go den '/upload', no se chuyen den file upload.html
router.get('/', function (req, res) {
    res.sendFile(__dirname + '/upload.html');

});

// upload single file
router.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(file)
})
//Uploading multiple files
router.post('/uploadmultiple', upload.array('myFiles', 12), (req, res, next) => {
    const files = req.files
    if (!files) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(files)
})

router.post('/uploadphoto', upload.single('picture'), (req, res) => {
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    // Define a JSONobject for the image attributes for saving to database
    var finalImg = {
        contentType: req.file.mimetype,
        image: new Buffer(encode_image, 'base64')
    };
    db.collection('Image').insertOne(finalImg, (err, result) => {
        console.log(result)
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/upload')
    })
})


// Hien thi toan bo anh duoi dang id
router.get('/photos', (req, res) => {
    db.collection('Image').find().toArray((err, result) => {

        const imgArray = result.map(element => element._id);
        console.log(imgArray);
        if (err) return console.log(err)
        res.send(imgArray)

    })
});


// Ham hien thi anh dua tren id cua chung
router.get('/photo/:id', (req, res) => {
    var filename = req.params.id;

    db.collection('Image').findOne({ '_id': ObjectId(filename) }, (err, result) => {
        if (err) return console.log(err)
        res.contentType('image/jpeg');
        res.send(result.image.buffer)

    })
})

router.get('/viewAllPhotos',async (req,res)=>{
    let client= await MongoClient.connect(myurl);
    let dbo = client.db("ATNToy");
    let results = await dbo.collection("Image").find({}).toArray();
    res.render('allPhoto',{photo:results});
});



router.get('/viewPhoto/:id', (req, res) => {
    var filename = req.params.id;
    res.render('viewImg',{img:filename}); 
  })

module.exports = router;