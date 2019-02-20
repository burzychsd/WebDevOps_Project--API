// CURRENT USER
exports.current_user = function(req, res) {
	// because we returned user object in jwtStrategy, we can now access that object and return our own without passport
	res.json({
		id: req.user.id,
		username: req.user.username,
		email: req.user.email,
		notes: req.user.notes,
		date: req.user.date
	});
}