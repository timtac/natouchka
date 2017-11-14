var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var SALT_FACTOR = 10;

var noop = function() {}

var adminSchema = mongoose.Schema({
	firstname: {type: String, required: true},
	lastname: {type: String, required: true},
	username: {type: String, required: true},
	password: {type: String, required: true}
});

adminSchema.pre('save', function(done) {
	var self = this;
	if(!self.isModified('password')) {
		return done();
	}

	bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
		if (err) {
			return done(err);
		}
		bcrypt.hash(self.password, salt, noop, function(err, hashPassword) {
			if (err) {
				return done(err);
			}
			self.password = hashPassword;
			done();
		});
	});
});

adminSchema.methods.checkPassword = function(guess, done) {
	bcrypt.compare(guess, this.password, function(err, isMatch) {
		done(err, isMatch);
	});
};

adminSchema.methods.saveAdmin = function(firstname, lastname, email, password, next) {
	Admin.findOne({ email : email}, function(err, admin) {
		if (err) {
			return next(err);
		}
		else if (admin) {
			return next(admin);
		}

		var newadmin = new Admin({
			firstname : firstname,
			lastname : lastname,
			email : email,
			password : password
		});

		newadmin.save();
		
	});
}

var Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;