const mongoose = require('mongoose')
const CommentSchema = new mongoose.Schema({
  content: String,
  hidden: {
    default: false,
    type: Boolean
  }
})

const CommentModel = mongoose.model('Comment', CommentSchema)

module.exports = CommentModel
