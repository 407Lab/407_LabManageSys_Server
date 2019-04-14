const mongoose = require('./db')

const userSchema = mongoose.Schema({
  username: String,
	password: String,
	recheck: String,
	token: String,
	create_time: Date
})


const model = {
  User: mongoose.model('User', userSchema)
}

module.exports = model