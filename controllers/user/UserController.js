const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const config = require('../../config');

const User = require('../../models/User');

const hdate = require('human-date');

exports.createUser = (req, res, next) => {
	const url = req.protocol + "://" + req.get("host");
	bcrypt.hash(req.body.password, 10)
		.then(hash => {
			const user = new User({
				fullName: req.body.fullName,
				screenName: req.body.screenName,
				email: req.body.email,
				password: hash,
				// avatar: url + "/avatars/" + req.file.filename,
				created: Date.now().toString()
			});
			user.save()
				.then(createdUser => {
					res.status('201').json({
						message: 'User added successfully',
						user: {
							...createdUser,
							id: createdUser._id
						}
					})
				})
				.catch(err => {
					console.log(err);
					return res.status(401).json({
						message: "Screen name or email already taken"
					});
				});
		})
		.catch(err => {
			res.status(500).json({
				message: "Screen name or email already taken"
			});
		});
}

exports.userLogin = (req, res, next) => {
	let fetchedUser;
	User.findOne({ email: req.body.email })
		.then(user => {
			if (!user) {
				return res.status(401).json({
					message: "Invalid username or password"
				});
			}
			fetchedUser = user;
			return bcrypt.compare(req.body.password, user.password);
		})
		.then(result => {
			if (!result) {
				return res.status(401).json({
					message: "Invalid username or password"
				});
			}
			const user = { email: fetchedUser.email, userId: fetchedUser._id };
			const token = jwt.sign(
				user,
				config.secret, { expiresIn: config.tokenLife}
			);
			const refreshToken = jwt.sign(
				user, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife}
			);

			res.status(200).json({
				token: token,
				refreshToken: refreshToken,
				expiresIn: config.tokenLife,
				userId: fetchedUser._id
			});
		})
		.catch(err => {
			console.log(err);
			return res.status(401).json({
				message: "Invalid username or password"
			});
		});
}
