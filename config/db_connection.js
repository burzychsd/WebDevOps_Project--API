// environment-specific variables
const username = process.env.DB_USER;
const password = process.env.DB_PASS;
// MongoURL - a key for mongoose connection
module.exports = {
	url: `mongodb://${username}:${password}@ds239873.mlab.com:39873/web-devops-db`
}