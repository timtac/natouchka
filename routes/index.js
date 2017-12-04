var express = require("express");
var router = express.Router();
var Cart = require("../models/cart");
var Product = require('../models/products');

var routeConfig = [
	//{"page": "index", "path": "/", "method": "get", "title": "" },
	{"page": "login", "path": "/login", "method": "get", "title": "" },
	{"page": "signup", "path": "/signup", "method": "get", "title": "" },
	{"page": "contact", "path": "/contact", "method": "get", "title": "" },
	{"page": "cart", "path": "/cart", "method": "get", "title": "" },
	{"page": "checkout", "path": "/checkout", "method": "get", "title": "" }

];

/* GET home page. */
routeConfig.forEach(function(route) {
	if(route.method === "get") {
		router.get(route.path, function(req, res) {
			if(route.path === "/signup"){
				res.render(route.page, {csrfToken:req.csrfToken()});
			}
			else{
				res.render(route.page);
			}
		});
	}
});

router.get("/", function(req, res, next) {
	Product.find( function(err, prod) {
		if (err) { return next(err) }
		var productChunks = [];
		var chunkSize = 1;
		for (var i = 0; i < prod.length; i += chunkSize){
			productChunks.push(prod.slice(i, 2));
		}
		
		res.render("index", { products: prod });
	});
});

router.get("/category/:name", function(req, res, next) {
	var queryParam = req.param.name;
	Product.find({category: queryParam }, function(err, productsList) {
		if (err) {
			return next(null, false, { message: ' An error occur, Pls try again.!'});
			res.redirect("/");
		}
		res.render("category", {products: productsList});
	});
});

router.get("/add-to-cart/:id", function( req, res) {
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});

	Product.findById(productId, function(err, product) {
		if (err) {
			return done(err);
		}

		cart.add(product, product._id);
		req.session.cart = cart;
		console.log(req.session.cart);
		res.redirect("/");
	});
});

router.get("/remove/:id", function(req, res, next) {
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});

	cart.remove(productId);
	req.session.cart = cart;
	res.redirect("/shopping-cart");
});

router.get("/shopping-cart", function(req, res) {
	if(!req.session.cart) {
		 res.render("cart", { products: null });
	}
	var cart = new Cart(req.session.cart);
	res.render("cart", { products: cart.generateArray(), totalPrice: cart.totalPrice });
});

router.get("/checkout", ensureAuthenticated, function(req, res, next) {
	if(!req.session.cart) {
		res.redirect("/shopping-cart");
	}
	var cart = new Cart(req.session.cart);
	res.render("checkout", { total: cart.totalPrice});
});


module.exports = router;

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	}
	else {
		req.session.oldUrl = req.url;
		req.flash("info", "You must be logged in to see this page");
		res.redirect("/users/login");
	}
}
