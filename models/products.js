var mongoose = require('mongoose');

var productSchema = mongoose.Schema({
	imagePath: {type: String},
	title: {type: String, required: true},
	category: { type:String, required: true},
	description: {type: String, required: true},
	price: {type: String, required: true}
});

productSchema.methods.addProduct = function(imagePath, title, category, description, price) {
	var product = new Product({
		imagePath: imagePath,
		title: title,
		category: category,
		description: description,
		price: price
	});
	product.save(function(err, product){
		if (err) {return err}
		else{
			next();
		}
	});
}

productSchema.methods.allProducts = function() {
	Product.find( function(err, products) {
		
	});
}

productSchema.methods.OneProduct = function(productName) {

}

var Product = mongoose.model('Product', productSchema);
module.exports = Product;