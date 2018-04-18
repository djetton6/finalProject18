var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let Product = require('../models/product');

/* GET users listing. */
router.get('/', function(req, res, next) {
  Product.find(function (err, products) {
    if (err) return console.error(err);
    res.json(products);
  })
});
router.post('/', function(req, res, next) {
  let productToCreate = new Product(req.body);
  console.log(productToCreate)
  console.log(req.body)
  productToCreate.save(function(err, product){
    res.send(product);
  });
});
router.get('/:id', function(req, res, next) {
  Product.findOne({_id: req.params["id"]}, function(err, product) {
    if (err) return next(err);
    res.send(product);
  });
});
router.put('/:id', function(req, res, next) {
  Product.findOneAndUpdate({_id: req.params["id"]}, req.body, function(err, product) {
    if (err) return next(err);
    res.status(204).send();
  });
});
router.delete('/:id', function(req, res, next) {
  Product.deleteOne({_id: req.params["id"]}, function(err, product) {
    if (err) return next(err);
    res.status(204).send();
  });
});

module.exports = router;
