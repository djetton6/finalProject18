let mongoose = require("mongoose");
let Product = require('../models/product');
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let http = require('http');

let server = http.createServer(app);
let should = chai.should();

chai.use(chaiHttp);

describe('Products', () => {
  before(done => {
    // Start the server
    server.listen(0);
    done();
  });

  beforeEach(done => { 
    // Before each test we empty the database
    Product.remove({}, (err) => { 
      done();         
    });     
  });

  after(done => {
  // After all tests we close the server and disconnect from the database
  server.close();
  mongoose.disconnect();
  done();
  });

  describe('GET /api/products', () => {
    it('it should GET all the products', (done) => {
    	let expectedProduct = new Product({
    		name: "MyProduct",
    		quantity: 2,
    		type: "general",
    		price: 2
    	})

    	expectedProduct.save(function (err, product) {
  	      if (err) return console.error(err);
          chai.request(server)
              .get('/api/products')
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(1);
                done();
              });
  	  });
    });
  });

  describe('POST /api/products', () => {
    it('it should add a new producs', (done) => {
    	let expectedProduct = new Product({
    		name: "MyProduct",
    		quantity: 2,
    		type: "general",
    		price: 2
    	});

      chai.request(server)
          .post('/api/products')
          .send(expectedProduct)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property("id");
            res.body.should.have.property("name").eql(expectedProduct.name);
            res.body.should.have.property("quantity").eql(expectedProduct.quantity);
            res.body.should.have.property("type").eql(expectedProduct.type);
            res.body.should.have.property("price").eql(expectedProduct.price);
            done();
          });
    });
  }); 


  describe('GET /api/products/:id', () => {
    it('it should get an existing product', (done) => {
      let existingProduct = new Product({
        name: "MyProduct",
        quantity: 2,
        type: "general",
        price: 2
      });

      existingProduct.save(function (err, product) {
        if (err) return console.error(err);
        chai.request(server)
          .get('/api/products/' + product.id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property("id");
            res.body.should.have.property("name").eql(existingProduct.name);
            res.body.should.have.property("quantity").eql(existingProduct.quantity);
            res.body.should.have.property("type").eql(existingProduct.type);
            res.body.should.have.property("price").eql(existingProduct.price);
            done();
          });
      });
    });
  });

  describe('PUT /api/products/:id', () => {
    it('it should update an existing product', (done) => {
      let existingProduct = new Product({
        name: "MyProduct",
        quantity: 2,
        type: "general",
        price: 2
      });
      let expectedProduct = new Product({
        name: existingProduct.name,
        quantity: existingProduct.quantity - 1,
        type: existingProduct.type,
        price: existingProduct.price
      });

      existingProduct.save(function (err, product) {
        if (err) return console.error(err);
        chai.request(server)
          .put('/api/products/' + product.id)
          .send(expectedProduct)
          .end((err, res) => {
            res.should.have.status(204);
            res.body.should.be.empty;

            Product.findOne({_id: existingProduct.id}, function(err, foundProduct) {
              if (err) return console.error(err);
              foundProduct.should.have.property("name").eql(expectedProduct.name);
              foundProduct.should.have.property("quantity").eql(expectedProduct.quantity);
              foundProduct.should.have.property("type").eql(expectedProduct.type);
              foundProduct.should.have.property("price").eql(expectedProduct.price);
              done();
            })
          });
      });
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('it should delete an existing product', (done) => {
      let existingProduct = new Product({
        name: "MyProduct",
        quantity: 2,
        type: "general",
        price: 2
      });

      existingProduct.save(function (err, product) {
        if (err) return console.error(err);
        chai.request(server)
          .delete('/api/products/' + product.id)
          .end((err, res) => {
            res.should.have.status(204);
            res.body.should.be.empty;

            Product.findOne({_id: existingProduct.id}, function(err, product) {
              if (err) return console.error(err);
              should.not.exist(product);
              done();
            })
          });
      });
    });
  });

});