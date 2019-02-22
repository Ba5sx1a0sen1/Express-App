const mongoose = require('mongoose')
const BlogSchema = new mongoose.Schema({
  title: String,
  content: String,
  hidden: {
    default: false,
    type: Boolean
  },
  comments: [mongoose.SchemaTypes.ObjectId],
})

const BlogModel = mongoose.model('Blog', BlogSchema)

module.exports = BlogModel