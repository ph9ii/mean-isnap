const jwt = require("jsonwebtoken");

const config = require('../config');

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decodedToken = jwt
			.verify(token, config.secret);
		req.userData = { email: decodedToken.email, userId: decodedToken.userId };
		next();
	} catch(err) {
		return res.status(401).json({
			message: "You are not authenticated!"
		});
	}
	
}