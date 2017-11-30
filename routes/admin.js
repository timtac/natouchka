var router = require("express").Router();
var passport = require("passport");
var Admin = require("../models/admin");
var Order = require("../models/order");
var Product = require("../models/products");

router.use( function(req, res, next) {
	res.locals.currentAdmin = req.admin;
	res.locals.errors = req.flash("error");
	res.locals.infos = req.flash("info");
	next();
});

router.get("/home", ensureAuthenticated, function(req, res, next) {
	Product.find(function(err, products) {
		if (err) { next(err);}
		res.render("admin/home", { products : products });
	});
});

router.get("/register", function(req, res, next) {
	res.render('admin/register');
});

router.get("/addproduct",ensureAuthenticated, function(req, res) {
	res.render("admin/addProduct");
});

router.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/admin/login");
});

router.post("/addproduct", function(req, res, next) {
	var imagePath = req.body.imagePath;
	var title = req.body.title;
	var category =req.body.category;
	var description = req.body.description;
	var price = req.body.price;

	console.log(price);

	var product = new Product({
		imagePath:imagePath,
		title: title,
		category: category,
		description: description,
		price: price
		});
	product.save(function(err, products) {
		if (err) {return next(err)}
			res.redirect("/admin/home");
	});
});

router.post("/register", function(req, res, next) {
	
	console.log(req.body.firstname);
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var username = req.body.email;
	var password = req.body.password;

	var admin = new Admin({
		firstname: firstname,
		lastname: lastname,
		username : username,
		password: password
	});
	admin.save( function(err, admin) {
		if (err){
			return next(err);
		}
		res.redirect("/admin/home");
	});
}, passport.authenticate("login", {
	successRedirect: "/admin/home",
	failureRedirect: "/admin/login",
	failureFlash: true
}));

router.get("/delete/:id", function(req, res, next) {
	var productId = req.params.id;

	Product.remove({_id : productId}, function(err, doc){
		if (err) { 
			console.log(error);
			return next(err)};

		res.redirect("/admin/home");
	});
});

router.post("/edit/:id", function(req, res, next) {
	var id = req.params.id;
	Product.findById({ _id:id }, function(err, product) {

	});
});

router.get("/login", function(req, res, next) {
	res.render("admin/login");
});

router.post("/login", passport.authenticate("login", { 
	failureRedirect: "/admin/login",
	failureFlash: true
}), function(req, res, next){
	if (req.session.oldUrl) {
		var url = "/admin" + req.session.oldUrl;
		req.session.oldUrl = null;
		console.log(req.isAuthenticated());
		console.log(url);
		res.redirect(url);
	} else{
		res.redirect("/admin/home");
	}
});

module.exports = router;

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	else {
		req.session.oldUrl = req.url;
		console.log(req.session.oldUrl);
		req.flash("info", "You must be logged in to see this page");
		res.redirect("/admin/login");
	}
}