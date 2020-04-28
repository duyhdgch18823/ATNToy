const express = require('express');
var router = express.Router();

router.get('/',(req,res)=>{
    res.render('index');
})

//=>index/about
router.get('/about',(req,res)=>{
    //passing model to view
    res.render('about', {
        instructor: "Do Quoc Binh",
        name: "Hoang Duc Duy",
        id: "GCH18823",
        right: "FPT Greenwich 2020!"
    })
})

module.exports = router;