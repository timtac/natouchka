var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var SALT_FACTOR = 10;

var noop = function() {};

var userSchema = mongoose.Schema({
	title: {type: String, required: true},
	firstname: {type: String, required: true},
	lastname: {type: String, required: true},
	address1: {type: String},
	address2: {type: String},
	city: {type: String, required: true},
	post: {type: String, required: true},
	country: {type: String, required: true},
	state: {type: String, required: true},
	email: {type: String, required: true},
	mobile: {type: String, required: true},
	password: {type: String, required: true}
});

userSchema.pre('save', function(done) {
	var self = this;
	if(!self.isModified('password')){
		return done();
	}

	bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
		if(err){
			return done(err);
		}
		bcrypt.hash(self.password, salt, noop, function(err, hashedPassword) {
			if(err) {
				return done(err);
			}
			self.password = hashedPassword;
			done();
		});
	});
});

userSchema.methods.checkPassword = function(guess, done) {
	bcrypt.compare(guess, this.password, function(err, isMatch) {
		done(err, isMatch);
	});
};

userSchema.methods.saveUser = function(title, firstname, lastname, address1, address2, city, post, country, state, email, mobile, password) {
	User.find({ mail: mail }, function(err, user) {
		if (err) {return done(err);}
		else if (user) {
			return done(user);
		}
			var newuser = new User({
				title : title,
				firstname : firstname,
				lastname : lastname,
				address1 : address1,
				address2 : address2,
				city : city,
				post : post,
				country : country,
				state : state,
			});

			newuser.save();
		
	});
}

var User = mongoose.model("User",userSchema);
module.exports = User;

