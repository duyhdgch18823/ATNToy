const express = require('express');
const engines = require('consolidate');
const app = express();

// dung de lay du lieu tu phan 'search'
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));


// chi duong den folder public
var publicDir = require('path').join(__dirname, '/public');
app.use(express.static(publicDir));


//npm i handlebars consolidate --save
app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');


var indexController = require('./index.js');
var productController = require('./product.js');
var employeeController = require('./employee.js');


// Neu muon tao them controller, lap lai dong 11 va 13 cho controller moi
app.use('/', indexController);
// khi nhap vao url la 'localhost.../sanpham' van cho ra ket qua binh thuong
app.use('/product', productController);
app.use('/employee', employeeController);

// cai dat port de upload len server
var port = process.env.PORT || 3000;
var server = app.listen(port, function () { });

// nếu chỉ dùng để thử trên localhost thì có thể thay 2 dòng trên bằng dòng dưới đây
// var server=app.listen(process.env.PORT || 3000,function() {});