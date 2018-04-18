var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var mustacheExpress = require('mustache-express');
let Product = require('./models/product');
mongoose.connect('mongodb://localhost/test');

var products = require('./routes/products');

var app = express();
app.disable('etag');

app.engine('mustache', mustacheExpress());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug')
app.set('views', __dirname + '/views');

app.use('/api/products', products);

app.get('/', function (req, res) {
  Product.find(function (err, products) {
    if (err) return console.error(err);
    console.log(products);
    res.render('index', { products: products });
  })
});

app.get('/products/new', function (req, res) {
  res.render('productForm', { title: "New Product",product: {} });
});

app.post('/products/new', function(req, res, next) {
  let productToCreate = new Product(req.body);
  productToCreate.save(function(err, product){
    res.redirect('/products/' + product.id);
  });
});

app.get('/products/:id/update', function (req, res) {
  let id = req.params["id"]
  Product.findOne({_id: id}, function(err, product) {
    res.render('productForm', { title: product.name, product: product });
  });
});

app.post('/products/:id/update', function (req, res) {
  let id = req.params["id"]
  Product.findOneAndUpdate({_id: id}, req.body, function(err, product) {
    if (err) return next(err);
    res.redirect('/products/' + id);
  });
});

app.post('/products/:id/delete', function (req, res) {
  let id = req.params["id"]
  Product.deleteOne({_id: id}, function(err, product) {
    res.redirect("/");
  });
});

app.get('/products/:id', function (req, res) {
  Product.findOne({_id: req.params["id"]}, function(err, product) {
    if (err) return next(err);
    res.render('product', { product: product });
  });
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
