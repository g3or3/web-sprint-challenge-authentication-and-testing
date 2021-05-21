const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

	if (!token) 
    return next({ status: 401, message: "token required" });

  const secret = process.env.SECRET || "shh"

	jwt.verify(token, secret, (err, decoded) => {
		if (err) 
      return next({ status: 401, message: "token invalid" });

		req.decoded = decoded;
		next();
	});
};
