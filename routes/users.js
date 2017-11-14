var express = require('express');
var router = express.Router();
var passport = require('passport');
var Order = require('../models/order');
var Cart = require('../models/cart');
/* GET users listing. */

router.get('/', function(req, res, next) {
  res.render("admin/login");
});

router.get("/logout", ensureAuthenticated, function(req, res) {
	req.logout();
	res.redirect("/");
});

router.get('/profile', ensureAuthenticated, function(req, res, next) {
	Order.find({user : req.user}, function(err, orders) {
		if(err) {
			return done();
		}
		var cart;
		orders.forEach(function(order) {
			cart = new Cart(order.cart);
			order.items = cart.generateArray();
		});
		res.render('profile', { orders : orders});
	})
});

router.post("/login", passport.authenticate("login", {
	failureRedirect: "/user/login",
	failureFlash: true
}), function( req, res, next) {
	if(req.session.oldUrl) {
		var oldUrl = req.session.oldUrl;
		req.session.oldUrl = null;
		res.redirect(oldUrl);
	} else {
		res.redirect('/user/profile');
	}
});

router.post("/signup", passport.authenticate("signup", {
	failureRedirect: "/user/signup",
	failureFlash: true
}), function (req, res, next) {
	if(req.session.oldUrl) {
		var oldUrl = req.session.oldUrl;
		req.session.oldUrl = null; 
		res.redirect(oldUrl);
	} else {
		res.redirect('/user/profile');
	}
});


module.exports = router;

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	}
	else {
		req.flash("info", "You must be logged in to see this page");
		res.redirect("/users/login");
	}
}