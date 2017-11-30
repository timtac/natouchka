var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var Admin = require('../models/admin');

module.exports = function(){
	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		Admin.findById(id, function(err, user) {
			done(err, user);
		});
	});
};

// passport.use('login', new LocalStrategy( function(email, password, done) {
// 	User.find( { email: email }, function(err, user) {
// 		if(err) {
// 			return done(err);
// 		}
// 		if(!user) {
// 			return done(null, false, { message:'No account with this email' });
// 		}
// 		user.checkPassword(passport, function(err, isMatch) {
// 			if(err) {
// 				return done(err);
// 			}
// 			if(isMatch) {
// 				return done(null, user);
// 			}
// 			else {
// 				return done(null, false, { message: ' Incorrect Password'})
// 			}
// 		});
// 	});
// }));

passport.use("login", new LocalStrategy( function(username, password, done) {
	Admin.findOne( { username: username }, function(err, admin) {
		if(err) {
			console.log(err);
			return done(err);
		}
		if(!admin) {
			return done(null, false, { message:'No account with this username' });
		}
		admin.checkPassword( password, function(err, isMatch) {
			if(err) {
				console.log(err);
				return done(err);
			}
			if(isMatch) {
				return done(null, admin);
			}
			else {
				return done(null, false, { message: ' Incorrect Password'});
			}
		});
	});
}));