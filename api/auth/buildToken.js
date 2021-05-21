const jwt = require("jsonwebtoken");

module.exports = ({ user_id, username }) => {
	const payload = {
		subject: user_id,
		username,
	};
	const options = {
		expiresIn: "1d",
	};

	const secret = process.env.SECRET || "shh";

	return jwt.sign(payload, secret, options);
};
