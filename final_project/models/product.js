var mongoose = require('mongoose');

var ProductSchema = mongoose.Schema({
  name: String,
  quantity: Number,
  type: String,
  price: Number
});

// Add virtual field 'id' which equals '_id'.
ProductSchema.virtual('id').get(function(){
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
ProductSchema.set('toObject', {
  virtuals: true
});

// Remove underscore prefix fields from output
ProductSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj._id;
  delete obj.__v;
  return obj;
}

module.exports = mongoose.model('product', ProductSchema);