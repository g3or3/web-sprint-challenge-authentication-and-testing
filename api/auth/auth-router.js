const bcrypt = require("bcryptjs");
const buildToken = require('./buildToken')
const Users = require("../users/usersModel");
const { validateBody, checkIfExistingUser } = require("./authMiddleware");
const router = require("express").Router();

router.post("/register", validateBody, checkIfExistingUser, async (req, res) => {
	let { username, password } = req.body;
	const rounds = process.env.ROUNDS || 8;

	password = await bcrypt.hash(password, parseInt(rounds));

	res.json(await Users.addNewUser({ username, password }));
});

router.post("/login", validateBody, checkIfExistingUser, async (req, res, next) => {
	const passwordVerified = await bcrypt.compare(req.body.password, req.user.password)
  
  if (passwordVerified)
		res.json({ message: `welcome, ${req.user.username}`, token: buildToken(req.user) }); 
  else
    next({status: 401, message: "invalid credentials"})
});

module.exports = router;
