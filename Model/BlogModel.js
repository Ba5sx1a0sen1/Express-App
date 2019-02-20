const mongoose = require('mongoose')
const BlogSchema = new mongoose.Schema({
  title: String,
  content: String,
  hidden: {
    default: false,
    type: Boolean
  }
})

const BlogModel = mongoose.model('Blog', BlogSchema)

module.exports = BlogModel