const Users = require("../users/usersModel");

const validateBody = (req, res, next) => {
	if (!req.body.username || !req.body.password)
		return next({ status: 400, message: "username and password required" });

	next();
};

const checkIfExistingUser = async (req, res, next) => {
	const user = await Users.findBy({ username: req.body.username });

	if (user && req.path === "/register")
		return next({ status: 400, message: "username taken" });

	if (req.path === "/login") {
    if (user)
      req.user = user;
    else
      return next({status: 400, message: "invalid credentials"})
  }

	next();
};

module.exports = { validateBody, checkIfExistingUser };
