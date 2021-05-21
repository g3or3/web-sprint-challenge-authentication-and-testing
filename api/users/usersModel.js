const db = require("../../data/dbConfig");

const findBy = (filter) => {
	return db("users").where(filter).first();
};

const addNewUser = async (user) => {
	const [id] = await db("users").insert(user);

	return findBy({ id });
};

module.exports = { findBy, addNewUser };
